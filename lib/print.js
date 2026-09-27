import { WAMessageStubType } from '@rexxhayanasi/elaina-baileys'
import chalk from 'chalk'
import { watchFile } from 'fs'
import { log } from './logger.js'

const urlRegex = (await import('url-regex-safe')).default({ strict: false })

const TYPE_LABEL = {
  conversation: 'teks', extendedText: 'teks', extendedTextMessage: 'teks',
  image: 'gambar', imageMessage: 'gambar',
  video: 'video', videoMessage: 'video',
  audio: 'audio', audioMessage: 'audio',
  sticker: 'stiker', stickerMessage: 'stiker',
  document: 'dokumen', documentMessage: 'dokumen',
  contact: 'kontak', contactMessage: 'kontak',
  contactsArray: 'kontak', contactsArrayMessage: 'kontak',
  location: 'lokasi', locationMessage: 'lokasi',
  liveLocation: 'lokasi', liveLocationMessage: 'lokasi',
  pollCreation: 'polling', pollCreationMessage: 'polling',
  reaction: 'reaksi', reactionMessage: 'reaksi'
}

function humanSize(n = 0) {
  if (!n || n <= 0) return ''
  const u = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(u.length - 1, Math.floor(Math.log(n) / Math.log(1024)))
  return `${(n / 1024 ** i).toFixed(i ? 1 : 0)}${u[i]}`
}

function oneLine(s, max = 140) {
  s = String(s || '').replace(/\u200e+/g, '').replace(/\s+/g, ' ').trim()
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

export default async function (m, conn = { user: {} }) {
  try {
    if (!m?.sender) return

    // Pesan sistem (join/leave/ganti nama grup) — satu baris abu-abu
    if (m.messageStubType && !m.text) {
      const stub = WAMessageStubType[m.messageStubType] || 'sistem'
      log.info(`sistem: ${stub}`)
      return
    }

    const isGroup = typeof m.chat === 'string' && m.chat.endsWith('@g.us')
    let senderName = ''
    try { senderName = await conn.getName(m.sender) || '' } catch {}
    const senderNum = String(m.sender).replace(/@.*/, '')
    const who = m.fromMe ? 'Saya' : (senderName || senderNum)

    let where = ''
    if (isGroup) {
      try { where = ` di ${await conn.getName(m.chat) || 'grup'}` } catch { where = ' di grup' }
    }

    // Tipe pesan
    const raw = m.mtype || ''
    let label = TYPE_LABEL[raw] || raw.replace(/message$/i, '').toLowerCase() || 'teks'
    if (/audio/i.test(raw) && m.msg?.ptt) label = 'vn'

    // Detail media: nama file / durasi / ukuran
    let detail = ''
    if (/document/i.test(raw)) {
      detail = m.msg?.fileName || m.msg?.displayName || ''
    } else if (/audio/i.test(raw) && m.msg?.seconds != null) {
      const d = Number(m.msg.seconds) || 0
      detail = `${String(Math.floor(d / 60)).padStart(2, '0')}:${String(d % 60).padStart(2, '0')}`
    } else if (/contact/i.test(raw)) {
      detail = m.msg?.displayName || ''
    } else if (/location/i.test(raw)) {
      detail = m.msg?.name || ''
    } else if (/poll/i.test(raw)) {
      detail = m.msg?.name || ''
    }
    const fl = m.msg?.fileLength
    const bytes = (fl && typeof fl === 'object' ? (fl.low || 0) : (fl || 0)) || 0
    const size = /image|video|audio|document|sticker/i.test(raw) ? humanSize(bytes) : ''
    const badge = [label, detail, size].filter(Boolean).join(' ').replace(label, label)

    // Preview teks: sebaris, URL tetap biru
    let preview = ''
    if (typeof m.text === 'string' && m.text) {
      preview = oneLine(m.text)
      if (preview.length < 4096) {
        preview = preview.replace(urlRegex, (url, i, text) => {
          const end = url.length + i
          return i === 0 || end === text.length ? chalk.blueBright(url) : url
        })
      }
    }

    const dir = m.fromMe ? '↑' : '↓'
    const msg = preview
      ? `${dir} ${who}${where} [${badge}]: ${preview}`
      : `${dir} ${who}${where} [${badge}]`

    if (m.error != null) log.error(msg)
    else if (m.isCommand) log.cmd(msg)
    else log.chat(msg)
  } catch (e) {
    log.warn('Chat log: ' + (e?.message || e))
  }
}

let file = global.__filename(import.meta.url)
watchFile(file, () => {
  log.info("Update 'lib/print.js'")
})
