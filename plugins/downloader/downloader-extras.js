// © Elaina-MD — https://github.com/OmmniDevv/Elaina-MD
// downloader unified (nexray -> ytdlp -> vreden -> btch), tanpa API key berbayar
import { youtubeVideo, youtubeAudio } from '../../lib/scraper/downloader.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🌸 *Ara ara~* beri aku URL-nya senpai!\n\n> Contoh: \`${usedPrefix}${command} https://youtube.com/watch?v=xxx\``
  if (!/youtube\.com|youtu\.be/i.test(text)) throw '❌ Hmph! Ini bukan link YouTube, senpai~'
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })
  const audio = /mp3|audio/i.test(command)
  const res = await (audio ? youtubeAudio(text) : youtubeVideo(text))
  if (!res) throw '😿 Gomen senpai... aku tidak bisa mengambil videonya. Coba lagi nanti ya~'
  const caption = res.title ? `🎬 *${res.title}*\n\n> ✨ diberkati oleh Elaina~` : ''
  if (audio) {
    await conn.sendMessage(m.chat, {
      audio: { url: res.url }, mimetype: 'audio/mpeg', ptt: false,
      fileName: `${(res.title || 'audio').replace(/[^\w -]/g, '')}.mp3`
    }, { quoted: m })
  } else {
    await conn.sendMessage(m.chat, { video: { url: res.url }, caption }, { quoted: m })
  }
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['ytmp4 <url>', 'ytvideo <url>', 'ytmp3 <url>', 'ytaudio <url>']
handler.tags = ['downloader']
handler.command = /^(ytmp4|youtubemp4|ytvideo|ytmp3|youtubemp3|ytaudio)$/i
handler.limit = true
export default handler
