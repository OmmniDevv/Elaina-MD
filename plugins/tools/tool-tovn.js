// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import { toPTT } from '../../lib/converter.js'
import fs from 'fs'

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  
  if (!/video|audio/.test(mime)) throw `Reply video/audio dengan command ${usedPrefix + command}`
  
  m.reply(global.wait)
  
  try {
    let media = await q.download()
    let audio = await toPTT(media)
    await conn.sendFile(m.chat, audio?.data || audio, 'audio.opus', '', m, true, { mimetype: 'audio/ogg; codecs=opus' })
    try { if (audio?.delete) audio.delete(); else fs.unlinkSync(audio) } catch {}
  } catch (e) {
    throw `Error: ${e.message || e}`
  }
}

handler.help = ['tovn']
handler.tags = ['tools']
handler.command = /^(tovn|toptt)$/i
handler.limit = true
export default handler
