/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fetch from 'node-fetch';
const pluginConfig = {
    name: 'meigen',
    alias: ['meigens'],
    category: 'search',
    description: 'Cari prompt dari Meigen AI',
    usage: '.meigen <query>',
    example: '.meigen anime girl',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {

    const text = m.text?.trim()

    if (!text) {

        return m.reply(
`🔎 *MEIGEN SEARCH*

❌ Masukkan kata kunci

Contoh:
${pluginConfig.example}`
        )
    }

    await m.react('🕕')

    try {

        const api =
`https://www.meigen.ai/api/search?q=${encodeURIComponent(text)}`

        const res =
            await fetch(api)

        const json =
            await res.json()

        if (
            !json.success ||
            !json.data ||
            !json.data.length
        ) {

            await m.react('❌')

            return m.reply(
                '❌ Prompt tidak ditemukan'
            )
        }

        const data =
            json.data[
                Math.floor(
                    Math.random() *
                    json.data.length
                )
            ]

        let caption =
`🔎 *MEIGEN SEARCH*

❀ Query: ${text}
❀ Author: ${data.author_display_name}
❀ Username: @${data.author_username}
❀ Model: ${data.model}

📊 *Stats*
• Likes: ${data.likes}
• Views: ${data.views}
• Favorites: ${data.favorites_count}

📝 *Prompt:*
${data.text.length > 1500
    ? data.text.slice(0, 1500) + '...'
    : data.text}`

        await sock.sendMessage(
            m.chat,
            {
                image: {
                    url:
                        data.thumbnail_url
                },
                caption,
                mentions: [
                    `${data.author_username}@s.whatsapp.net`
                ]
            },
            {
                quoted: m
            }
        )

        await m.react('✅')

    } catch (err) {

        console.error(
            '[MEIGEN ERROR]',
            err
        )

        await m.react('❌')

        m.reply(
`❌ *ERROR*

> ${err.message}`
        )
    }
}

export { pluginConfig as config, handler };
