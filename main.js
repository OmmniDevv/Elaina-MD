import './config.js'
import { log, printStatus, patchConsole } from './lib/logger.js'
patchConsole()

import { createRequire } from "module" // Bring in the ability to create the 'require' method
import path, { join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() }; global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }; global.__require = function require(dir = import.meta.url) { return createRequire(dir) }

import * as ws from 'ws';
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, mkdirSync, writeFileSync } from 'fs';
import yargs from 'yargs'
import { spawn } from 'child_process'
import lodash from 'lodash'
import syntaxerror from 'syntax-error'
import { tmpdir } from 'os'
import { format } from 'util'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import pino from 'pino'
import { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from '@rexxhayanasi/elaina-baileys'
import qrcode from 'qrcode-terminal'
import './lib/errorLogger.js'
import { startTempCleaner } from './src/lib/elaina-temp-cleaner.js'

const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
// global.Fn = function functionCallBack(fn, ...args) { return fn.call(global.conn, ...args) }
global.timestamp = {
  start: new Date
}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

global.db = new Low(
  new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`),
  {}
)


global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(async function () {
    if (!global.db.READ) {
      clearInterval(this)
      resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
    }
  }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read().catch(e => log.error('DB read: ' + e.message))
  global.db.READ = null
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {})
  }
  global.db.chain = chain(global.db.data)
}
loadDatabase()

global.authFile = `${opts._[0] || 'elaina_session'}`
const { state, saveCreds: _saveCreds } = await useMultiFileAuthState(global.authFile)
let saveCreds = _saveCreds

const usePairingCode = global.usePairingCode === true
const pairingNumber = (global.pairingNumber || '').replace(/[^0-9]/g, '')

// Pin versi WA terbaru dari server — tanpa ini @rexxhayanasi/elaina-baileys pakai VERSION internal
// yang basi, bikin handshake pairing ditolak (Connection Closed) & notif HP nggak muncul.
let baileysVersion
try { baileysVersion = await fetchLatestBaileysVersion() } catch { baileysVersion = undefined }

const connectionOptions = {
  ...(baileysVersion ? { version: baileysVersion.version } : {}),
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
  },
  logger: pino({ level: 'silent' }),
  browser: ['Windows', 'Chrome', '149.0.7827.197'],
  syncFullHistory: false,
  markOnlineOnConnect: false,
  generateHighQualityLinkPreview: false,
  fireInitQueries: false,
  emitOwnEvents: false,
  connectTimeoutMs: 60000,
  defaultQueryTimeoutMs: 60000,
  keepAliveIntervalMs: 30000,
  qrTimeout: 40000,
  getMessage: async (key) => {
    try {
      const jid = global.conn?.decodeJid?.(key.remoteJid) || key.remoteJid
      const chat = global.conn?.chats?.[jid]
      const msg = chat?.messages?.[key.id]
      return msg?.message ? msg.message : undefined
    } catch {
      return undefined
    }
  }
}

global.conn = makeWASocket(connectionOptions)
conn.isInit = false

const PAIRING_TIMEOUT_DURATION = 120000
let pairingTimeout = null
let pairingStartTime = null

async function clearSessionAndRestart() {
  log.error('Waktu pairing habis — membersihkan sesi ...')
  if (pairingTimeout) { clearTimeout(pairingTimeout); pairingTimeout = null }
  try {
    if (existsSync(global.authFile)) {
      const { rm } = await import('fs/promises')
      await rm(global.authFile, { recursive: true, force: true })
    }
  } catch {}
  setTimeout(() => process.exit(1), 2000)
}

async function requestPairing() {
  if (!usePairingCode || conn.authState.creds.registered) return
  let phone = pairingNumber
  if (!phone) {
    const { createInterface } = await import('readline')
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    phone = await new Promise(resolve => rl.question('\x1b[36m📱 Masukkan nomor WA (contoh: 6281234567890): \x1b[0m', ans => { rl.close(); resolve(ans.replace(/[^0-9]/g, '')) }))
  }
  phone = phone.replace(/[^0-9]/g, '')
  global.conn.phoneNumber = phone
  pairingStartTime = Date.now()

  pairingTimeout = setTimeout(() => {
    if (!global.conn?.user) clearSessionAndRestart()
  }, PAIRING_TIMEOUT_DURATION)

  log.auth(`Batas waktu pairing: ${PAIRING_TIMEOUT_DURATION / 1000} detik`)

  // Delay 5s — kasih WS cukup waktu handshake penuh (pola Luna)
  await new Promise(r => setTimeout(r, 5000))

  let codigo = null
  let intentos = 0
  const maxIntentos = 3

  while (intentos < maxIntentos && !global.conn?.user) {
    try {
      intentos++
      log.auth(`Meminta kode pairing ... (${intentos}/${maxIntentos})`)
      codigo = await global.conn.requestPairingCode(phone, 'ELAINAMD')
      if (codigo) {
        codigo = codigo.match(/.{1,4}/g)?.join('-') || codigo
        printPairingBox(codigo)
        break
      }
    } catch (error) {
      log.error(`Pairing percobaan ${intentos} gagal: ${error.message}`)
      if (error.message.includes('rate limit') || error.message.includes('too many')) {
        log.warn('Rate limit — tunggu 10 detik ...')
        await new Promise(r => setTimeout(r, 10000))
      } else if (intentos < maxIntentos) {
        log.info('Coba lagi dalam 3 detik ...')
        await new Promise(r => setTimeout(r, 3000))
      }
    }
  }

  if (!codigo) {
    log.error('Gagal dapat kode setelah 3 percobaan')
    clearSessionAndRestart()
    return
  }

  // Renewal check — tiap 15s cek apakah sudah login atau perlu refresh kode
  let codigoRenovado = false
  const intervaloCodigo = setInterval(async () => {
    if (global.conn?.user) {
      clearInterval(intervaloCodigo)
      if (pairingTimeout) { clearTimeout(pairingTimeout); pairingTimeout = null }
      log.ok('Perangkat berhasil ditautkan')
      return
    }
    if (!pairingTimeout) { clearInterval(intervaloCodigo); return }
    const tiempoRestante = Math.floor((PAIRING_TIMEOUT_DURATION - (Date.now() - pairingStartTime)) / 1000)
    if (tiempoRestante <= 0) { clearInterval(intervaloCodigo); return }
    if (!codigoRenovado && tiempoRestante < 90) {
      try {
        log.auth(`Memperbarui kode ... (${tiempoRestante}dts tersisa)`)
        const nuevoCodigo = await global.conn.requestPairingCode(phone, 'ELAINAMD')
        const formatted = nuevoCodigo?.match(/.{1,4}/g)?.join('-') || nuevoCodigo
        printPairingBox(formatted, tiempoRestante)
        codigoRenovado = true
      } catch (e) {
        if (e.message.includes('rate limit') || e.message.includes('too many')) {
          log.warn('Rate limit saat perbarui — pakai kode lama')
        }
      }
    }
  }, 15000)
}

function printPairingBox(code, sisaSecs) {
  const sisa = sisaSecs ?? Math.floor((PAIRING_TIMEOUT_DURATION - (Date.now() - pairingStartTime)) / 1000)
  console.log('')
  log.auth(`Kode Pairing: ${code}`)
  log.info('1. Buka WhatsApp di HP')
  log.info('2. Pengaturan > Perangkat Tertaut > Tautkan Perangkat')
  log.info(`3. Masukkan kode di atas (berlaku ${sisa} dtk)`)
  console.log('')
}

requestPairing().catch(e => log.error('Pairing: ' + e.message))

// Tombol native flow sekarang dikirim oleh lib/simple.js lewat MB.Button
// (wrapper sendButton/sendBut/send*ButtonDoc/sendHydrated). Fallback teks
// defineProperty lama dihapus supaya tidak menutupi tombol asli.

// Pairing code akan di-request di connectionUpdate saat status 'open' pertama kali

// ── Helper global untuk plugin (dulu hilang setelah refactor lib/) ──
import axios from 'axios'
global.getBuffer = async (url, options) => {
  try {
    const res = await axios({ method: 'get', url, headers: { DNT: 1, 'Upgrade-Insecure-Request': 1 }, ...options, responseType: 'arraybuffer' })
    return res.data
  } catch (e) { log.warn('getBuffer: ' + e.message) }
}
global.fetchJson = async (url, options = {}) => {
  const res = await axios.get(url, { responseType: 'json', ...options })
  return res.data
}
global.fetchText = async (url, options = {}) => {
  const res = await axios.get(url, { responseType: 'text', ...options })
  return res.data
}
global.makeid = (len = 8) => {
  const a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+'
  let s = ''
  for (let i = 0; i < len; i++) s += a.charAt(Math.floor(Math.random() * a.length))
  return s
}
global.runtime = ms => {
  let sec = Math.floor(ms / 1000); let min = Math.floor(sec / 60); let hr = Math.floor(min / 60)
  return `${hr}h ${min % 60}m ${sec % 60}s`
}

if (!opts['test']) {
  setInterval(async () => {
    if (global.db.data) await global.db.write().catch(e => log.error('DB write: ' + e.message))
    if (opts['autocleartmp']) try {
      clearTmp()

    } catch (e) { log.error('Autocleartmp: ' + e.message) }
  }, 60 * 1000)
}
if (opts['server']) (await import('./server.js')).default(global.conn, PORT)


function clearTmp() {
  const tmp = [tmpdir(), join(__dirname, './tmp')]
  const filename = []
  tmp.forEach(dirname => readdirSync(dirname).forEach(file => filename.push(join(dirname, file))))
  return filename.map(file => {
    const stats = statSync(file)
    if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file) // 3 minutes
    return false
  })
}

// ─────────────────────────────────────────────
//  Project info dari package.json
// ─────────────────────────────────────────────
import { createRequire as _cr } from 'module'
const _pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
const PROJECT_NAME = _pkg.name.toUpperCase()          // "ELAINA-MD"
const PROJECT_AUTHOR = _pkg.author?.name || 'OmmniDevv'

function _banner() {
  printStatus('Bot', `${global.namebot || PROJECT_NAME} v${_pkg.version}`)
  printStatus('Owner', PROJECT_AUTHOR)
  printStatus('Session', global.authFile)
  printStatus('Mode', usePairingCode ? `Pairing (${pairingNumber || 'input manual'})` : 'QR Code')
  if (baileysVersion?.version) printStatus('WA Web', `v${baileysVersion.version.join('.')}`)
}
_banner()

async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin, qr } = update
  if (qr && !usePairingCode) {
    global.qrString = qr
    global.qrTime = Date.now()
    log.auth(`Scan QR untuk login (juga di http://127.0.0.1:${PORT}/qr):`)
    try { qrcode.generate(qr, { small: true }) } catch {}
  }
  if (isNewLogin) conn.isInit = true
  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
  const errMsg = lastDisconnect?.error?.message || ''
  const errStack = lastDisconnect?.error?.stack || ''

  if (connection === 'close') {
    // Abaikan disconnect yang disebabkan oleh fetch/undici error (bukan WS baileys)
    const isFetchError = errStack.includes('undici') || errStack.includes('Fetch.') || errStack.includes('onAborted')
    if (isFetchError) return

    const shouldReconnect = code !== DisconnectReason.loggedOut

    if (code === DisconnectReason.loggedOut) {
      // Pairing belum selesai: jangan exit, tunggu user masukkan kode di HP.
      if (usePairingCode && !conn.authState.creds.registered) {
        log.auth('Menunggu kode pairing dimasukkan di WhatsApp ...')
        return
      }
      log.error('Logged out — hapus folder session lalu restart')
      process.exit(0)
    }

    log.warn(`Terputus (code ${code})${errMsg ? ` — ${errMsg}` : ''}${shouldReconnect ? ' — reconnect ...' : ''}`)
    if (shouldReconnect) {
      setTimeout(() => global.reloadHandler(true).catch(e => log.error('Reconnect: ' + e.message)), 3000)
    }
  } else if (connection === 'open') {
    const botName = global.namebot || PROJECT_NAME
    log.ok(`Terhubung sebagai ${botName}`)
    try {
      const flagFile = `./${global.authFile}/.pairing_requested`
      if (existsSync(flagFile)) unlinkSync(flagFile)
    } catch {}
    global.timestamp.connect = new Date

    // ── Auto-notif ke owner saat pertama konek ──
    if (!global._ownerNotified) {
      global._ownerNotified = true
      setTimeout(async () => {
        try {
          const { default: osModule } = await import('os')
          const totalMem = (osModule.totalmem() / 1024 / 1024 / 1024).toFixed(1)
          const freeMem  = (osModule.freemem()  / 1024 / 1024 / 1024).toFixed(2)
          const usedMem  = (osModule.totalmem() - osModule.freemem())
          const usedMemMB = (usedMem / 1024 / 1024).toFixed(0)
          const cpuModel = osModule.cpus()[0]?.model?.replace(/\s+/g, ' ').trim() || 'Unknown CPU'
          const cpuCount = osModule.cpus().length
          const platform = osModule.platform()
          const arch     = osModule.arch()
          const hostname = osModule.hostname()
          const uptime   = osModule.uptime()
          const uptimeFmt = `${Math.floor(uptime/3600)}j ${Math.floor((uptime%3600)/60)}m`
          const pluginCount = Object.keys(global.plugins || {}).length
          const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false })
          const waVer = baileysVersion?.version?.join('.') || 'unknown'
          const bootMs = Date.now() - (global.timestamp?.start?.getTime?.() || Date.now())
          const bootSec = (bootMs / 1000).toFixed(1)

          const msg =
`╭─────────────────────────╮
│  🌸 *${botName}* — ONLINE  │
╰─────────────────────────╯

✅ Bot berhasil terhubung ke WhatsApp~

╭── *🤖 INFO BOT* ──────────
│ 📛 Nama     : ${botName}
│ 🏷️ Versi    : v${_pkg.version}
│ 📁 Session  : ${global.authFile}
│ ⚡ Plugin   : ${pluginCount} dimuat
│ 🕒 Boot     : ${bootSec}s
╰────────────────────────────

╭── *💻 INFO SISTEM* ────────
│ 🖥️ Host     : ${hostname}
│ 🐧 OS       : ${platform} (${arch})
│ ⚙️ CPU      : ${cpuModel}
│ 🔢 Core     : ${cpuCount} vCPU
│ 🧠 RAM      : ${usedMemMB}MB / ${totalMem}GB
│ 💾 RAM Free : ${freeMem}GB
│ ⏱️ Uptime   : ${uptimeFmt}
╰────────────────────────────

╭── *📡 WHATSAPP* ───────────
│ 📶 WA Web  : v${waVer}
│ 🕐 Konek   : ${now}
╰────────────────────────────

_Elaina siap melayani Master! ✨_`

          const targetJids = new Set()
          const rawOwn = String(global.nomorown || '').replace(/[^0-9]/g, '')
          if (rawOwn) targetJids.add(`${rawOwn}@s.whatsapp.net`)
          
          for (const item of (global.owner || [])) {
            const val = Array.isArray(item) ? item[0] : item
            const clean = String(val || '').replace(/[^0-9]/g, '')
            if (clean.length >= 10) {
              if (clean.length > 14) {
                targetJids.add(`${clean}@lid`)
              } else {
                targetJids.add(`${clean}@s.whatsapp.net`)
              }
            }
          }

          for (const target of targetJids) {
            if (global.conn?.sendMessage) {
              await global.conn.sendMessage(target, { text: msg }).catch(() => {})
            }
          }
          log.ok(`Notifikasi online terkirim ke owner (${[...targetJids].join(', ')})`)
        } catch (e) {
          log.error('Auto notif owner: ' + e.message)
        }
      }, 4000)
    }
  }
  if (global.db.data == null) loadDatabase()
}


