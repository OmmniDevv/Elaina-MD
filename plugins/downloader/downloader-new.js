// © Elaina-MD — Spotify/SoundCloud, gratis tanpa API key
import { spotify, soundcloud } from '../../lib/scraper/downloader.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🌸 *Senpai~* mana link lagunya?\n\n> Contoh: \`${usedPrefix}${command} https://open.spotify.com/track/xxx\``
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })
  const fn = /spotify/i.test(command) ? spotify : soundcloud
  const res = await fn(text)
  if (!res) throw '😿 Gomenasai senpai... lagunya tidak bisa diunduh. Coba lagi nanti~'
  await conn.sendMessage(m.chat, {
    audio: { url: res.url }, mimetype: 'audio/mpeg', ptt: false,
    fileName: `${(res.title || 'audio').replace(/[^\w -]/g, '')}.mp3`
  }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['spotify <url>', 'spotifydl <url>', 'soundcloud <url>']
handler.tags = ['downloader']
handler.command = /^(spotify|spotifydl|soundcloud|scdl)$/i
handler.limit = true
export default handler
