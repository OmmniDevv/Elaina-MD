/**
 * Elaina-MD — https://github.com/OmmniDevv/Elaina-MD
 * Script by OmmniDevv — Jangan Dijual!
 */
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { fileTypeFromBuffer } from 'file-type'
import mime from 'mime-types'
import fetch from 'node-fetch'

const te = (p, c, n) => `☢ *ᴇʀʀᴏʀ*\n\nKendala pada \`${p}${c}\`, coba lagi nanti ${n}`

// ─── OCR ───────────────────────────────────────────────────
let handler = async (m, { conn, usedPrefix, command }) => {
  const isImg = /image/.test((m.quoted?.msg || m.msg || m)?.mimetype || '')
  if (!isImg) throw `⚠️ Reply gambar dengan \`${usedPrefix}${command}\``
  conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
  m.reply('_Mengekstrak teks dari gambar..._')
  const buf = m.quoted ? await m.quoted.download() : await m.download()
  if (!buf?.length) throw '❌ Gagal download gambar'
  const { default: Tesseract } = await import('tesseract.js')
  const { data: { text } } = await Tesseract.recognize(buf, 'eng+ind', {})
  const extracted = text?.trim()
  if (!extracted) throw '❌ Tidak ada teks yang terdeteksi'
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  m.reply(`📖 *ᴏᴄʀ ʀᴇsᴜʟᴛ*\n\n${extracted}\n\n> Total: ${extracted.length} karakter`)
}
handler.help = ['ocr (reply gambar)']
handler.tags = ['tools']
handler.command = /^(ocr|totext|imagetotext|readtext)$/i
export default handler

// ─── Remove Background ─────────────────────────────────────
export const removebgHandler = async (m, { conn, usedPrefix, command }) => {
  const isImg = /image/.test((m.quoted?.msg || m.msg || m)?.mimetype || '')
  if (!isImg) throw `❌ Reply gambar dengan \`${usedPrefix}${command}\``
  conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
  const buf = m.quoted ? await m.quoted.download() : await m.download()
  if (!buf) throw '❌ Gagal download gambar'
  // Try remove.bg free tier via photroom
  const form = new FormData()
  form.append('image_file', buf, { filename: 'image.jpg', contentType: 'image/jpeg' })
  const res = await axios.post('https://sdk.photoroom.com/v1/segment', form, {
    headers: { ...form.getHeaders(), 'x-api-key': 'sandbox_' },
    responseType: 'arraybuffer',
    timeout: 60000
  }).catch(async () => {
    // fallback: pixelcut
    const form2 = new FormData()
    form2.append('image', new Blob([buf], { type: 'image/jpeg' }), 'image.jpg')
    form2.append('format', 'png')
    form2.append('model', 'v1')
    return fetch('https://api2.pixelcut.app/image/matte/v1', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
        'x-locale': 'en',
        'x-client-version': 'web:pixa.com:4a5b0af2',
        'origin': 'https://www.pixa.com',
        'referer': 'https://www.pixa.com/'
      },
      body: form2
    }).then(r => ({ data: r.arrayBuffer().then(ab => Buffer.from(ab)) }))
  })
  const result = Buffer.from(res.data)
  await conn.sendMessage(m.chat, { image: { url: result }, caption: '✅ *Background dihapus!*' }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
removebgHandler.help = ['removebg (reply gambar)']
removebgHandler.tags = ['tools']
removebgHandler.command = /^(removebg|rmbg|nobg|hapusbg)$/i

// ─── HD Enhance ────────────────────────────────────────────
export const hdHandler = async (m, { conn, usedPrefix, command }) => {
  const isImg = /image/.test((m.quoted?.msg || m.msg || m)?.mimetype || '')
  if (!isImg) throw `✨ *REMINI*\n\nReply gambar dengan \`${usedPrefix}${command}\``
  conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
  const buf = m.quoted ? await m.quoted.download() : await m.download()
  if (!buf) throw '❌ Gagal download gambar'
  // Try ootaizumi first
  let resultUrl = null
  try {
    const form = new FormData()
    form.append('image', buf, { filename: 'image.jpg', contentType: 'image/jpeg' })
    const r = await axios.post('https://api.ootaizumi.web.id/tools/upscale', form, {
      headers: { ...form.getHeaders() }, timeout: 120000
    })
    if (r.data?.status && r.data?.result?.imageUrl) resultUrl = r.data.result.imageUrl
  } catch {}
  if (!resultUrl) throw '❌ Gagal enhance gambar'
  await conn.sendMessage(m.chat, { image: { url: resultUrl }, caption: '✨ *Gambar berhasil di-enhance!*' }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
hdHandler.help = ['remini (reply gambar)', 'hd (reply gambar)']
hdHandler.tags = ['tools']
hdHandler.command = /^(remini|hd|enhance|upscale)$/i

// ─── Transkrip (Speech to Text via Groq) ───────────────────
export const transkripHandler = async (m, { conn, usedPrefix, command }) => {
  const q = m.quoted || m
  const isAudio = /audio/.test((q.msg || q)?.mimetype || '') || q.type === 'audioMessage'
  if (!isAudio) throw `🎤 *ᴛʀᴀɴsᴋʀɪᴘ*\n\nReply voice note dengan \`${usedPrefix}${command}\``
  const groqKey = global.APIKeys?.groq
  if (!groqKey) throw '❌ API Key Groq belum diset di config.js → global.APIKeys.groq\nGratis di https://console.groq.com'
  conn.sendMessage(m.chat, { react: { text: '🎤', key: m.key } })
  const tmpDir = path.join(process.cwd(), 'tmp')
  fs.mkdirSync(tmpDir, { recursive: true })
  const inputFile = path.join(tmpDir, `stt_${Date.now()}.ogg`)
  const wavFile = path.join(tmpDir, `stt_${Date.now()}.wav`)
  try {
    const buf = await q.download()
    if (!buf || buf.length < 500) throw '❌ Audio terlalu kecil'
    fs.writeFileSync(inputFile, buf)
    await new Promise((res, rej) => exec(`ffmpeg -y -i "${inputFile}" -ar 16000 -ac 1 -f wav "${wavFile}"`, { timeout: 30000 }, e => e ? rej(e) : res()))
    const wavBuf = fs.readFileSync(wavFile)
    const form = new FormData()
    form.append('file', wavBuf, { filename: 'audio.wav', contentType: 'audio/wav' })
    form.append('model', 'whisper-large-v3')
    form.append('language', 'id')
    form.append('response_format', 'json')
    const { data } = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', form, {
      headers: { ...form.getHeaders(), 'Authorization': `Bearer ${groqKey}` },
      timeout: 60000, maxContentLength: Infinity
    })
    const text = data.text?.trim()
    if (!text) throw '❌ Tidak dapat mendeteksi suara'
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    m.reply(`🎤 *ᴛʀᴀɴsᴋʀɪᴘ*\n\n${text}\n\n> 🤖 Whisper Large V3 | Bahasa: Indonesia`)
  } finally {
    [inputFile, wavFile].forEach(f => { try { fs.unlinkSync(f) } catch {} })
  }
}
transkripHandler.help = ['transkrip (reply VN)']
transkripHandler.tags = ['tools']
transkripHandler.command = /^(transkrip|stt|speechtotext|transcribe)$/i

// ─── Upload to URL (multi-host) ────────────────────────────
async function uploadToCatbox(buffer, filename) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, { filename, contentType: mime.lookup(filename) || 'application/octet-stream' })
  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form, headers: form.getHeaders(), timeout: 30000 })
  if (!res.ok) throw new Error('Catbox gagal')
  const url = await res.text()
  if (!url.startsWith('http')) throw new Error('Invalid response')
  return { host: 'Catbox', url, expires: 'Permanent' }
}

