/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import { uploadImage } from '../../src/lib/elaina-uploader.js'
import { f } from '../../src/lib/elaina-http.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'tofigurev2',
    alias: ['figurev2', 'figure2'],
    category: 'ai',
    description: 'Ubah gambar ke style Figure v2',
    usage: '.tofigurev2 (reply gambar)',
    example: '.tofigurev2',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 2,
    isEnabled: true
}

async function handler(m, { sock }) {
    const isImage = m.isImage || (m.quoted && m.quoted.type === 'imageMessage')
    
    if (!isImage) {
        return m.reply(`🎭 *ꜰɪɢᴜʀᴇ sᴛʏʟᴇ ᴠ2*\n\n> Kirim/reply gambar untuk diubah ke style Figure\n\n\`${m.prefix}tofigurev2\``)
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
        
        const imageUrl = await uploadImage(buffer, 'image.jpg')
        
        const url = `https://api-faa.my.id/faa/tofigurav3?url=${encodeURIComponent(imageUrl)}`
        const res = await f(url, 'arrayBuffer')
        
        m.react('✅')
        
        await sock.sendMedia(m.chat, Buffer.from(res), null, m, {
            type: 'image'
        })
        
    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }