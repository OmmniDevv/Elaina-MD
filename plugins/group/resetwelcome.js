/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'resetwelcome',
    alias: ['delwelcome', 'clearwelcome'],
    category: 'group',
    description: 'Reset welcome message ke default',
    usage: '.resetwelcome',
    example: '.resetwelcome',
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
    
    if (!groupData?.welcomeMsg) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Welcome message sudah default`)
    }
    
    db.setGroup(m.chat, { welcomeMsg: null })
    
    m.react('✅')
    
    await m.reply(`✅ *ᴡᴇʟᴄᴏᴍᴇ ᴅɪʀᴇsᴇᴛ*\n\n> Kembali ke pesan default`)
}

export { pluginConfig as config, handler }