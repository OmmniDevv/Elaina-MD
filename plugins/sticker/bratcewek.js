/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import config from '../../config.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'bratcewek',
    alias: ['cewekbrat', 'bratperempuan', 'bratgirl'],
    category: 'sticker',
    description: 'Membuat sticker brat',
    usage: '.bratcewek <text>',
    example: '.bratcewek Hai semua',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const text = m.args.join(' ')
    if (!text) {
        return m.reply(`🖼️ *ʙʀᴀᴛ cᴇᴡᴇᴋ sᴛɪᴄᴋᴇʀ*\n\n> Masukkan teks\n\n\`Contoh: ${m.prefix}bratcewek Hai semua\``)
    }
    
    m.react('🕕')
    
    try {
        const url = `https://api.deline.web.id/maker/cewekbrat?text=${encodeURIComponent(text)}`
        await sock.sendImageAsSticker(m.chat, url, m, {
            packname: config.sticker.packname,
            author: config.sticker.author
        })
        m.react('✅')
    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }