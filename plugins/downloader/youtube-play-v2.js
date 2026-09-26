// © Elaina-MD — YouTube search + play, gratis tanpa API key (pola delirius)
import { ytSearch, youtubeAudio } from '../../lib/scraper/downloader.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🌸 *Ara ara~* senpai mau cari lagu apa?\n\n> Contoh: \`${usedPrefix}${command} lathi manuk\``
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })

  // Kalau langsung URL YouTube, skip search
  let v
  if (/youtu\.be|youtube\.com/i.test(text)) {
    v = { url: text, title: 'Video YouTube', thumbnail: null, duration: '?', author: {} }
  } else {
    const res = await ytSearch(text, 10)
    if (!res.length) throw '😿 Gomen senpai... lagunya tidak ditemukan. Coba judul lain ya~'
    v = res[0]
  }

  if (/play|putar|lagu/i.test(command)) {
    const dl = await youtubeAudio(v.url)
    if (!dl) throw '😿 Gomen senpai... lagunya tidak bisa diunduh. Coba lagi nanti~'
    if (v.thumbnail) {
      await conn.sendMessage(m.chat, {
        image: { url: v.thumbnail },
        caption: `🎵 *${dl.title || v.title}*\n⏱️ ${dl.duration || v.duration || '?'}\n📺 ${v.author?.name || v.author || '-'}\n📦 via ${dl.via}\n\n> ✨ diputarkan untuk senpai~`
      }, { quoted: m }).catch(() => {})
    }
    await conn.sendMessage(m.chat, {
      audio: { url: dl.url }, mimetype: 'audio/mpeg', ptt: false,
      fileName: `${(dl.title || v.title || 'audio').replace(/[^\w -]/g, '')}.mp3`
    }, { quoted: m })
  } else {
    const res = /youtu\.be|youtube\.com/i.test(text) ? await ytSearch('', 0).catch(() => []) : await ytSearch(text, 10)
    if (res?.length) {
      const list = res.slice(0, 10).map((x, i) =>
        `${i + 1}. *${x.title}*\n   ⏱️ ${x.duration || '?'} • ${x.author || '-'}\n   🔗 ${x.url}`
      ).join('\n\n')
      await conn.sendMessage(m.chat, {
        text: `🔍 *Hasil pencarian: ${text}*\n\n${list}\n\n> ✨ Elaina sudah cariin untuk senpai~`
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        text: `🔗 ${v.url}\n\n> Download dengan: \`${usedPrefix}yta ${v.url}\``
      }, { quoted: m })
    }
  }
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['yts <judul>', 'play <judul lagu>', 'playaudio <judul>', 'putar <judul>']
handler.tags = ['downloader']
handler.command = /^(yts|ytsearch|play|playaudio|putar)$/i
handler.limit = true
export default handler
