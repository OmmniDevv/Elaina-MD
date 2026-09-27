/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import config from '../../config.js';
const pluginConfig = {
    name: 'kannabrat',
    alias: ['kanna', 'kannagen'],
    category: 'sticker',
    description: 'Membuat sticker Kanna dengan teks',
    usage: '.kannabrat <teks>',
    example: '.kannabrat Hello World',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    let text = m.text?.trim()
    
    if (!text && m.quoted?.text) {
        text = m.quoted.text.trim()
    }
    
    if (!text) {
        return m.reply(
            `🎀 *ᴋᴀɴɴᴀ ʙʀᴀᴛ*\n\n` +
            `> Masukkan teks untuk sticker\n\n` +
            `> Contoh: \`${m.prefix}kannabrat Hello World\``
        )
    }
    
    if (text.length > 50) {
        return m.reply(`❌ Teks terlalu panjang! Maksimal 50 karakter.`)
    }
    
    const apikey = config.APIkey?.lolhuman
    if (!apikey) {
        return m.reply(`❌ API key lolhuman tidak dikonfigurasi!`)
    }
    
    m.react('🎀')
    
    try {
        const apiUrl = `https://api.lolhuman.xyz/api/creator/kannagen?apikey=${apikey}&text=${encodeURIComponent(text)}`
        const response = await axios.get(apiUrl, { 
            responseType: 'arraybuffer',
            timeout: 30000 
        })
        
        await sock.sendImageAsSticker(m.chat, Buffer.from(response.data), m)
        
        m.react('✅')
        
    } catch (err) {
        m.react('❌')
        m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> ${err.message}`)
    }
}

export { pluginConfig as config, handler };
