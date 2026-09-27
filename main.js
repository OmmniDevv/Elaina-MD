import './config.js'

// Filter noise libsignal: jangan cetak dump SessionEntry / ratchet state (bocorin key). Pola Luna-Botv6.
const _origConsoleInfo = console.info.bind(console)
const _origConsoleWarn = console.warn.bind(console)
const SIGNAL_SESSION_NOISE = /Closing session|Opening session|Session already closed|Removing old closed session|Migrating session to|SessionEntry \{/
console.info = (...args) => { if (typeof args[0] === 'string' && SIGNAL_SESSION_NOISE.test(args[0])) return; _origConsoleInfo(...args) }
console.warn = (...args) => { if (typeof args[0] === 'string' && SIGNAL_SESSION_NOISE.test(args[0])) return; _origConsoleWarn(...args) }

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
import { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from 'ourin-baileys'
import qrcode from 'qrcode-terminal'
import './lib/errorLogger.js'

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
  await global.db.read().catch(console.error)
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

// Pin versi WA terbaru dari server — tanpa ini ourin-baileys pakai VERSION internal
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
  console.log('\x1b[31m[ ✖ ] Timeout pairing tercapai. Bersihkan sesi...\x1b[0m')
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

  console.log(`\x1b[33m[ ⏰ ] Kamu punya ${PAIRING_TIMEOUT_DURATION / 1000}s untuk menyelesaikan pairing\x1b[0m`)

  // Delay 5s — kasih WS cukup waktu handshake penuh (pola Luna)
  await new Promise(r => setTimeout(r, 5000))

  let codigo = null
  let intentos = 0
  const maxIntentos = 3

  while (intentos < maxIntentos && !global.conn?.user) {
    try {
      intentos++
      console.log(`\x1b[33m[ ℹ️ ] Request pairing code... (coba ${intentos}/${maxIntentos})\x1b[0m`)
      codigo = await global.conn.requestPairingCode(phone, 'ELAINAMD')
      if (codigo) {
        codigo = codigo.match(/.{1,4}/g)?.join('-') || codigo
        console.log('\n\x1b[32m┌─────────────────────────────────────────┐\x1b[0m')
        console.log('\x1b[32m│\x1b[1m 📱 PAIRING CODE:\x1b[0m')
        console.log(`\x1b[33m   ${codigo}\x1b[0m`)
        console.log('\x1b[32m├─────────────────────────────────────────┤\x1b[0m')
        console.log('\x1b[36m│ 1. Buka WhatsApp di HP\x1b[0m')
        console.log('\x1b[36m│ 2. Settings → Linked Devices\x1b[0m')
        console.log('\x1b[36m│ 3. Link a Device\x1b[0m')
        console.log('\x1b[36m│ 4. Link with phone number\x1b[0m')
        console.log('\x1b[36m│ 5. Masukkan kode di atas\x1b[0m')
        const sisa = Math.floor((PAIRING_TIMEOUT_DURATION - (Date.now() - pairingStartTime)) / 1000)
        console.log(`\x1b[31m│ ⚠ Sisa waktu: ${sisa}s\x1b[0m`)
        console.log('\x1b[32m└─────────────────────────────────────────┘\x1b[0m\n')
        break
      }
    } catch (error) {
      console.error(`\x1b[31m[ ● ] Error coba ${intentos}:\x1b[0m`, error.message)
      if (error.message.includes('rate limit') || error.message.includes('too many')) {
        console.log('\x1b[33m[ ⏳ ] Rate limit. Tunggu 10s...\x1b[0m')
        await new Promise(r => setTimeout(r, 10000))
      } else if (intentos < maxIntentos) {
        console.log('\x1b[33m[ ↻ ] Retry dalam 3s...\x1b[0m')
        await new Promise(r => setTimeout(r, 3000))
      }
    }
  }

  if (!codigo) {
    console.log('\x1b[31m[ ● ] Gagal dapat kode setelah 3 percobaan.\x1b[0m')
    clearSessionAndRestart()
    return
  }

  // Renewal check — tiap 15s cek apakah sudah login atau perlu refresh kode
  let codigoRenovado = false
  const intervaloCodigo = setInterval(async () => {
    if (global.conn?.user) {
      clearInterval(intervaloCodigo)
      if (pairingTimeout) { clearTimeout(pairingTimeout); pairingTimeout = null }
      console.log('\x1b[32m[ ✅ ] Perangkat berhasil ditautkan!\x1b[0m')
      return
    }
    if (!pairingTimeout) { clearInterval(intervaloCodigo); return }
    const tiempoRestante = Math.floor((PAIRING_TIMEOUT_DURATION - (Date.now() - pairingStartTime)) / 1000)
    if (tiempoRestante <= 0) { clearInterval(intervaloCodigo); return }
    if (!codigoRenovado && tiempoRestante < 90) {
      try {
        console.log(`\x1b[33m[ ℹ️ ] Renovasi kode... (${tiempoRestante}s tersisa)\x1b[0m`)
        const nuevoCodigo = await global.conn.requestPairingCode(phone, 'ELAINAMD')
        const formatted = nuevoCodigo?.match(/.{1,4}/g)?.join('-') || nuevoCodigo
        console.log(`\x1b[32m[ 🔄 ] Kode baru: ${formatted}  (${tiempoRestante}s tersisa)\x1b[0m`)
        codigoRenovado = true
      } catch (e) {
        if (e.message.includes('rate limit') || e.message.includes('too many')) {
          console.log('\x1b[33m[ ⚠ ] Rate limit renovasi. Lanjut kode lama.\x1b[0m')
        }
      }
    }
  }, 15000)
}

requestPairing().catch(e => console.error('[PAIRING]', e.message))

// Patch deprecated button methods → plain sendMessage fallback
// Buttons API sudah tidak didukung WA, fallback ke text biasa
;['sendBut', 'send2Button', 'send3Button'].forEach(fn => {
  try {
    Object.defineProperty(conn, fn, {
      value: async (jid, content, footer, ...rest) => {
        const quoted = rest.find(r => r && typeof r === 'object' && r.key)
        return conn.sendMessage(jid, { text: `${content}\n\n_${footer || ''}_`.trim(), ...global.adReply }, { quoted })
      },
      writable: true, configurable: true
    })
  } catch {}
})
try {
  Object.defineProperty(conn, 'sendButton', {
    value: async (jid, text, footer, buffer, buttons, quoted, options) => {
      if (Array.isArray(buffer)) { options = quoted; quoted = buttons; buttons = buffer; buffer = null }
      const btnText = Array.isArray(buttons) ? buttons.map(b => Array.isArray(b) ? `• ${b[0]}` : `• ${b}`).join('\n') : ''
      return conn.sendMessage(jid, { text: `${text}\n\n${btnText}\n\n_${footer || ''}_`.trim(), ...global.adReply, ...options }, { quoted })
    },
    writable: true, configurable: true
  })
} catch {}
try {
  Object.defineProperty(conn, 'sendButtonDoc', {
    value: async (jid, content, footer, btn1, id1, quoted, options) => {
      return conn.sendMessage(jid, { text: `${content}\n\n• ${btn1}\n\n_${footer || ''}_`.trim(), ...global.adReply, ...options }, { quoted })
    },
    writable: true, configurable: true
  })
} catch {}

// Pairing code akan di-request di connectionUpdate saat status 'open' pertama kali

// ── Helper global untuk plugin (dulu hilang setelah refactor lib/) ──
import axios from 'axios'
global.getBuffer = async (url, options) => {
  try {
    const res = await axios({ method: 'get', url, headers: { DNT: 1, 'Upgrade-Insecure-Request': 1 }, ...options, responseType: 'arraybuffer' })
    return res.data
  } catch (e) { console.log(`getBuffer Error: ${e}`) }
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
    if (global.db.data) await global.db.write().catch(console.error)
    if (opts['autocleartmp']) try {
      clearTmp()

    } catch (e) { console.error(e) }
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
  const line = '─'.repeat(50)
  console.log(`\n\x1b[36m${line}\x1b[0m`)
  console.log(`\x1b[1m\x1b[35m  ★  ${PROJECT_NAME}\x1b[0m`)
  console.log(`\x1b[90m  By ${PROJECT_AUTHOR}  •  v${_pkg.version}\x1b[0m`)
  console.log(`\x1b[36m${line}\x1b[0m\n`)
}
_banner()

function _tag(label, color = '\x1b[36m') {
  return `${color}[${label}]\x1b[0m`
}

async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin, qr } = update
  if (qr && !usePairingCode) {
    global.qrString = qr
    global.qrTime = Date.now()
    console.log(`${_tag('QR', '\x1b[36m')} \x1b[36mScan QR ini untuk login (juga tersedia di http://127.0.0.1:${PORT}/qr):\x1b[0m`)
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
        console.log(`${_tag('PAIRING', '\x1b[33m')} \x1b[33mMenunggu kode pairing dimasukkan di WhatsApp...\x1b[0m`)
        return
      }
      console.log(`${_tag('SESSION', '\x1b[31m')} \x1b[31mLogged out\x1b[0m — hapus folder session lalu restart`)
      process.exit(0)
    }

    console.log(`${_tag('CONN', '\x1b[33m')} \x1b[33mDisconnected\x1b[0m — code: ${code} reconnect: ${shouldReconnect}${errMsg ? ` (${errMsg})` : ''}`)
    if (shouldReconnect) {
      setTimeout(() => global.reloadHandler(true).catch(console.error), 3000)
    }
  } else if (connection === 'open') {
    const botName = global.namebot || PROJECT_NAME
    console.log(`${_tag('CONN', '\x1b[32m')} \x1b[32mConnected\x1b[0m — berjalan sebagai \x1b[1m${botName}\x1b[0m`)
    try {
      const flagFile = `./${global.authFile}/.pairing_requested`
      if (existsSync(flagFile)) unlinkSync(flagFile)
    } catch {}
    global.timestamp.connect = new Date
  }
  if (global.db.data == null) loadDatabase()
}