process.on('uncaughtException', (err) => {
  // Logging ditangani oleh lib/errorLogger.js
  // Reconnect hanya untuk error WebSocket, bukan fetch/HTTP
  const isFetchError = err.stack && (err.stack.includes('undici') || err.stack.includes('node-fetch') || err.stack.includes('Fetch.') || err.stack.includes('onAborted'))
  if (!isFetchError && /terminated|connection reset|ECONNRESET|ETIMEDOUT/i.test(err.message)) {
    global.reloadHandler(true).catch(e => log.error('Reconnect: ' + e.message))
  }
})
// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

let isInit = true;
let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(e => log.error('Handler reload: ' + e.message))
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    log.error('Handler: ' + e.message)
  }
  if (restatConn) {
    const oldChats = global.conn.chats
    try { global.conn.ws.close() } catch { }
    conn.ev.removeAllListeners()
    // Refresh auth state dari disk sebelum buat koneksi baru
    const { state: newState, saveCreds: newSaveCreds } = await useMultiFileAuthState(global.authFile)
    connectionOptions.auth = {
      creds: newState.creds,
      keys: makeCacheableSignalKeyStore(newState.keys, pino({ level: 'silent' }))
    }
    global.conn = makeWASocket(connectionOptions, { chats: oldChats })
    // Update saveCreds reference ke yang baru
    saveCreds = newSaveCreds
    isInit = true
  }
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('group-participants.update', conn.participantsUpdate)
    conn.ev.off('groups.update', conn.groupsUpdate)
    conn.ev.off('message.delete', conn.onDelete)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }

  conn.welcome = '❖━━━━━━[ *いらっしゃいませ* ]━━━━━━❖\n\n┏––––––━━━━━━━━•\n│☘︎ @subject\n┣━━━━━━━━┅┅┅\n│( 👋 Hallo @user)\n├[ *ɪɴᴛʀᴏ* ]—\n│ *ɴᴀᴍᴀ:* \n│ *ᴜᴍᴜʀ:* \n│ *ɢᴇɴᴅᴇʀ:*\n┗––––––━━┅┅┅\n\n––––––┅┅ *ᴅᴇsᴄʀɪᴘᴛɪᴏɴ* ┅┅––––––\n@desc'
  conn.bye = '❖━━━━━━[ *さようなら* ]━━━━━━❖\n𝚂𝚊𝚢𝚘𝚗𝚊𝚛𝚊𝚊 *@user* 👋😃'
  conn.spromote = '@user sekarang admin!'
  conn.sdemote = '@user sekarang bukan admin!'
  conn.sDesc = 'Deskripsi telah diubah ke \n@desc'
  conn.sSubject = 'Judul grup telah diubah ke \n@subject'
  conn.sIcon = 'Icon grup telah diubah!'
  conn.sRevoke = 'Link group telah diubah ke \n@revoke'
  conn.handler = handler.handler.bind(global.conn)
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
  conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
  conn.onDelete = handler.deleteUpdate.bind(global.conn)
  conn.connectionUpdate = connectionUpdate.bind(global.conn)
  conn.credsUpdate = saveCreds.bind(global.conn)

  if (!conn.handler) log.error('handler.handler is undefined!')
  
  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('group-participants.update', conn.participantsUpdate)
  conn.ev.on('groups.update', conn.groupsUpdate)
  conn.ev.on('message.delete', conn.onDelete)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  log.info('Event handler terpasang')
  return true
}

