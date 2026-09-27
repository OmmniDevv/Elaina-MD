// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Komik Indo Search — jerexd API (free key, tested 2026-09-26)
import fetch from 'node-fetch'

const JEREXD = 'https://api.jerexd.my.id'
const APIKEY = 'DS6BiowttbswsryD'

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) return m.reply(`⚠️ Masukkan judul komik!\n\nContoh: ${usedPrefix}komiksearch solo leveling`)

    conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
    try {
        const res = await fetch(`${JEREXD}/api/komik/komikindo-search?apikey=${APIKEY}&query=${encodeURIComponent(text.trim())}`, { timeout: 20000 })
        const json = await res.json()

        if (!json.status || !json.results?.length) throw `Komik tidak ditemukan untuk: ${text}`

        const list = json.results.slice(0, 10)
        let txt = `📚 *KOMIKINDO SEARCH*\n\n🔍 Keyword: *${text.trim()}*\n📊 Ditemukan: *${json.total || list.length}*\n\n`

        list.forEach((item, i) => {
            txt += `*${i + 1}. ${item.title}*\n`
            if (item.type) txt += `   🏷️ Tipe: ${item.type}\n`
            if (item.latestChapter) txt += `   📖 Chapter: ${item.latestChapter}\n`
            if (item.score) txt += `   ⭐ Rating: ${item.score}\n`
            if (item.slug) txt += `   🔗 Slug: \`${item.slug}\`\n`
            txt += `\n`
        })

        txt += `💡 Ketik *${usedPrefix}komikdetail <slug>* untuk detail`

        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await m.reply(txt.trim())
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ Gagal: ${e.message}`
    }
}

handler.help = ['komiksearch <query>']
handler.tags = ['komik']
handler.command = /^(komiksearch|carikomik|komik)$/i

export default handler
