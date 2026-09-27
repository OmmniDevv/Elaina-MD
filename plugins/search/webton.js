/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    await m.react('✨')

    if (!text) {
        return m.reply(`Contoh penggunaan:
${usedPrefix + command} lookism`)
    }

    try {
        const url = `${global.APIs.deline}/search/webtoon?q=${encodeURIComponent(text)}`
        const { data } = await axios.get(url)

        if (!data.status || !data.result.original.length) {
            throw 'Webtoon tidak ditemukan'
        }

        const w = data.result.original[0]

        const img = await axios.get(w.image, {
            responseType: 'arraybuffer',
            headers: {
                Referer: 'https://www.webtoons.com/'
            }
        })

        const caption = `📚 *${w.title}*
👤 Author: ${w.author}
👁️ ${w.viewCount}
🔗 ${w.link}`

        await conn.sendFile(m.chat, img.data, 'webtoon.jpg', caption, m)

    } catch (e) {
        console.error(e)
        m.reply('Gagal mencari Webtoon.')
    }
}

handler.help = ['webtoonsearch <judul>']
handler.tags = ['search']
handler.command = /^webtoonsearch$/i
handler.limit = true

export default handler
