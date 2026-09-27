/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'similarity',
    alias: ['setsimilarity', 'sim'],
    category: 'owner',
    description: 'Mengaktifkan/menonaktifkan fitur similarity (saran typo)',
    usage: '.similarity <on/off>',
    example: '.similarity on',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 0,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const args = m.args
    
    if (!args[0]) {
        return m.reply(`⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n> \`.similarity on\` - Aktifkan\n> \`.similarity off\` - Matikan`)
    }
    
    const mode = args[0].toLowerCase()
    
    if (mode === 'on') {
        db.setting('similarity', true)
        await m.react('✅')
        await m.reply(`✅ *sᴜᴋsᴇs*\n\n> Fitur similarity command *DIAKTIFKAN*`)
    } else if (mode === 'off') {
        db.setting('similarity', false)
        await m.react('✅')
        await m.reply(`✅ *sᴜᴋsᴇs*\n\n> Fitur similarity command *DIMATIKAN*`)
    } else {
        return m.reply(`⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n> \`.similarity on\` - Aktifkan\n> \`.similarity off\` - Matikan`)
    }
    
    await db.save()
}

export { pluginConfig as config, handler }