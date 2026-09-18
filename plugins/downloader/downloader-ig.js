// © Elaina-MD — Instagram via unified downloader (btch -> ytdlp)
import { instagram } from '../../lib/scraper/downloader.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🌸 *Senpai~* aku butuh link Instagram-nya!\n\n> Contoh: \`${usedPrefix}${command} https://instagram.com/p/xxx\``
  if (!/instagram\.com|instagr\.am/i.test(text)) throw '❌ Hmph! Link-nya bukan Instagram, senpai~'
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })
  const res = await instagram(text)
  if (!res) throw '😿 Maaf senpai... gagal mengambil postingannya. Coba lagi ya~'
  await conn.sendMessage(m.chat, { video: { url: res.url }, caption: '✨ *ini dia senpai~*' }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['ig <url>', 'igdl <url>', 'instagramdl <url>']
handler.tags = ['downloader']
handler.command = /^(ig|igdl|instagramdl|igdownload)$/i
handler.limit = true
export default handler
