// © Elaina-MD — YouTube audio/video lama (yta/ytv) via unified downloader
import { youtubeVideo, youtubeAudio } from '../../lib/scraper/downloader.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const text = args.join(' ')
  if (!text) throw `🌸 *Ara ara~* mana URL YouTube-nya senpai?\n\n> Contoh: \`${usedPrefix}${command} https://youtu.be/xxxxx\``
  if (!/youtube\.com|youtu\.be/i.test(text)) throw '❌ Hmph! Link-nya bukan YouTube, senpai~'
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })
  const audio = /yta|audio/i.test(command)
  const res = await (audio ? youtubeAudio(text) : youtubeVideo(text))
  if (!res) throw '😿 Gomen senpai... aku tidak bisa mengambil videonya. Coba lagi nanti ya~'
  if (audio) {
    await conn.sendMessage(m.chat, {
      audio: { url: res.url }, mimetype: 'audio/mpeg', ptt: false,
      fileName: `${(res.title || 'audio').replace(/[^\w -]/g, '')}.mp3`
    }, { quoted: m })
  } else {
    const caption = `🎬 *${res.title || 'Video YouTube'}*\n⏱️ ${res.duration ? res.duration + 's' : '??'}\n📦 via ${res.via}\n\n> ✨ untuk senpai~`
    if (res.thumbnail) await conn.sendMessage(m.chat, { image: { url: res.thumbnail }, caption }, { quoted: m })
    await conn.sendMessage(m.chat, { video: { url: res.url }, caption: '' }, { quoted: m })
  }
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['yta <url>', 'ytaudio <url>', 'ytv <url>', 'ytvideo <url>']
handler.tags = ['downloader']
handler.command = /^(yta|ytaudio|ytv|ytvideo|ytvdl)$/i
handler.limit = true
export default handler