async function uploadToGofile(buffer, filename) {
  const serverRes = await fetch('https://api.gofile.io/servers', { timeout: 10000 })
  const serverData = await serverRes.json()
  const server = serverData?.data?.servers?.[0]?.name
  if (!server) throw new Error('Gofile server gagal')
  const form = new FormData()
  form.append('file', buffer, { filename, contentType: mime.lookup(filename) || 'application/octet-stream' })
  const res = await fetch(`https://${server}.gofile.io/uploadFile`, { method: 'POST', body: form, headers: form.getHeaders(), timeout: 60000 })
  const data = await res.json()
  if (!data?.data?.downloadPage) throw new Error('Gofile invalid response')
  return { host: 'Gofile', url: data.data.downloadPage, expires: 'Permanent' }
}

export const tourlHandler = async (m, { conn, usedPrefix, command }) => {
  const q = m.quoted || m
  const mime_ = (q.msg || q)?.mimetype || ''
  if (!mime_ || /text/.test(mime_)) throw '⚠️ Reply media (gambar/video/audio/file)!'
  conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
  const buf = q.download ? await q.download() : await m.download()
  if (!buf?.length) throw '❌ Gagal download media'
  const ext = (await fileTypeFromBuffer(buf))?.ext || 'bin'
  const filename = `file.${ext}`
  const results = []
  for (const fn of [uploadToCatbox, uploadToGofile]) {
    try { results.push(await fn(buf, filename)) } catch {}
  }
  if (!results.length) throw '❌ Semua upload gagal!'
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  let txt = `📤 *ᴜᴘʟᴏᴀᴅ ʀᴇsᴜʟᴛ*\n\n`
  results.forEach(r => { txt += `*${r.host}* (${r.expires})\n🔗 ${r.url}\n\n` })
  m.reply(txt.trim())
}
tourlHandler.help = ['tourl (reply media)']
tourlHandler.tags = ['tools']
tourlHandler.command = /^(tourl|upload|catbox|url)$/i
