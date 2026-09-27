/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js'
import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'listban',
    alias: ['listbanned', 'banlist'],
    category: 'owner',
    description: 'Melihat daftar banned user',
    usage: '.listban',
    example: '.listban',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const bannedUsers = config.bannedUsers && config.bannedUsers.length > 0 ? config.bannedUsers : (db.setting('bannedUsers') || [])
    
    if (bannedUsers.length === 0) {
        return m.reply(`🚫 *ʟɪsᴛ ʙᴀɴɴᴇᴅ*\n\n> Tidak ada user yang dibanned\n\n\`Gunakan: ${m.prefix}ban <nomor>\``)
    }
    
    let caption = `🚫 *ʟɪsᴛ ʙᴀɴɴᴇᴅ*\n\n`
    caption += `╭┈┈⬡「 ⛔ *ᴜsᴇʀs* 」\n`
    
    for (let i = 0; i < bannedUsers.length; i++) {
        caption += `┃ ${i + 1}. \`${bannedUsers[i]}\`\n`
    }
    
    caption += `╰┈┈⬡\n\n`
    caption += `> ᴛᴏᴛᴀʟ: \`${bannedUsers.length}\` ʙᴀɴɴᴇᴅ ᴜsᴇʀ`
    
    await m.reply(caption)
}

export { pluginConfig as config, handler }