/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'setdelay',
    alias: ['delay', 'setdelaybot', 'botdelay'],
    category: 'owner',
    description: 'Mengatur delay respon bot (cooldown global)',
    usage: '.setdelay <detik>',
    example: '.setdelay 3',
    isOwner: true,
    cooldown: 5,
    isEnabled: true
}

async function handler(m, { db }) {
    const args = m.args || []
    const delayInput = args[0]
    
    // Validasi input
    if (!delayInput) {
        const currentDelay = db.setting('botDelay') || 0
        return m.reply(
`╭───〔 𝗦𝗘𝗧𝗗𝗘𝗟𝗔𝗬 〕───⬣
│
│ ✦ *Cara Pakai*
│
│  𖦹 .setdelay <detik>
│
│ ✦ *Contoh*
│
│  𖦹 .setdelay 3  (delay 3 detik)
│  𖦹 .setdelay 0  (tanpa delay)
│
│ ✦ *Status Saat Ini*
│
│  ⏱️ ᴅᴇʟᴀʏ: ${currentDelay} ᴅᴇᴛɪᴋ
│
╰──────────────────⬣`
        )
    }
    
    const delay = parseInt(delayInput)
    
    if (isNaN(delay) || delay < 0) {
        return m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> Delay harus berupa angka positif!`)
    }
    
    if (delay > 60) {
        return m.reply(`⚠️ *ᴘᴇʀɪɴɢᴀᴛᴀɴ*\n\n> Delay maksimal 60 detik!`)
    }
    
    m.react('⏳')
    
    // Simpan ke database
    db.setting('botDelay', delay)
    
    m.react('✅')
    
    return m.reply(
`╭───〔 𝗦𝗘𝗧𝗗𝗘𝗟𝗔𝗬 〕───⬣
│
│ ✦ *ᴅᴇʟᴀʏ ʙᴇʀʜᴀꜱɪʟ ᴅɪᴜʙᴀʜ*
│
│  ⏱️ ᴅᴇʟᴀʏ ʟᴀᴍᴀ: \`${db.setting('botDelayBefore') || 0}\` ᴅᴇᴛɪᴋ
│  ⏱️ ᴅᴇʟᴀʏ ʙᴀʀᴜ: \`${delay}\` ᴅᴇᴛɪᴋ
│
│ ✦ *ᴘᴇɴɢᴀʀᴜʜ*
│
│  ${delay === 0 ? '✅ Bot akan langsung respon tanpa delay' : `⏳ Bot akan delay ${delay} detik sebelum merespon`}
│
╰──────────────────⬣`
    )
}

export { pluginConfig as config, handler };
