/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { RIMURU_CORE_CONFIG } from "../../config.js";
import config from '../../config.js';
const pluginConfig = {
    name: 'upaudioch',
    alias: ['tovnsaluran', 'uploadaudioch', 'upaudiosaluran'],
    category: 'owner',
    description: 'Upload audio ke saluran (channel) WhatsApp',
    usage: '.upaudioch (reply audio) <teks>',
    example: '.upaudioch Pesan dari owner',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const quoted = m.quoted
    
    if (!quoted) {
        return m.reply(
            `💕 *ᴜᴘʟᴏᴀᴅ ᴀᴜᴅɪᴏ ᴛᴏ ᴄʜᴀɴɴᴇʟ* 💕\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✦ *Cara Pakai*\n` +
            `┃\n` +
            `┃   Reply audio dengan caption\n` +
            `┃   ${m.prefix}upaudioch <teks>\n` +
            `┃\n` +
            `┃ ✦ *Contoh*\n` +
            `┃\n` +
            `┃   ${m.prefix}upaudioch Info terbaru!\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Mau upload audio ke channel apa darling~?\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
    }
    
    const text = m.args.join(' ') || m.text?.trim() || 'Audio dari Owner'
    
    // 🔥 AMBIL ID CHANNEL DARI CONFIG
    const CHANNEL_ID = RIMURU_CORE_CONFIG.saluran?.id
    if (!CHANNEL_ID) {
        return m.reply(
            `❌ *ᴇʀʀᴏʀ*\n\n` +
            `> ID Saluran tidak ditemukan di config!\n` +
            `> Cek bagian \`saluran.id\` di config.js`
        )
    }
    
    const mime = quoted.mimetype || quoted.msg?.mimetype || ''
    
    if (!/audio/.test(mime)) {
        return m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> Reply audio/voice note yang mau diupload darling~ 🥺`)
    }
    
    m.react('💕')
    await m.reply(`⏳ *ᴘʀᴏᴄᴇꜱꜱɪɴɢ...*\n\n💗 *Rimuru:* Lagi upload audio ke channel darling~ tunggu sebentar yaa 🎵`)
    
    try {
        const audioBuffer = await quoted.download()
        
        if (!audioBuffer) {
            throw new Error('Gagal download audio')
        }
        
        await sock.sendMessage(CHANNEL_ID, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            ptt: true,
            contextInfo: {
                isForwarded: true,
                mentionedJid: [m.sender],
                businessMessageForwardInfo: {
                    businessOwnerJid: "0@s.whatsapp.net"
                },
                forwardedNewsletterMessageInfo: {
                    newsletterName: `${text}`,
                    newsletterJid: CHANNEL_ID
                }
            }
        })
        
        m.react('✅')
        
        await m.reply(
            `✅ *ᴜᴘʟᴏᴀᴅ sᴜᴄᴄᴇss*\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ 🎵 *ᴀᴜᴅɪᴏ*: Berhasil dikirim\n` +
            `┃ 📢 *ᴄʜᴀɴɴᴇʟ*: ${CHANNEL_ID}\n` +
            `┃ 📝 *ᴘᴇꜱᴀɴ*: ${text}\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Audio sudah terkirim darling~ 🎤\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
        
    } catch (err) {
        console.error('[UpAudioCh] Error:', err)
        m.react('💔')
        await m.reply(
            `💔 *ᴇʀʀᴏʀ*\n\n` +
            `> ${err.message}\n\n` +
            `> Coba lagi ya darling~ 🥺`
        )
    }
}

export { pluginConfig as config, handler };
