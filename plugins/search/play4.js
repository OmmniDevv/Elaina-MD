/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import yts from 'yt-search';
import axios from 'axios';
export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import config from '../../config.js';
const pluginConfig = {
    name: "play4",
    alias: ["playaudio4"],
    category: "search",
    description: "Putar musik dari YouTube (Faa API)",
    usage: ".play4 <query>",
    example: ".play4 komang",
    cooldown: 15,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock, text }) {
    const query = m.text?.trim()
    if (!query) return m.reply(`🖤 *𝒁𝑬𝑹𝑶 𝑻𝑾𝑶 𝑺𝑻𝑨𝑮𝑬*\n\n> Contoh:\n\`${m.prefix}play4 komang\``)

    m.react("🖤")

    try {
        const search = await yts(query)
        if (!search.videos.length) throw "Video tidak ditemukan"
        
        const video = search.videos[0]

        const rows = search.videos?.map((v, i) => {
            return {
                header: v.title,
                title: v.author.name,
                description: `🖤 Darling, pilih musik ini`,
                id: `${m.prefix}putar-play2 ${v.url}`
            }
        })

        await sock.sendMessage(m.chat, {
            image: { url: video.thumbnail },
            caption: `
╭━━━〔 🖤 𝒁𝑬𝑹𝑶 𝑻𝑾𝑶 𝑺𝑻𝑨𝑮𝑬 🖤 〕━━━⬣
┃ 🎧 Darling...
┃ Kamu ingin mendengarkan ini?
┃
┃ 🎶 Title : ${video.title}
┃ 📺 Channel : ${video.author.name}
┃ ⏱ Durasi : ${video.duration}
┃
┃ 🩸 「Aku akan menemanimu...」
╰━━━〔 💔 𝑭𝑨𝑪𝑬𝑳𝑬𝑺𝑺 𝟎𝟐 💔 〕━━━⬣
            `.trim(),

            footer: "🖤 Faceless 02 System",
            interactiveButtons: [
                {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🖤 PUTAR SEKARANG',
                        id: `${m.prefix}putar-play2 ${video.url}`
                    })
                },
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: '🖤 Musik Lainnya',
                        sections: [
                            {
                                title: 'Pilihan untukmu, Darling',
                                rows
                            }
                        ]
                    })
                }
            ]
        }, { quoted: m })

        m.react("💫")

    } catch (err) {
        console.error('[Play2]', err)
        m.react("❌")
        m.reply(`💔 Darling... terjadi error\n\n${err.message || err}`)
    }
}

export { pluginConfig as config, handler };
