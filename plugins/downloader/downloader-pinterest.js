// © Elaina-MD — Pinterest via unified downloader (btch -> ytdlp)
import { pinterest } from '../../lib/scraper/downloader.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🌸 *Fufu~* kirim link Pinterest-nya ke aku, senpai!\n\n> Contoh: \`${usedPrefix}${command} https://pin.it/xxx\``
  if (!/pinterest\.com|pin\.it/i.test(text)) throw '❌ Hmph! Ini bukan link Pinterest, senpai~'
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })
  const res = await pinterest(text)
  if (!res) throw '😿 Gomen senpai... gambarnya gagal diunduh. Coba lagi nanti~'
  const isVideo = /\.mp4/i.test(res.url)
  if (isVideo) await conn.sendMessage(m.chat, { video: { url: res.url }, caption: '✨ *ini dia senpai~*' }, { quoted: m })
  else await conn.sendMessage(m.chat, { image: { url: res.url }, caption: '✨ *ini gambarnya senpai~*' }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['pinterest <url>', 'pin <url>', 'pindl <url>']
handler.tags = ['downloader']
handler.command = /^(pinterest|pin|pindl|pinterestdl)$/i
handler.limit = true
export default handler
