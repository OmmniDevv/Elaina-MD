// © Elaina-MD — Twitter/X via unified downloader (btch -> ytdlp)
import { twitter } from '../../lib/scraper/downloader.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🌸 *Senpai~* kasih aku link Twitter/X-nya!\n\n> Contoh: \`${usedPrefix}${command} https://twitter.com/x/status/xxx\``
  if (!/twitter\.com|x\.com|t\.co/i.test(text)) throw '❌ Eh~ bukan link Twitter/X ini, senpai!'
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })
  const res = await twitter(text)
  if (!res) throw '😿 Maaf senpai... gagal mengambil tweet-nya. Coba lagi nanti~'
  await conn.sendMessage(m.chat, { video: { url: res.url }, caption: '✨ *ini dia senpai~*' }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['twitter <url>', 'tw <url>', 'twdl <url>', 'xdl <url>']
handler.tags = ['downloader']
handler.command = /^(twitter|tw|twdl|xdl|twitterdl)$/i
handler.limit = true
export default handler
