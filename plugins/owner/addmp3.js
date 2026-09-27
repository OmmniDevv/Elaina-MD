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
    name: 'addmp3',
    alias: ['addaudio', 'tambahmp3', 'setmp3', 'addmusik'],
    category: 'owner',
    description: 'Tambah file MP3/Audio ke folder assets/audio',
    usage: '.addmp3 <nama_file.mp3> (reply audio)',
    example: '.addmp3 zerotwo.mp3',
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
    
    const validExtensions = ['.mp3', '.m4a', '.ogg', '.wav', '.aac', '.flac']
    const isValidExt = validExtensions.some(ext => fileName?.toLowerCase().endsWith(ext))
    
    if (!fileName || !isValidExt) {
        return m.reply(
            `💕 *ᴀᴅᴅ ᴍᴘ3* 💕\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✦ *Cara Pakai*\n` +
            `┃\n` +
            `┃   ${m.prefix}addmp3 <nama_file.mp3>\n` +
            `┃   (sambil reply audio)\n` +
            `┃\n` +
            `┃ ✦ *Contoh*\n` +
            `┃\n` +
            `┃   ${m.prefix}addmp3 zerotwo.mp3\n` +
            `┃\n` +
            `┃ ✦ *Ekstensi yang didukung*\n` +
            `┃   ${validExtensions.join(', ')}\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣\n\n` +
            `💗 *Rimuru:* Kirim audionya darling~`
        )
    }
    
    const isAudio = m.isAudio || (m.quoted && m.quoted.type === 'audioMessage')
    
    if (!isAudio) {
        return m.reply(
            `💔 *ᴇʀʀᴏʀ*\n\n` +
            `> Reply audio/voice note yang mau ditambahkan darling~ 🥺`
        )
    }
    
    m.react('💕')
    
    try {
        let buffer
        if (m.quoted && m.quoted.isMedia) {
            buffer = await m.quoted.download()
        } else if (m.isMedia) {
            buffer = await m.download()
        }
        
        if (!buffer) {
            return m.reply(
                `💔 *ɢᴀɢᴀʟ*\n\n` +
                `> Audio nya gak bisa di download darling~ 🥺`
            )
        }
        
        const targetPath = path.join(process.cwd(), 'assets', 'audio', fileName)
        const dir = path.dirname(targetPath)
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        
        fs.writeFileSync(targetPath, buffer)
        
        const fileSizeMB = (buffer.length / (1024 * 1024)).toFixed(2)
        
        m.react('✅')
        
        return m.reply(
            `💕 *ᴀᴅᴅ ᴍᴘ3* 💕\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✅ *ʙᴇʀʜᴀꜱɪʟ*\n` +
            `┃\n` +
            `┃ 📁 *ʟᴏᴋᴀꜱɪ*: assets/audio/${fileName}\n` +
            `┃ 📦 *ᴜᴋᴜʀᴀɴ*: ${fileSizeMB} MB\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Audio nya udah tersimpan darling~\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
        
    } catch (err) {
        console.error('[AddMP3] Error:', err)
        m.react('💔')
        return m.reply(
            `💔 *ᴇʀʀᴏʀ*\n\n` +
            `> ${err.message}\n\n` +
            `> Coba lagi ya darling~ 🥺`
        )
    }
}

export { pluginConfig as config, handler };
