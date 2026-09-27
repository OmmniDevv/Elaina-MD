/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'addantilink',
    alias: ['addalink', 'addblocklink'],
    category: 'group',
    description: 'Menambah link ke daftar antilink',
    usage: '.addantilink <domain/pattern>',
    example: '.addantilink tiktok.com',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

function handler(m) {
    const db = getDatabase()
    const link = m.text?.toLowerCase()
    
    if (!link) {
        return m.reply(
            `🔗 *ᴀᴅᴅ ᴀɴᴛɪʟɪɴᴋ*\n\n` +
            `> Masukkan domain/pattern link yang ingin diblokir\n\n` +
            `\`Contoh:\`\n` +
            `\`${m.prefix}addantilink tiktok.com\`\n` +
            `\`${m.prefix}addantilink chat.whatsapp.com\`\n` +
            `\`${m.prefix}addantilink instagram.com\``
        )
    }
    
    const groupData = db.getGroup(m.chat) || {}
    const antilinkList = groupData.antilinkList || []
    
    if (antilinkList.includes(link)) {
        return m.reply(`⚠️ Link \`${link}\` sudah ada di daftar antilink!`)
    }
    
    antilinkList.push(link)
    db.setGroup(m.chat, { antilinkList })
    
    m.reply(
        `✅ *ᴀɴᴛɪʟɪɴᴋ ᴅɪᴛᴀᴍʙᴀʜ*\n\n` +
        `> Link: \`${link}\`\n` +
        `> Total: *${antilinkList.length}* link\n\n` +
        `> Gunakan \`${m.prefix}listantilink\` untuk melihat daftar`
    )
}

export { pluginConfig as config, handler }