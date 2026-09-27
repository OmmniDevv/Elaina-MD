/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js'
import { f } from './../../src/lib/elaina-http.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'emojimix',
    alias: ['mixemoji', 'emix'],
    category: 'sticker',
    description: 'Gabungkan 2 emoji menjadi 1',
    usage: '.emojimix <emoji1><emoji2>',
    example: '.emojimix 😂🔥',
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
            `🎭 *ᴇᴍᴏᴊɪ ᴍɪx*\n\n` +
            `> Gabungkan 2 emoji menjadi 1\n\n` +
            `> Contoh: \`${m.prefix}emojimix 😂🔥\``
        )
    }

    const emojiRegex = /\p{Extended_Pictographic}/gu
    const emojis = text.match(emojiRegex)

    if (!emojis || emojis.length < 2) {
        return m.reply(`❌ Masukkan minimal 2 emoji!\n\nContoh: ${m.prefix}emojimix 😂🔥`)
    }

    const emoji1 = emojis[0]
    const emoji2 = emojis[1]

    m.react('🕕')

    try {
        const apiUrl = `https://api.neoxr.eu/api/emoji?q=${encodeURIComponent(emoji1 + '_' + emoji2)}&apikey=${config.APIkey.neoxr}`

        const data = await f(apiUrl)

        if (!data.status || !data.data?.url) {
            return m.reply(`❌ Kombinasi emoji tidak ditemukan!\n\nCoba emoji lain.`)
        }

        const imageUrl = data.data.url

        await sock.sendImageAsSticker(m.chat, imageUrl, m, {
            packname: config.sticker.packname,
            author: config.sticker.author
        })

        m.react('✅')

    } catch (err) {
        console.log(err)
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }