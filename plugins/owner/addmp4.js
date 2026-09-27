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
    name: 'addmp4',
    alias: ['addvideo', 'tambahmp4', 'setmp4', 'addvid'],
    category: 'owner',
    description: 'Tambah video baru ke folder assets/video',
    usage: '.addmp4 <nama_file.mp4> (reply video)',
    example: '.addmp4 opening.mp4',
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
    
    // Cek ekstensi file (bisa .mp4, .mkv, .mov, .avi, .webm)
    const validExtensions = ['.mp4', '.mkv', '.mov', '.avi', '.webm', '.m4v']
    const isValidExt = validExtensions.some(ext => fileName?.toLowerCase().endsWith(ext))
    
    if (!fileName || !isValidExt) {
        return m.reply(`❌ Gunakan: .addmp4 <nama_file.mp4>\nContoh: .addmp4 opening.mp4\n\n📌 *Ekstensi yang didukung:* ${validExtensions.join(', ')}`)
    }
    
    const isVideo = m.isVideo || (m.quoted && m.quoted.type === 'videoMessage')
    
    if (!isVideo) {
        return m.reply(`🎥 Reply video yang ingin ditambahkan.`)
    }
    
    try {
        let buffer
        if (m.quoted && m.quoted.isMedia) {
            buffer = await m.quoted.download()
        } else if (m.isMedia) {
            buffer = await m.download()
        }
        
        if (!buffer) {
            return m.reply(`❌ Gagal mendownload video`)
        }
        
        const targetPath = path.join(process.cwd(), 'assets', 'video', fileName)
        const dir = path.dirname(targetPath)
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        
        fs.writeFileSync(targetPath, buffer)
        
        // Dapatkan ukuran file
        const fileSizeMB = (buffer.length / (1024 * 1024)).toFixed(2)
        
        m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n> Video telah tersimpan sebagai assets/video/${fileName}\n> 📦 Ukuran: ${fileSizeMB} MB\n> Restart bot untuk melihat perubahan jika perlu.`)
        
    } catch (err) {
        m.reply(`❌ *ᴇʀʀᴏʀ*\n> ${err.message}`)
    }
}

export { pluginConfig as config, handler };
