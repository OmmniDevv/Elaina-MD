// © Elaina-MD — YouTube search + play, gratis tanpa API key
import yts from 'yt-search'
import { youtubeAudio } from '../../lib/scraper/downloader.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🌸 *Ara ara~* senpai mau cari lagu apa?\n\n> Contoh: \`${usedPrefix}${command} lathi manuk\``
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })
  const res = await yts(text)
  const v = res.videos?.[0]
  if (!v) throw '😿 Gomen senpai... lagunya tidak ditemukan. Coba judul lain ya~'
  if (/play|putar|lagu/i.test(command)) {
    const dl = await youtubeAudio(v.url)
    if (!dl) throw '😿 Gomen senpai... lagunya tidak bisa diunduh. Coba lagi nanti~'
    await conn.sendMessage(m.chat, {
      image: { url: v.thumbnail }, caption: `🎵 *${v.title}*\n⏱️ ${v.timestamp}\n📺 ${v.author.name}\n\n> ✨ diputarkan untuk senpai~`
    }, { quoted: m })
    await conn.sendMessage(m.chat, {
      audio: { url: dl.url }, mimetype: 'audio/mpeg', ptt: false,
      fileName: `${v.title.replace(/[^\w -]/g, '')}.mp3`
    }, { quoted: m })
  } else {
    const list = res.videos.slice(0, 10).map((x, i) =>
      `${i + 1}. *${x.title}*\n   ⏱️ ${x.timestamp} • ${x.author.name}\n   🔗 ${x.url}`
    ).join('\n\n')
    await conn.sendMessage(m.chat, {
      text: `🔍 *Hasil pencarian: ${text}*\n\n${list}\n\n> ✨ Elaina sudah cariin untuk senpai~`
    }, { quoted: m })
  }
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['yts <judul>', 'play <judul lagu>', 'playaudio <judul>', 'putar <judul>']
handler.tags = ['downloader']
handler.command = /^(yts|ytsearch|play|playaudio|putar)$/i
handler.limit = true
export default handler
