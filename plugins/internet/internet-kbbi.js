// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// KBBI — scrape kbbi.co.id (gratis, no API key, tested 2026-09-26)
// Struktur hasil: <h2><a href="/arti-kata/X">Kata</a></h2><p><body>...definisi...</body></p>
import axios from 'axios'
import * as cheerio from 'cheerio'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

// Bersihkan HTML entri jadi teks ala WhatsApp
function renderEntry($, bodyEl) {
  let html = $(bodyEl).html() || ''
  html = html
    .replace(/<a[^>]*>[\s\S]*?Selengkapnya[^<]*<\/a>/gi, '') // buang link "selengkapnya"
    .replace(/<b>/gi, '*').replace(/<\/b>/g, '*')
    .replace(/<i>/gi, '_').replace(/<\/i>/g, '_')
    .replace(/<sup>/gi, '^').replace(/<\/sup>/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
  return html
    .replace(/&middot;/g, '·').replace(/&amp;/g, '&').replace(/&#8230;/g, '…')
    .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/[ \t]+/g, ' ').replace(/ ?\n ?/g, '\n').trim()
}

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `📚 *KBBI*\n\n> Contoh: \`${usedPrefix}${command} aku\``
  m.reply(global.wait || '⏳')

  const kata = text.trim().toLowerCase()

  try {
    const { data } = await axios.get(`https://kbbi.co.id/cari?kata=${encodeURIComponent(text.trim())}`, {
      headers: { 'User-Agent': UA }, timeout: 15000,
    })
    const $ = cheerio.load(data)

    const results = []
    $('h2').each((_, h2) => {
      const a = $(h2).find('a')
      const title = a.text().trim()
      const href = a.attr('href') || ''
      const body = $(h2).next('p').find('body').length ? $(h2).next('p').find('body') : $(h2).next('p')
      const entry = renderEntry($, body)
      if (title && entry) results.push({ title, slug: href.split('/').pop(), entry })
    })

    if (!results.length) throw 'notfound'

    // Exact match dulu, baru prefix match, sisanya
    const norm = s => s.toLowerCase().replace(/[^a-z]/g, '')
    results.sort((x, y) => {
      const sx = norm(x.title) === norm(kata) ? 0 : norm(x.slug || '') === norm(kata) ? 0 : norm(x.title).startsWith(norm(kata)) ? 1 : 2
      const sy = norm(y.title) === norm(kata) ? 0 : norm(y.slug || '') === norm(kata) ? 0 : norm(y.title).startsWith(norm(kata)) ? 1 : 2
      return sx - sy
    })

    let txt = `📚 *KBBI — "${text.trim()}"*\n\n`
    let used = 0
    for (const r of results) {
      const block = `*${r.title.toUpperCase()}*\n${r.entry}\n`
      if ((txt + block).length > 3500) break
      txt += block + '\n'
      used++
      if (used >= 4) break
    }
    txt += `> Sumber: kbbi.co.id${results.length > used ? ` (${results.length} entri, ${results.length - used} lainnya tidak ditampilkan)` : ''}`
    m.reply(txt.trim())
  } catch (e) {
    if (e === 'notfound' || e.message === 'notfound') throw `😿 Kata "${text.trim()}" tidak ditemukan di KBBI, senpai~`
    throw `😿 Gomen senpai... gagal mengambil data KBBI. Coba lagi nanti~`
  }
}
handler.help = ['kbbi <teks>']
handler.tags = ['internet']
handler.command = /^kbbi$/i

export default handler