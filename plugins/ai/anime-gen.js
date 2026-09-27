/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { f } from '../../src/lib/elaina-http.js'
import config from '../../config.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'anime-gen',
    alias: ['animegen', 'aianimegen', 'genai-anime'],
    category: 'ai',
    description: 'Generate AI anime art dari prompt',
    usage: '.anime-gen <prompt>',
    example: '.anime-gen girl, vibrant color, smilling',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const prompt = m.text
    
    if (!prompt) {
        return m.reply(
            `🎨 *ᴀɴɪᴍᴇ ᴀʀᴛ ɢᴇɴᴇʀᴀᴛᴏʀ*\n\n` +
            `> Generate gambar anime AI dari prompt!\n\n` +
            `*ᴄᴀʀᴀ ᴘᴀᴋᴀɪ:*\n` +
            `> \`${m.prefix}anime-gen <deskripsi>\`\n\n` +
            `*ᴄᴏɴᴛᴏʜ:*\n` +
            `> \`${m.prefix}anime-gen girl, vibrant color, smilling, yellow pink gradient hair\`\n` +
            `> \`${m.prefix}anime-gen boy, dark aesthetic, silver hair, red eyes\`\n\n` +
            `*ᴛɪᴘs:*\n` +
            `> • Gunakan bahasa Inggris\n` +
            `> • Makin detail prompt, makin bagus hasil\n` +
            `> • Tambahkan style: vibrant, dark, pastel, etc`
        )
    }
    
    m.react('🕕')

    try {
        const NEOXR_APIKEY = config.APIkey?.neoxr || 'Milik-Bot-RimuruMD'
        const apiUrl = `https://api.neoxr.eu/api/ai-anime?q=${encodeURIComponent(prompt)}&apikey=${NEOXR_APIKEY}`
        
        const data = await f(apiUrl)
        
        if (!data?.status || !data?.data?.url) {
            m.react('❌')
            return m.reply('❌ *ɢᴀɢᴀʟ*\n\n> Gagal generate gambar. Coba lagi nanti!')
        }
        
        const result = data.data  
        await sock.sendMedia(m.chat, result.url, null, m, {
            type: 'image'
        })
        m.react('✅')
    } catch (error) {
        m.react('☢')
        if (error.code === 'ECONNABORTED') {
            m.reply('⏱️ *ᴛɪᴍᴇᴏᴜᴛ*\n\n> Request terlalu lama. Coba lagi!')
        } else {
            m.reply(te(m.prefix, m.command, m.pushName))
        }
    }
}

export { pluginConfig as config, handler }