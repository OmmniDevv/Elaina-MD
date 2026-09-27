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
    name: 'tofigure3',
    alias: ['figurine3', 'tofigure3', 'bandai3', 'actionfigure3'],
    category: 'ai',
    description: 'Ubah foto menjadi action figure/figurine koleksi',
    usage: '.tofigure3 (reply/kirim gambar)',
    example: '.tofigure3',
    isOwner: false,
    isPremium: true,
    isGroup: false,
    isPrivate: false,
    cooldown: 60,
    energi: 3,
    isEnabled: true
}

const PROMPT = `Using the model, create a 1/7 scale commercialized figurine of the characters in the picture, 
in a realistic style, in a real environment. The figurine is placed on a computer desk. 
The figurine has a round transparent acrylic base, with no text on the base. 
The content on the computer screen is the modeling process of this figurine. 
Next to the computer screen is a BANDAI-style toy packaging box printed with the original artwork. 
The packaging features two-dimensional flat illustrations.`

async function handler(m, { sock }) {
    const isImage = m.isImage || (m.quoted && (m.quoted.isImage || m.quoted.type === 'imageMessage'))
    
    if (!isImage) {
        return m.reply(
            `🎭 *ᴛᴏ ꜰɪɢᴜʀ 3*\n\n` +
            `> Kirim/reply gambar untuk diubah ke figurine/action figure\n\n` +
            `\`${m.prefix}tofigure3\``
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
            type: 'image'
        })
        
    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }