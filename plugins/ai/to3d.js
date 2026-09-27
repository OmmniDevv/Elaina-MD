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
    name: 'to3d',
    alias: ['3d', '3dfy', 'to3dmodel'],
    category: 'ai',
    description: 'Ubah foto menjadi gaya 3D render',
    usage: '.to3d (reply/kirim gambar)',
    example: '.to3d',
    isOwner: false,
    isPremium: true,
    isGroup: false,
    isPrivate: false,
    cooldown: 60,
    energi: 3,
    isEnabled: true
}

const PROMPT = `Transform this image into a high-quality 3D rendered style like Pixar or DreamWorks CGI. 
Apply realistic lighting, smooth textures, and that polished 3D animated movie look. 
Keep the original composition but make it look like a frame from a modern 3D animated film 
with subsurface scattering on skin, detailed hair, and cinematic lighting.`

async function handler(m, { sock }) {
    const isImage = m.isImage || (m.quoted && (m.quoted.isImage || m.quoted.type === 'imageMessage'))
    
    if (!isImage) {
        return m.reply(
            `🎮 *ᴛᴏ 3ᴅ*\n\n` +
            `> Kirim/reply gambar untuk diubah ke gaya 3D\n\n` +
            `\`${m.prefix}to3d\``
        )
    }
    
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
        
        await m.react('🕕')
        
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