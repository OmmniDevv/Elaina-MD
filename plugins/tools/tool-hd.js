/**
 * Elaina-MD — https://github.com/OmmniDevv/Elaina-MD
 * Script by OmmniDevv — Jangan Dijual!
 *
 * NOTE: hd/remini/enhance/upscale already exist in tool-ourin.js
 * This file provides an alternative implementation using ryzendesu API
 * with command aliases: enhancehd, hdimage
 */
import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
  const isImg = /image/.test((m.quoted?.msg || m.msg || m)?.mimetype || '')
  if (!isImg) return m.reply('❌ Reply ke gambar!')
  conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
  try {
    const buf = m.quoted ? await m.quoted.download() : await m.download()
    if (!buf?.length) throw '❌ Gagal download gambar'
    const b64 = buf.toString('base64')
    const res = await axios.post('https://api.ryzendesu.vip/api/image/remini',
      { image: b64 },
      { responseType: 'arraybuffer', timeout: 60000 }
    )
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    await conn.sendMessage(m.chat, { image: { url: Buffer.from(res.data) }, caption: '✨ *ʜᴅ ᴇɴʜɴᴄᴇ*\n\nGambar berhasil di-enhance!' }, { quoted: m })
  } catch {
    throw '❌ Gagal enhance gambar!'
  }
}
handler.help = ['enhancehd (reply gambar)']
handler.tags = ['tools']
handler.command = /^(enhancehd|hdimage)$/i
export default handler