const pluginFolder = join(__dirname, './plugins')
const pluginFilter = filename => /\.js$/.test(filename) && !filename.endsWith('.disabled')

// Recursively collect all .js files from plugins/ and its subfolders
function collectPluginFiles(dir) {
  const files = []
  // Skip node_modules and other non-plugin directories
  if (dir.includes('node_modules') || dir.includes('.git')) return files
  
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    // Skip node_modules, lib, and test directories
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'lib' || entry.name === 'test') continue
    
    if (entry.isDirectory()) {
      files.push(...collectPluginFiles(full))
    } else if (pluginFilter(entry.name)) {
      files.push(full)
    }
  }
  return files
}

global.plugins = {}

function normalizePluginModule(module) {
  if (!module) return null
  const mod = module.default || module
  if (typeof mod === 'function') return mod

  const cfg = module.config || mod.config
  const hdl = module.handler || mod.handler
  if (cfg && typeof hdl === 'function') {
    const fn = async function(m, extra = {}) {
      return hdl.call(this, m, {
        sock: this,
        conn: this,
        store: global.store,
        config: cfg,
        plugins: global.plugins,
        ...extra
      })
    }
    const names = [
      ...(Array.isArray(cfg.name) ? cfg.name : cfg.name ? [cfg.name] : []),
      ...(Array.isArray(cfg.alias) ? cfg.alias : cfg.alias ? [cfg.alias] : [])
    ].filter(v => v && typeof v === 'string')
    fn.help = names
    fn.tags = [cfg.category || 'tools']
    if (names.length > 0) {
      fn.command = new RegExp(`^(${names.map(v => v.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')).join('|')})$`, 'i')
    }
    fn.owner = cfg.isOwner || false
    fn.premium = cfg.isPremium || false
    fn.group = cfg.isGroup || false
    fn.private = cfg.isPrivate || false
    fn.admin = cfg.isAdmin || false
    fn.botAdmin = cfg.isBotAdmin || false
    fn.limit = cfg.limit || false
    return fn
  }

  return mod
}

