// © Elaina-MD — YouTube search via delirius (no API key), bukan scrape HTML
import { ytSearch } from '../../lib/scraper/downloader.js'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix}${command} Naruto Opening`

  const results = await ytSearch(text, 8)
  if (!results.length) throw 'Tidak ada hasil ditemukan'

  const list = results.slice(0, 8).map((v, i) =>
    `${i + 1}. *${v.title}*\n   ⏱️ ${v.duration || '?'} • 📺 ${v.author || '?'} • 👁️ ${v.views ?? '?'}\n   🔗 ${v.url}`
  ).join('\n\n')

  m.reply(`*${htki} SEARCH ${htka}*\n\n${list}\n\n> ✨ untuk download: \`${usedPrefix}yta ${results[0].url}\``)
}

handler.help = ['yts <query>', 'ytsearch <query>']
handler.tags = ['downloader']
handler.command = /^yts(earch)?$/i
export default handler
