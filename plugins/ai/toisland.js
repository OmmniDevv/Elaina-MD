/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { live3d } from '../../src/scraper/seaart.js'
import te from '../../src/lib/elaina-error.js'

const pluginConfig = {
    name: 'toisland',
    alias: ['island', 'tropical'],
    category: 'ai',
    description: 'Ubah foto menjadi suasana pulau tropis',
    usage: '.toisland (reply/kirim gambar)',
    example: '.toisland',
    isOwner: false,
    isPremium: true,
    isGroup: false,
    isPrivate: false,
    cooldown: 60,
    energi: 3,
    isEnabled: true
}

const PROMPT = `Transform this image into a tropical island scene. 
Place the subject in a beautiful island environment with clear blue ocean, palm trees, and warm sunlight. 
Add realistic lighting, shadows, and vibrant tropical colors. 
Keep the original identity, high detail, cinematic, photorealistic.`

async function handler(m, { sock }) {
    const isImage = m.isImage || (m.quoted && (m.quoted.isImage || m.quoted.type === 'imageMessage'))
    
    if (!isImage) {
        return m.reply(
            `🏝️ *ᴛᴏ ɪsʟᴀɴᴅ*\n\n` +
            `> Kirim/reply gambar untuk suasana pulau\n\n` +
            `\`${m.prefix}toisland\``
        )
    }
    
    m.react('🕕')
    
    try {
        let buffer
        if (m.quoted && m.quoted.isMedia) {
            buffer = await m.quoted.download()
        } else if (m.isMedia) {
            buffer = await m.download()
        }
        
        if (!buffer) {
            m.react('❌')
            return m.reply(`❌ Gagal mendownload gambar`)
        }
        
        const result = await live3d(buffer, PROMPT)
        
        m.react('✅')
        
        await sock.sendMedia(m.chat, result.image, null, m, {
            type: 'image',
        })
        
    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }