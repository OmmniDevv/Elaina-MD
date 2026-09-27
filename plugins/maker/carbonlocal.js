/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js';
import { generateCarbon } from '../../src/lib/elaina-carbon.js';
const pluginConfig = {
    name: 'carbonlocal',
    alias: ['carbonlv', 'carboncanvas', 'carbonsnap'],
    category: 'maker',
    description: 'Bikin screenshot kode aesthetic seperti Carbon.now.sh (via Canvas lokal)',
    usage: '.carbonlocal <kode> (atau reply pesan)',
    example: '.carbonlocal console.log("Hello Darling!")',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 8,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    let code = m.args.join(' ') || m.text?.trim() || ''
    
    if (m.quoted) {
        code = m.quoted.text || m.quoted.body || code
    }
    
    if (!code || code.length < 3) {
        return m.reply(
            `💕 *ᴄᴀʀʙᴏɴ ᴄᴏᴅᴇ ꜱɴᴀᴘꜱʜᴏᴛ (ʟᴏᴄᴀʟ)* 💕\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✦ *Cara Pakai*\n` +
            `┃\n` +
            `┃   ${m.prefix}carbonlocal <kode>\n` +
            `┃   atau reply pesan dengan .carbonlocal\n` +
            `┃\n` +
            `┃ ✦ *Contoh*\n` +
            `┃\n` +
            `┃   ${m.prefix}carbonlocal console.log("Hello")\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Mau bikin screenshot kode apa darling~?\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
    }
    
    m.react('💕')
    await m.reply(`⏳ *ᴘʀᴏᴄᴇꜱꜱɪɴɢ...*\n\n💗 *Rimuru:* Lagi bikin screenshot kode darling~ tunggu sebentar yaa 🎨`)
    
    try {
        const imageBuffer = await generateCarbon(code)
        
        await sock.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `💕 *ᴄᴀʀʙᴏɴ ᴄᴏᴅᴇ (ʟᴏᴄᴀʟ)* 💕\n\n` +
                    `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
                    `┃ ✅ *ʙᴇʀʜᴀꜱɪʟ*\n` +
                    `┃ 📝 *ᴋᴏᴅᴇ*: ${code.length > 50 ? code.substring(0, 50) + '...' : code}\n` +
                    `┃\n` +
                    `┃ 💗 *Rimuru:* Ini hasilnya darling~ 📸\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        }, { quoted: m })
        
        m.react('✅')
        
    } catch (err) {
        console.error('[Carbon Canvas] Error:', err)
        m.react('💔')
        return m.reply(
            `💔 *ᴇʀʀᴏʀ*\n\n` +
            `> ${err.message}\n\n` +
            `> Coba lagi ya darling~ 🥺`
        )
    }
}

export { pluginConfig as config, handler };
