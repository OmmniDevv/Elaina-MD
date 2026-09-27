/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'resetgoodbye',
    alias: ['delgoodbye', 'cleargoodbye'],
    category: 'group',
    description: 'Reset goodbye message ke default',
    usage: '.resetgoodbye',
    example: '.resetgoodbye',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const groupData = db.getGroup(m.chat)
    
    if (!groupData?.goodbyeMsg) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Goodbye message sudah default`)
    }
    
    db.setGroup(m.chat, { goodbyeMsg: null })
    
    m.react('✅')
    
    await m.reply(`✅ *ɢᴏᴏᴅʙʏᴇ ᴅɪʀᴇsᴇᴛ*\nKembali ke pesan default`)
}

export { pluginConfig as config, handler }