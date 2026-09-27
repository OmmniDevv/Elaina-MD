/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from '../../src/lib/elaina-error.js'
import { live3d } from '../../src/scraper/seaart.js'
const pluginConfig = {
    name: 'tomanga',
    alias: ['manga', 'mangafy', 'mangastyle'],
    category: 'ai',
    description: 'Ubah foto menjadi gaya manga Jepang',
    usage: '.tomanga (reply/kirim gambar)',
    example: '.tomanga',
    isOwner: false,
    isPremium: true,
    isGroup: false,
    isPrivate: false,
    cooldown: 60,
    energi: 3,
    isEnabled: true
}

const PROMPT = `Transform this image into Japanese manga style illustration. 
Apply black and white manga aesthetics with dramatic shading, speed lines, 
expressive eyes, and detailed screentones. Keep the original composition 
but convert it to look like a page from a Japanese manga with bold ink lines, 
dynamic poses, and that distinctive manga art style.`

async function handler(m, { sock }) {
    const isImage = m.isImage || (m.quoted && (m.quoted.isImage || m.quoted.type === 'imageMessage'))
    
    if (!isImage) {
        return m.reply(
            `📖 *ᴛᴏ ᴍᴀɴɢᴀ*\n\n` +
            `> Kirim/reply gambar untuk diubah ke gaya manga\n\n` +
            `\`${m.prefix}tomanga\``
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