// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// News — CNBC Indonesia RSS (gratis, no key, tested 2026-09-26)
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    conn.sendMessage(m.chat, { react: { text: '📰', key: m.key } })
    try {
        const res = await fetch('https://www.cnbcindonesia.com/rss', { timeout: 15000 })
        const xml = await res.text()

        // Simple XML parse tanpa dependency
        const items = []
        const itemRegex = /<item>([\s\S]*?)<\/item>/g
        let match
        while ((match = itemRegex.exec(xml)) !== null && items.length < 8) {
            const title = match[1].match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || match[1].match(/<title>(.*?)<\/title>/)?.[1] || ''
            const link = match[1].match(/<link>(.*?)<\/link>/)?.[1] || ''
            const pubDate = match[1].match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''
            items.push({ title, link, pubDate })
        }

        if (!items.length) throw 'Tidak ada berita ditemukan'

        let txt = `📰 *BERITA TERKINI — CNBC INDONESIA*\n\n`
        items.forEach((item, i) => {
            txt += `*${i + 1}. ${item.title}*\n`
            if (item.pubDate) txt += `   📅 ${item.pubDate}\n`
            txt += `   🔗 ${item.link}\n\n`
        })
        txt += `_Sumber: CNBC Indonesia RSS_`

        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await m.reply(txt.trim())
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ Gagal ambil berita: ${e.message}`
    }
}

handler.help = ['news', 'berita']
handler.tags = ['news']
handler.command = /^(news|berita|cnbc)$/i

export default handler
