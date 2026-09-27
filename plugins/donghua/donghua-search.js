// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Donghua Search — jerexd API (free key, tested 2026-09-26)
import fetch from 'node-fetch'

const JEREXD = 'https://api.jerexd.my.id'
const APIKEY = 'DS6BiowttbswsryD'

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) return m.reply(`⚠️ Masukkan judul donghua!\n\nContoh: ${usedPrefix}donghua soul land`)

    conn.sendMessage(m.chat, { react: { text: '🐉', key: m.key } })
    try {
        const res = await fetch(`${JEREXD}/api/donghua/donghub-search?apikey=${APIKEY}&query=${encodeURIComponent(text.trim())}`, { timeout: 20000 })
        const json = await res.json()

        if (!json.status || !json.result?.results?.length) throw `Donghua tidak ditemukan: ${text}`

        const list = json.result.results.slice(0, 10)
        let txt = `🐉 *DONGHUA SEARCH*\n\n🔍 Keyword: *${text.trim()}*\n📊 Ditemukan: *${list.length}*\n\n`

        list.forEach((item, i) => {
            txt += `*${i + 1}. ${item.title}*\n`
            if (item.type) txt += `   🏷️ Tipe: ${item.type}\n`
            if (item.status) txt += `   📊 Status: ${item.status}\n`
            if (item.slug) txt += `   🔗 Slug: \`${item.slug}\`\n`
            txt += `\n`
        })

        txt += `💡 Ketik *${usedPrefix}donghuadetail <slug>* untuk detail`

        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await m.reply(txt.trim())
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ Gagal: ${e.message}`
    }
}

handler.help = ['donghua <query>']
handler.tags = ['donghua']
handler.command = /^(donghua|donghuasearch|cariDonghua)$/i

export default handler
