// © Elaina-MD — TikTok via unified downloader (btch -> ytdlp), tanpa API key
import { tiktok } from '../../lib/scraper/downloader.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🎐 *Fufu~* mana link TikTok-nya senpai?\n\n> Contoh: \`${usedPrefix}${command} https://vt.tiktok.com/xxx\``
  if (!/tiktok\.com|vt\.tiktok/i.test(text)) throw '❌ Eh~ ini bukan link TikTok loh senpai!'
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })
  const res = await tiktok(text)
  if (!res) throw '😿 Gomenasai senpai... video-nya gagal terunduh. Coba sebentar lagi~'
  if (res.audio) {
    await conn.sendMessage(m.chat, {
      audio: { url: res.url }, mimetype: 'audio/mpeg',
      fileName: `TikTok_${Date.now()}.mp3`
    }, { quoted: m })
  } else {
    await conn.sendMessage(m.chat, { video: { url: res.url }, caption: res.title || '✨ ini videonya senpai~' }, { quoted: m })
  }
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['tiktok <url>', 'tt <url>', 'tiktokmp3 <url>', 'ttmp3 <url>']
handler.tags = ['downloader']
handler.command = /^(tiktok|tt|tiktokdl|tiktokmp3|ttmp3|ttmusic)$/i
handler.limit = true
export default handler
