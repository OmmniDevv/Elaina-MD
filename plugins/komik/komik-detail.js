// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Komik Indo Detail — jerexd API
import fetch from 'node-fetch'

const JEREXD = 'https://api.jerexd.my.id'
const APIKEY = 'DS6BiowttbswsryD'

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) return m.reply(`⚠️ Masukkan slug komik!\n\nContoh: ${usedPrefix}komikdetail solo-leveling`)

    conn.sendMessage(m.chat, { react: { text: '📖', key: m.key } })
    try {
        const res = await fetch(`${JEREXD}/api/komik/komikindo-detail?apikey=${APIKEY}&slug=${encodeURIComponent(text.trim())}`, { timeout: 20000 })
        const json = await res.json()

        if (!json.status || !json.result) throw `Komik tidak ditemukan: ${text}`

        const d = json.result
        let txt = `📖 *DETAIL KOMIK*\n\n`
        txt += `📚 *Judul:* ${d.title || '-'}\n`
        if (d.type) txt += `🏷️ *Tipe:* ${d.type}\n`
        if (d.status) txt += `📊 *Status:* ${d.status}\n`
        if (d.score) txt += `⭐ *Rating:* ${d.score}\n`
        if (d.genre) txt += `🎭 *Genre:* ${Array.isArray(d.genre) ? d.genre.join(', ') : d.genre}\n`
        if (d.description) txt += `\n📝 *Sinopsis:*\n${d.description.slice(0, 500)}\n`
        if (d.chapters?.length) {
            txt += `\n📖 *Chapters (${d.chapters.length}):*\n`
            d.chapters.slice(0, 10).forEach(c => {
                txt += `  • ${c.title || c.chapter}\n`
            })
            if (d.chapters.length > 10) txt += `  ... dan ${d.chapters.length - 10} lainnya\n`
        }

        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await m.reply(txt.trim())
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ Gagal: ${e.message}`
    }
}

handler.help = ['komikdetail <slug>']
handler.tags = ['komik']
handler.command = /^(komikdetail|komikinfo)$/i

export default handler
