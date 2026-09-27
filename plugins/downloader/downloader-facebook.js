// © Elaina-MD — Facebook via unified downloader (btch -> ytdlp)
import { facebook } from '../../lib/scraper/downloader.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🎐 *Ara~* mana link Facebook-nya senpai?\n\n> Contoh: \`${usedPrefix}${command} https://facebook.com/watch?v=xxx\``
  if (!/facebook\.com|fb\.watch/i.test(text)) throw '❌ Hmph! Ini bukan link Facebook, senpai~'
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })
  const res = await facebook(text)
  if (!res) throw '😿 Gomen senpai... video Facebook-nya gagal diunduh~'
  await conn.sendMessage(m.chat, { video: { url: res.url }, caption: '✨ *ini videonya senpai~*' }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['fb <url>', 'fbdl <url>', 'facebookdl <url>']
handler.tags = ['downloader']
handler.command = /^(fb|fbdl|facebookdl|fbdown)$/i
handler.limit = true
export default handler