process.on('uncaughtException', (err) => {
  // Logging ditangani oleh lib/errorLogger.js
  // Reconnect hanya untuk error WebSocket, bukan fetch/HTTP
  const isFetchError = err.stack && (err.stack.includes('undici') || err.stack.includes('node-fetch') || err.stack.includes('Fetch.') || err.stack.includes('onAborted'))
  if (!isFetchError && /terminated|connection reset|ECONNRESET|ETIMEDOUT/i.test(err.message)) {
    global.reloadHandler(true).catch(console.error)
  }
})
// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

let isInit = true;
let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e)
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

  if (!conn.handler) console.error(`${_tag('ERROR', '\x1b[31m')} handler.handler is undefined!`)
  
  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('group-participants.update', conn.participantsUpdate)
  conn.ev.on('groups.update', conn.groupsUpdate)
  conn.ev.on('message.delete', conn.onDelete)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  console.log(`${_tag('HANDLER', '\x1b[36m')} Event listeners attached`)
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
async function filesInit() {
  const files = collectPluginFiles(pluginFolder)
  let loaded = 0
  let failed = 0
  for (const file of files) {
    const key = file.replace(pluginFolder + '/', '').replace(pluginFolder + path.sep, '')
    try {
      const fileUrl = pathToFileURL(path.resolve(file)).href
      const module = await import(fileUrl)
      global.plugins[key] = module.default || module
      loaded++
    } catch (e) {
      failed++
      if (global.conn?.logger) {
        conn.logger.error(`Failed to load ${key}: ${e.message}`)
      } else {
        console.error(`Failed to load ${key}:`, e.message)
      }
      delete global.plugins[key]
    }
  }
  console.log(`${_tag('PLUGIN', '\x1b[32m')} \x1b[32m${loaded} plugins loaded\x1b[0m${failed > 0 ? ` \x1b[31m(${failed} failed)\x1b[0m` : ''}`)
}
filesInit().catch(console.error)

global.reload = async (_ev, filename) => {
  if (!pluginFilter(filename)) return
  // filename dari watcher recursive = path relatif terhadap pluginFolder (mis. main/menu.js)
  const rel = String(filename).replace(/\\/g, '/')
  if (!rel.endsWith('.js') || rel.endsWith('.disabled')) return
  const dir = join(pluginFolder, rel)
  // Atomic-save editor bisa bikin file sementara hilang saat event fired — cek dulu.
  if (!existsSync(dir)) {
    if (rel in global.plugins) {
      conn.logger.warn(`deleted plugin '${rel}'`)
      delete global.plugins[rel]
    }
    return
  }
  if (rel in global.plugins) conn.logger.info(`re - require plugin '${rel}'`)
  else conn.logger.info(`requiring new plugin '${rel}'`)
  let err
  try {
    err = syntaxerror(readFileSync(dir), rel, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true
    })
  } catch (e) {
    conn.logger.error(`error read plugin '${rel}': ${e.message}`)
    return
  }
  if (err) conn.logger.error(`syntax error while loading '${rel}'\n${format(err)}`)
  else try {
    const fileUrl = pathToFileURL(path.resolve(dir)).href + '?update=' + Date.now()
    const module = await import(fileUrl)
    global.plugins[rel] = module.default || module
    conn.logger.info(`loaded plugin '${rel}' ✓`)
  } catch (e) {
    conn.logger.error(`error require plugin '${rel}\n${format(e)}`)
  } finally {
    global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
  }
}
Object.freeze(global.reload)
// Recursive watcher sekali di root — Node >=20 dukung { recursive:true }.
try { watch(pluginFolder, { recursive: true }, global.reload) } catch (e) {
  conn.logger.error(`plugin watcher gagal start: ${e.message}`)
}
await global.reloadHandler()

// Quick Test
async function _quickTest() {
  let test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version'])
  ].map(p => {
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
  console.log(test)
  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find
  }
  // require('./lib/sticker').support = s
  Object.freeze(global.support)

  if (!s.ffmpeg) conn.logger.warn('Please install ffmpeg for sending videos (pkg install ffmpeg)')
  if (s.ffmpeg && !s.ffmpegWebp) conn.logger.warn('Stickers may not animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)')
  if (!s.convert && !s.magick && !s.gm) conn.logger.warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)')
}

_quickTest()
  .then(() => console.log(`${_tag('TEST', '\x1b[32m')} \x1b[32mQuick test selesai\x1b[0m`))
  .catch((e) => console.error(`${_tag('TEST', '\x1b[31m')} \x1b[31m${e.message}\x1b[0m`))