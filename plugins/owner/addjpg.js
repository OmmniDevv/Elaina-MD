/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
import config from '../../config.js';
const pluginConfig = {
    name: 'addjpg',
    alias: ['addimage', 'tambahjpg', 'setjpg'],
    category: 'owner',
    description: 'Tambah gambar baru ke folder assets/images',
    usage: '.addjpg <nama_file.jpg> (reply gambar)',
    example: '.addjpg zerotwo.jpg',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const args = m.args || []
    const fileName = args[0]?.trim()
    
    if (!fileName || !fileName.toLowerCase().endsWith('.jpg')) {
        return m.reply(`❌ Gunakan: .addjpg <nama_file.jpg>\nContoh: .addjpg zerotwo.jpg`)
    }
    
    const isImage = m.isImage || (m.quoted && m.quoted.type === 'imageMessage')
    
    if (!isImage) {
        return m.reply(`🖼️ Reply gambar yang ingin ditambahkan.`)
    }
    
    try {
        let buffer
        if (m.quoted && m.quoted.isMedia) {
            buffer = await m.quoted.download()
        } else if (m.isMedia) {
            buffer = await m.download()
        }
        
        if (!buffer) {
            return m.reply(`❌ Gagal mendownload gambar`)
        }
        
        const targetPath = path.join(process.cwd(), 'assets', 'images', fileName)
        const dir = path.dirname(targetPath)
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        
        fs.writeFileSync(targetPath, buffer)
        
        m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n> Gambar telah tersimpan sebagai assets/images/${fileName}\n> Restart bot untuk melihat perubahan jika perlu.`)
        
    } catch (err) {
        m.reply(`❌ *ᴇʀʀᴏʀ*\n> ${err.message}`)
    }
}

export { pluginConfig as config, handler };
