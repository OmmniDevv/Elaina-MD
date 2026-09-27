/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'resetwarn',
    alias: ['clearwarn', 'hapuswarn', 'delwarn'],
    category: 'group',
    description: 'Reset warning member',
    usage: '.resetwarn @user',
    example: '.resetwarn @user',
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
    
    let targetUser = null
    if (m.quoted) {
        targetUser = m.quoted.sender
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        targetUser = m.mentionedJid[0]
    }
    
    if (!targetUser) {
        await m.reply(
            `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
            `> Reply pesan user + \`${m.prefix}resetwarn\`\n` +
            `> Atau: \`${m.prefix}resetwarn @user\``
        )
        return
    }
    
    let groupData = db.getGroup(m.chat) || {}
    let warnings = groupData.warnings || {}
    const maxWarns = groupData.maxWarnings || 3
    
    const targetName = targetUser.split('@')[0]
    
    if (!warnings[targetUser] || warnings[targetUser].length === 0) {
        await m.reply(`✅ @${targetName} tidak memiliki warning.`, { mentions: [targetUser] })
        return
    }
    
    const prevCount = warnings[targetUser].length
    delete warnings[targetUser]
    db.setGroup(m.chat, { ...groupData, warnings: warnings })
    
    await m.reply(
        `✅ *ᴡᴀʀɴɪɴɢ ᴅɪʀᴇsᴇᴛ*\n` +
        `Warning @${targetName} berhasil direset!\n` +
        `Sebelumnya: *${prevCount}/${maxWarns}*\n` +
        `Sekarang: *0/${maxWarns}*`,
        { mentions: [targetUser] }
    )
}

export { pluginConfig as config, handler }