async function filesInit() {
  const files = collectPluginFiles(pluginFolder)
  let loaded = 0
  let failed = 0
  for (const file of files) {
    const key = file.replace(pluginFolder + '/', '').replace(pluginFolder + path.sep, '')
    try {
      const fileUrl = pathToFileURL(path.resolve(file)).href
      const module = await import(fileUrl)
      global.plugins[key] = normalizePluginModule(module)
      loaded++
    } catch (e) {
      failed++
      log.error(`Plugin ${key}: ${e.message}`)
      delete global.plugins[key]
    }
  }
  if (failed > 0) log.warn(`${failed} plugin gagal dimuat`)
  log.plugin(`${loaded} plugin dimuat`)
}
filesInit().catch(e => log.error(`Plugin init gagal: ${e.message}`))
startTempCleaner()

global.reload = async (_ev, filename) => {
  if (!pluginFilter(filename)) return
  // filename dari watcher recursive = path relatif terhadap pluginFolder (mis. main/menu.js)
  const rel = String(filename).replace(/\\/g, '/')
  if (!rel.endsWith('.js') || rel.endsWith('.disabled')) return
  const dir = join(pluginFolder, rel)
  // Atomic-save editor bisa bikin file sementara hilang saat event fired — cek dulu.
  if (!existsSync(dir)) {
    if (rel in global.plugins) {
      log.warn(`Plugin dihapus: ${rel}`)
      delete global.plugins[rel]
    }
    return
  }
  const isUpdate = rel in global.plugins
  let err
  try {
    err = syntaxerror(readFileSync(dir), rel, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true
    })
  } catch (e) {
    log.error(`Plugin ${rel} gagal dibaca: ${e.message}`)
    return
  }
  if (err) log.error(`Plugin ${rel} syntax error\n${format(err)}`)
  else try {
    const fileUrl = pathToFileURL(path.resolve(dir)).href + '?update=' + Date.now()
    const module = await import(fileUrl)
    global.plugins[rel] = normalizePluginModule(module)
    log.plugin(`${isUpdate ? 'Reload' : 'Baru'}: ${rel}`)
  } catch (e) {
    log.error(`Plugin ${rel}: ${format(e).split('\n')[0]}`)
  } finally {
    global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
  }
}
Object.freeze(global.reload)
// Recursive watcher sekali di root — Node >=20 dukung { recursive:true }.
try { watch(pluginFolder, { recursive: true }, global.reload) } catch (e) {
  log.error('Plugin watcher gagal start: ' + e.message)
}
await global.reloadHandler()

// Quick Test — cek binary pendukung (ffmpeg, imagemagick, find)
async function _quickTest() {
  const names = ['ffmpeg', 'ffprobe', 'ffmpegWebp', 'convert', 'magick', 'gm', 'find']
  const procs = [
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version'])
  ]
  let test = await Promise.all(procs.map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127)
        })
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false))
      })
    ])
  }))
  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find
  }
  Object.freeze(global.support)

  const ok = names.filter((_, i) => test[i])
  const missing = names.filter((_, i) => !test[i])
  log.info(`System check: ${ok.join(', ')}${missing.length ? ` (hilang: ${missing.join(', ')})` : ''}`)
  if (!s.ffmpeg) log.warn('ffmpeg belum ada — video/stiker mungkin gagal (pkg install ffmpeg)')
  if (s.ffmpeg && !s.ffmpegWebp) log.warn('ffmpeg tanpa libwebp — stiker animasi mungkin gagal')
  if (!s.convert && !s.magick && !s.gm) log.warn('imagemagick belum ada — stiker mungkin gagal (pkg install imagemagick)')
}

_quickTest()
  .then(() => log.ok('System check selesai'))
  .catch((e) => log.error('System check: ' + e.message))