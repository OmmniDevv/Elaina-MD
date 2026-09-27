// © Elaina-MD — platform lain via yt-dlp (capcut, snackvideo, threads, douyin, dll)
import { generic } from '../../lib/scraper/downloader.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🌸 *Fufu~* kirim link-nya ke aku senpai!\n\n> Contoh: \`${usedPrefix}${command} https://www.capcut.com/t/xxx\``
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })
  const res = await generic(text)
  if (!res) throw '😿 Gomen senpai... link ini tidak bisa aku unduh. Pastikan link valid ya~'
  await conn.sendMessage(m.chat, { video: { url: res.url }, caption: '✨ *ini dia senpai~*' }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['dl <url>', 'dla <url> (audio)', 'capcut <url>', 'snackvideo <url>', 'threads <url>']
handler.tags = ['downloader']
handler.command = /^(dl|dla|capcut|ccdl|snackvideo|svdl|threads|douyin|kuaishou|cocofun)$/i
handler.limit = true
export default handler
