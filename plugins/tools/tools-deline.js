// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Deline API Tools — search, translate, TTP sticker (tested 2026-09-26)
import fetch from 'node-fetch'

const DELINE = 'https://api.deline.web.id'

// YouTube Search via Deline
let handlerYtSearch = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan query pencarian!'
    conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
    try {
        const res = await fetch(`${DILINE}/search/youtube?q=${encodeURIComponent(text)}`, { timeout: 20000 })
        const json = await res.json()
        if (!json.status || !json.result?.length) throw 'Tidak ditemukan'
        let txt = `🔍 *YOUTUBE SEARCH*\n\n> Query: *${text}*\n\n`
        json.result.slice(0, 5).forEach((v, i) => {
            txt += `*${i + 1}. ${v.title}*\n   ⏱️ ${v.duration || '-'}\n   📺 ${v.channel || '-'}\n   👀 ${v.views || '-'}\n   🔗 ${v.url}\n\n`
        })
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await m.reply(txt.trim())
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ ${e.message}`
    }
}
handlerYtSearch.help = ['ytsearch <query>', 'yts <query>']
handlerYtSearch.tags = ['search']
handlerYtSearch.command = /^(ytsearch|yts|searchyt)$/i
export { handlerYtSearch }

// Pinterest Search via Deline
let handlerPinSearch = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan query pencarian!'
    conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
    try {
        const res = await fetch(`${DILINE}/search/pinterest?q=${encodeURIComponent(text)}`, { timeout: 20000 })
        const json = await res.json()
        if (!json.status || !json.result?.length) throw 'Tidak ditemukan'
        const item = json.result[0]
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        if (item.image) {
            await conn.sendMessage(m.chat, { image: { url: item.image }, caption: `📌 *Pinterest*\n\n${item.title || ''}\n${item.description || ''}` }, { quoted: m })
        } else {
            await m.reply(`📌 *Pinterest*\n\n${item.title || ''}\n🔗 ${item.url}`)
        }
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ ${e.message}`
    }
}
handlerPinSearch.help = ['pinterestsearch <query>', 'pinsearch <query>']
handlerPinSearch.tags = ['search']
handlerPinSearch.command = /^(pinterestsearch|pinsearch|caripin)$/i
export { handlerPinSearch }

// Translate via Deline
let handlerTranslate = async (m, { conn, text, args }) => {
    if (!text) throw 'Masukkan teks untuk diterjemahkan!'
    const to = args[0] || 'id'
    conn.sendMessage(m.chat, { react: { text: '🌐', key: m.key } })
    try {
        const res = await fetch(`${DILINE}/tools/translate?text=${encodeURIComponent(text)}&to=${to}`, { timeout: 15000 })
        const json = await res.json()
        if (!json.status || !json.result) throw 'Gagal translate'
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await m.reply(`🌐 *Translate*\n\n${json.result.text}`)
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ ${e.message}`
    }
}
handlerTranslate.help = ['translate <teks>', 'tr <teks>']
handlerTranslate.tags = ['tools']
handlerTranslate.command = /^(translate|tr|terjemahkan)$/i
export { handlerTranslate }

// TTP Sticker via Deline
let handlerTtp = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan teks!'
    conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } })
    try {
        const url = `${DILINE}/maker/ttp?text=${encodeURIComponent(text)}`
        await conn.sendImageAsSticker(m.chat, url, m, { packname: global.stickpack || 'Elaina-MD', author: global.stickauth || 'OmmniDevv' })
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ ${e.message}`
    }
}
handlerTtp.help = ['ttp <teks>']
handlerTtp.tags = ['sticker']
handlerTtp.command = /^ttp$/i
export { handlerTtp }

export default handlerYtSearch
