/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import config from '../../config.js';
import te from '../../src/lib/elaina-error.js';

const pluginConfig = {
    name: 'meme2',
    alias: ['changemymind'],
    category: 'canvas',
    description: 'Membuat meme change my mind',
    usage: '.meme2 <teks>',
    example: '.meme2 Tahu bacem enak banget',
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
            `🎭 *ᴄʜᴀɴɢᴇ ᴍʏ ᴍɪɴᴅ*\n\n` +
            `> Masukkan teks untuk meme\n\n` +
            `> Contoh: \`${m.prefix}meme2 Tahu bacem enak\``
        )
    }
    
    const apikey = config.zeroApi?.lolhuman
    if (!apikey) {
        return m.reply(`❌ API key lolhuman tidak dikonfigurasi!`)
    }
    
    m.react('🕕')
    
    try {
        await sock.sendMedia(m.chat, `https://api.lolhuman.xyz/api/meme4?apikey=${apikey}&text=${encodeURIComponent(text)}`, null, m, {
            type: 'image',
        })
        
        m.react('✅')
        
    } catch (err) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}
export { pluginConfig as config, handler };