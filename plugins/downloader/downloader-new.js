// © Elaina-MD — Spotify search + download, gratis tanpa API key (pola delirius)
import { spotifySearch, spotify } from '../../lib/scraper/downloader.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🌸 *Ara ara~* mau cari lagu apa senpai? Bisa judul atau link Spotify.\n\n> Contoh: \`${usedPrefix}${command} night changes\`\n> atau: \`${usedPrefix}${command} https://open.spotify.com/track/xxx\``
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })

  const isUrl = /https?:\/\/(open\.)?spotify\.com\/track\//i.test(text)

  if (isUrl) {
    const res = await spotify(text)
    if (!res) throw '😿 Gomenasai senpai... lagunya tidak bisa diunduh. Coba lagi nanti~'
    await conn.sendMessage(m.chat, {
      image: { url: res.thumbnail }, caption: `🎵 *${res.title}*\n🎤 ${res.artist || '-'}\n\n> ✨ untuk senpai~`
    }, { quoted: m }).catch(() => {})
    await conn.sendMessage(m.chat, {
      audio: { url: res.url }, mimetype: 'audio/mpeg', ptt: false,
      fileName: `${(res.title || 'audio').replace(/[^\w -]/g, '')}.mp3`
    }, { quoted: m })
    return conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  }

  const list = await spotifySearch(text, 8)
  if (!list.length) throw '😿 Gomen senpai... tidak ada lagu yang cocok ditemukan~'

  const caption = list.slice(0, 8).map((v, i) =>
    `${i + 1}. *${v.title}*\n   🎤 ${v.artist || '-'} • ⏱️ ${v.duration || '?'}\n   🔗 ${v.url}`
  ).join('\n\n')

  await conn.sendMessage(m.chat, {
    text: `🎵 *Hasil Spotify: ${text}*\n\n${caption}\n\n> Balas nomornya (1-${list.length}) dengan caption *.spotifydl <link>* untuk download, atau ketik \`${usedPrefix}spotifydl ${list[0].url}\` untuk lagu pertama~`
  }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['spotify <judul>', 'spotifydl <judul/url>', 'music <judul>']
handler.tags = ['downloader']
handler.command = /^(spotify|spotifydl|music)$/i
handler.limit = true
export default handler
