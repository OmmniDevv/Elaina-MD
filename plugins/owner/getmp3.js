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
    name: 'getmp3',
    alias: ['getaudio', 'ambilmp3', 'ambilaudio'],
    category: 'owner',
    description: 'Ambil file MP3/Audio dari folder assets/audio',
    usage: '.getmp3 <nama_file.mp3>',
    example: '.getmp3 zerotwo.mp3',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const args = m.args || []
    const fileName = args[0]?.trim()
    
    if (!fileName) {
        return m.reply(
            `💕 *ɢᴇᴛ ᴍᴘ3* 💕\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✦ *Cara Pakai*\n` +
            `┃\n` +
            `┃   ${m.prefix}getmp3 <nama_file.mp3>\n` +
            `┃\n` +
            `┃ ✦ *Contoh*\n` +
            `┃\n` +
            `┃   ${m.prefix}getmp3 zerotwo.mp3\n` +
            `┃\n` +
            `┃ ✦ *Lihat daftar file*\n` +
            `┃   ${m.prefix}listmp3\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣\n\n` +
            `💗 *Rimuru:* Mau ambil audio apa darling~?`
        )
    }
    
    m.react('💕')
    
    try {
        const audioPath = path.join(process.cwd(), 'assets', 'audio', fileName)
        
        if (!fs.existsSync(audioPath)) {
            m.react('💔')
            return m.reply(
                `💔 *ᴇʀʀᴏʀ*\n\n` +
                `> File *${fileName}* tidak ditemukan di folder assets/audio darling~\n\n` +
                `> Ketik *${m.prefix}listmp3* untuk lihat daftar file yang tersedia 🥺`
            )
        }
        
        const audioBuffer = fs.readFileSync(audioPath)
        const fileSizeMB = (audioBuffer.length / (1024 * 1024)).toFixed(2)
        
        await sock.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: fileName
        }, { quoted: m })
        
        m.react('✅')
        
        await m.reply(
            `💕 *ɢᴇᴛ ᴍᴘ3* 💕\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✅ *ʙᴇʀʜᴀꜱɪʟ*\n` +
            `┃\n` +
            `┃ 🎵 *ɴᴀᴍᴇ*: ${fileName}\n` +
            `┃ 📦 *ᴜᴋᴜʀᴀɴ*: ${fileSizeMB} MB\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Ini dia audio nya darling~ 🎶\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
        
    } catch (err) {
        console.error('[GetMP3] Error:', err)
        m.react('💔')
        return m.reply(
            `💔 *ᴇʀʀᴏʀ*\n\n` +
            `> ${err.message}\n\n` +
            `> Coba lagi ya darling~ 🥺`
        )
    }
}

export { pluginConfig as config, handler };
