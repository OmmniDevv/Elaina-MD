/**
 * Elaina-MD — https://github.com/OmmniDevv/Elaina-MD
 * Script by OmmniDevv — Jangan Dijual!
 */
import axios from 'axios'
import fs from 'fs'
import path from 'path'

// ponytail: ttsGroq dibuang (butuh API key). gtts = no-key, aman VPS/Pterodactyl. Upgrade when nemu TTS no-key berkualitas > gtts.
async function ttsGtts(text, lang = 'id') {
  const { default: gtts } = await import('gtts')
  const tmpDir = path.join(process.cwd(), 'tmp')
  fs.mkdirSync(tmpDir, { recursive: true })
  const tmpFile = path.join(tmpDir, `tts_${Date.now()}.mp3`)
  await new Promise((res, rej) => {
    const t = new gtts(text, lang)
    t.save(tmpFile, e => e ? rej(e) : res())
  })
  const buf = fs.readFileSync(tmpFile)
  fs.unlinkSync(tmpFile)
  return buf
}

// ─── TTS (default) ─────────────────────────────────────────
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🔊 *ᴛᴛs*\n\nContoh: ${usedPrefix}${command} Halo dunia`
  conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
  let buf = await ttsGtts(text, 'id')
  if (!buf) throw '❌ Gagal generate TTS'
  await conn.sendMessage(m.chat, { audio: { url: buf }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['tts <teks>']
handler.tags = ['tools']
handler.command = /^(tts|texttospeech)$/i
export default handler

// ─── TTS Eminem (speed up) ─────────────────────────────────
export const ttsEminemHandler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🎤 *ᴛᴛs ᴇᴍɪɴᴇᴍ*\n\nContoh: ${usedPrefix}${command} Halo dunia`
  conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
  const res = await axios.get(`https://api.emiliabot.my.id/tools/text-to-speech?text=${encodeURIComponent(text)}`, {
    timeout: 60000
  }).catch(() => null)
  const voiceUrl = res?.data?.result?.find(v => v.eminem)?.eminem
  if (!voiceUrl) throw '❌ Gagal generate TTS Eminem'
  const audio = await axios.get(voiceUrl, { responseType: 'arraybuffer', timeout: 30000 })
  await conn.sendMessage(m.chat, { audio: { url: Buffer.from(audio.data) }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
ttsEminemHandler.help = ['ttseminem <teks>']
ttsEminemHandler.tags = ['tts']
ttsEminemHandler.command = /^ttseminem$/i

// ─── TTS Goku ──────────────────────────────────────────────
export const ttsGokuHandler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🐉 *ᴛᴛs ɢᴏᴋᴜ*\n\nContoh: ${usedPrefix}${command} Halo dunia`
  conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
  const res = await axios.get(`https://api.emiliabot.my.id/tools/text-to-speech?text=${encodeURIComponent(text)}`, {
    timeout: 60000
  }).catch(() => null)
  const voiceUrl = res?.data?.result?.find(v => v.goku)?.goku
  if (!voiceUrl) throw '❌ Gagal generate TTS Goku'
  const audio = await axios.get(voiceUrl, { responseType: 'arraybuffer', timeout: 30000 })
  await conn.sendMessage(m.chat, { audio: { url: Buffer.from(audio.data) }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
ttsGokuHandler.help = ['ttsgoku <teks>']
ttsGokuHandler.tags = ['tts']
ttsGokuHandler.command = /^ttsgoku$/i

// ─── TTS Mickey ────────────────────────────────────────────
export const ttsMickeyHandler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🐭 *ᴛᴛs ᴍɪᴄᴋᴇʏ*\n\nContoh: ${usedPrefix}${command} Halo dunia`
  conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
  const res = await axios.get(`https://api.emiliabot.my.id/tools/text-to-speech?text=${encodeURIComponent(text)}`, {
    timeout: 60000
  }).catch(() => null)
  const voiceUrl = res?.data?.result?.find(v => v.mickey_mouse)?.mickey_mouse
  if (!voiceUrl) throw '❌ Gagal generate TTS Mickey'
  const audio = await axios.get(voiceUrl, { responseType: 'arraybuffer', timeout: 30000 })
  await conn.sendMessage(m.chat, { audio: { url: Buffer.from(audio.data) }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
ttsMickeyHandler.help = ['ttsmickey <teks>']
ttsMickeyHandler.tags = ['tts']
ttsMickeyHandler.command = /^ttsmickey$/i

// ─── TTS Elon Musk ─────────────────────────────────────────
export const ttsElonHandler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🚀 *ᴇʟᴏɴ ᴍᴜsᴋ ᴛᴛs*\n\nContoh: ${usedPrefix}${command} To Mars!`
  conn.sendMessage(m.chat, { react: { text: '🚀', key: m.key } })
  const res = await axios.get(`https://api.emiliabot.my.id/tools/text-to-speech?text=${encodeURIComponent(text)}`, { timeout: 60000 }).catch(() => null)
  const voiceUrl = res?.data?.result?.find(v => v.elon_musk)?.elon_musk
  if (!voiceUrl) throw '❌ Gagal generate TTS Elon Musk'
  const audio = await axios.get(voiceUrl, { responseType: 'arraybuffer', timeout: 30000 })
  await conn.sendMessage(m.chat, { audio: { url: Buffer.from(audio.data) }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
ttsElonHandler.help = ['ttselon <teks>']
ttsElonHandler.tags = ['tts']
ttsElonHandler.command = /^(ttselon|elontts|ttselonmusk)$/i

// ─── TTS Nahida ────────────────────────────────────────────
export const ttsNahidaHandler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🌿 *ɴᴀʜɪᴅᴀ ᴛᴛs*\n\nContoh: ${usedPrefix}${command} Halo traveler!`
  conn.sendMessage(m.chat, { react: { text: '🌿', key: m.key } })
  const res = await axios.get(`https://api.emiliabot.my.id/tools/text-to-speech?text=${encodeURIComponent(text)}`, { timeout: 60000 }).catch(() => null)
  const voiceUrl = res?.data?.result?.find(v => v.nahida)?.nahida
  if (!voiceUrl) throw '❌ Gagal generate TTS Nahida'
  const audio = await axios.get(voiceUrl, { responseType: 'arraybuffer', timeout: 30000 })
  await conn.sendMessage(m.chat, { audio: { url: Buffer.from(audio.data) }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
ttsNahidaHandler.help = ['ttsnahida <teks>']
ttsNahidaHandler.tags = ['tts']
ttsNahidaHandler.command = /^(ttsnahida|nahidatts)$/i
