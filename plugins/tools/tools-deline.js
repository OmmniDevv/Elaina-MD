// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Deline API Tools — search, translate, TTP sticker (tested 2026-09-26)
// Catatan response asli (diverifikasi):
//   /search/youtube → result[] { title, channel, duration, imageUrl, link }
//   /search/pinterest → data[] { image, caption, fullname, source }
//   /tools/translate → param `target`, hasil di data.hasil_terjemahan
import fetch from 'node-fetch'
import { elainaSay, elainaReact } from '../../lib/elainaVoice.js'

const DELINE = 'https://api.deline.web.id'

// ─── YouTube Search via Deline ─────────────────────────────
let handlerYtSearch = async (m, { conn, text }) => {
    if (!text) throw elainaSay('noargs', 'Masukkan query pencarian!\nContoh: .yts anime')
    conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } })
    try {
        const res = await fetch(`${Deline}/search/youtube?q=${encodeURIComponent(text)}`, { timeout: 20000 })
        const json = await res.json()
        if (!json.status || !json.result?.length) throw elainaSay('notfound', 'video YouTube-nya')
        let txt = `🔍 *YOUTUBE SEARCH*\n\n> Query: *${text}*\n\n`
        json.result.slice(0, 5).forEach((v, i) => {
            txt += `*${i + 1}. ${v.title}*\n`
            txt += `   ⏱️ ${v.duration || '-'}\n`
            if (v.channel) txt += `   📺 ${v.channel}\n`
            txt += `   🔗 ${v.link || v.url}\n\n`
        })
        conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } })
        await m.reply(txt.trim())
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } })
        throw elainaSay('gagal', e.message)
    }
}
handlerYtSearch.help = ['ytsearch <query>', 'yts <query>']
handlerYtSearch.tags = ['search']
handlerYtSearch.command = /^(ytsearch|yts|searchyt)$/i
export { handlerYtSearch }

// ─── Pinterest Search via Deline ───────────────────────────
let handlerPinSearch = async (m, { conn, text }) => {
    if (!text) throw elainaSay('noargs', 'Masukkan query pencarian!\nContoh: .pinsearch anime')
    conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } })
    try {
        const res = await fetch(`${Deline}/search/pinterest?q=${encodeURIComponent(text)}`, { timeout: 20000 })
        const json = await res.json()
        const list = json.data || json.result
        if (!json.status || !list?.length) throw elainaSay('notfound', 'gambar Pinterest-nya')
        const item = list[0]
        conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } })
        if (item.image) {
            const cap = `📌 *Pinterest*\n\n${item.caption || text}${item.fullname ? `\n👤 ${item.fullname}` : ''}`
            await conn.sendMessage(m.chat, { image: { url: item.image }, caption: cap }, { quoted: m })
        } else {
            await m.reply(`📌 *Pinterest*\n\n${item.caption || text}\n🔗 ${item.source || ''}`)
        }
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } })
        throw elainaSay('gagal', e.message)
    }
}
handlerPinSearch.help = ['pinterestsearch <query>', 'pinsearch <query>']
handlerPinSearch.tags = ['search']
handlerPinSearch.command = /^(pinterestsearch|pinsearch|caripin)$/i
export { handlerPinSearch }

// ─── Translate via Deline (param: target) ──────────────────
let handlerTranslate = async (m, { conn, text, args }) => {
    if (!text) throw elainaSay('noargs', 'Masukkan teks untuk diterjemahkan!\nContoh: .tr id|hello world')
    const target = args[0] || 'id'
    conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } })
    try {
        const res = await fetch(`${Deline}/tools/translate?text=${encodeURIComponent(text)}&target=${target}`, { timeout: 15000 })
        const json = await res.json()
        const hasil = json.data?.hasil_terjemahan || json.result?.text
        if (!json.status || !hasil) throw json.error || 'Gagal translate'
        conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } })
        await m.reply(`🌐 *Translate* (${json.data?.terdeteksi_bahasa || '?'} → ${target})\n\n${hasil}`)
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } })
        throw elainaSay('gagal', e.message)
    }
}
handlerTranslate.help = ['translate <teks>', 'tr <teks>']
handlerTranslate.tags = ['tools']
handlerTranslate.command = /^(translate|tr|terjemahkan)$/i
export { handlerTranslate }

// ─── TTP Sticker via Deline ────────────────────────────────
let handlerTtp = async (m, { conn, text }) => {
    if (!text) throw elainaSay('noargs', 'Masukkan teks buat stikernya!\nContoh: .ttp elaina')
    conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } })
    try {
        const url = `${Deline}/maker/ttp?text=${encodeURIComponent(text)}`
        await conn.sendImageAsSticker(m.chat, url, m, { packname: global.stickpack || 'Elaina-MD', author: global.stickauth || 'OmmniDevv' })
        conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } })
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } })
        throw elainaSay('gagal', e.message)
    }
}
handlerTtp.help = ['ttp <teks>']
handlerTtp.tags = ['sticker']
handlerTtp.command = /^ttp$/i
export { handlerTtp }

export default handlerYtSearch
