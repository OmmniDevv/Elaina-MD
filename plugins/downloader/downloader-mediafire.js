// © Elaina-MD — MediaFire via unified downloader (btch -> scrape)
import { mediafire } from '../../lib/scraper/downloader.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `📁 *Senpai~* mana link MediaFire-nya?\n\n> Contoh: \`${usedPrefix}${command} https://mediafire.com/file/xxx\``
  if (!/mediafire\.com/i.test(text)) throw '❌ Hmph! Link-nya bukan dari MediaFire, senpai~'
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })
  const res = await mediafire(text)
  if (!res) throw '😿 Gomenasai senpai... filenya tidak bisa diambil. Coba lagi ya~'
  const filename = (res.title || 'file').replace(/[^\w .-]/g, '')
  await conn.sendMessage(m.chat, {
    document: { url: res.url }, fileName: filename,
    mimetype: 'application/octet-stream', caption: `📁 *${filename}*\n\n> ✨ dari Elaina untuk senpai~`
  }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['mediafire <url>', 'mf <url>', 'mediafiredl <url>']
handler.tags = ['downloader']
handler.command = /^(mediafire|mf|mediafiredl|mfdl)$/i
handler.limit = true
export default handler
