// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Movie Box Search — jerexd API (free key, tested 2026-09-26)
import fetch from 'node-fetch'

const JEREXD = 'https://api.jerexd.my.id'
const APIKEY = 'DS6BiowttbswsryD'

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) return m.reply(`⚠️ Masukkan judul film!\n\nContoh: ${usedPrefix}movie avengers`)

    conn.sendMessage(m.chat, { react: { text: '🎬', key: m.key } })
    try {
        const res = await fetch(`${JEREXD}/api/movie/moviebox_search?apikey=${APIKEY}&query=${encodeURIComponent(text.trim())}`, { timeout: 20000 })
        const json = await res.json()

        if (!json.status || !json.result?.data?.items?.length) throw `Film tidak ditemukan: ${text}`

        const items = json.result.data.items.slice(0, 10)
        const pager = json.result.data.pager

        let txt = `🎬 *MOVIE SEARCH*\n\n🔍 Keyword: *${text.trim()}*\n📊 Total: *${pager?.totalCount || items.length}*\n\n`

        items.forEach((item, i) => {
            txt += `*${i + 1}. ${item.title}*\n`
            if (item.year) txt += `   📅 Tahun: ${item.year}\n`
            if (item.score) txt += `   ⭐ Rating: ${item.score}\n`
            if (item.subjectId) txt += `   🆔 ID: \`${item.subjectId}\`\n`
            txt += `\n`
        })

        if (pager?.hasMore) txt += `📄 Ada ${pager.totalCount} hasil total (halaman ${pager.page})`

        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await m.reply(txt.trim())
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ Gagal: ${e.message}`
    }
}

handler.help = ['movie <query>', 'moviebox <query>']
handler.tags = ['movie']
handler.command = /^(movie|moviebox|carifilm|film)$/i

export default handler
