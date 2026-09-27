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
    name: 'pacarsertifikat',
    alias: ['sertifikatpacar', 'certpacar', 'pacarcert'],
    category: 'canvas',
    description: 'Membuat sertifikat pacar',
    usage: '.pacarsertifikat <nama1> <nama2>',
    example: '.pacarsertifikat Budi Ani',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const args = m.args || []
    
    if (args.length < 2) {
        return m.reply(
            `💑 *sᴇʀᴛɪꜰɪᴋᴀᴛ ᴘᴀᴄᴀʀ*\n\n` +
            `╭┈┈⬡「 📋 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ* 」\n` +
            `┃ ◦ \`${m.prefix}pacarsertifikat <nama1> <nama2>\`\n` +
            `╰┈┈⬡\n\n` +
            `> Contoh: \`${m.prefix}pacarsertifikat Budi Ani\``
        )
    }
    
    const name1 = args[0]
    const name2 = args.slice(1).join(' ')
    
    m.react('💑')
    
    try {
        const apiKey = config.zeroApi?.lolhuman
        
        if (!apiKey) {
            throw new Error('API Key tidak ditemukan di config')
        }
        
        const apiUrl = `https://api.lolhuman.xyz/api/pacarserti?apikey=${apiKey}&name1=${encodeURIComponent(name1)}&name2=${encodeURIComponent(name2)}`
        
        await sock.sendMedia(m.chat, apiUrl, null, m, {
            type: 'image',
        })
        
        m.react('✅')
        
    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}
export { pluginConfig as config, handler };