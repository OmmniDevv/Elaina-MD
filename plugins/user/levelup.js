/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'levelup',
    alias: ['lvlup', 'levelnotif'],
    category: 'user',
    description: 'Toggle notifikasi level up',
    usage: '.levelup <on/off>',
    example: '.levelup on',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

function handler(m, { sock }) {
    const db = getDatabase()
    const user = db.getUser(m.sender)
    const args = m.args || []
    const sub = args[0]?.toLowerCase()
    
    if (!user.settings) user.settings = {}
    
    if (sub === 'on') {
        user.settings.levelupNotif = true
        db.save()
        return m.reply(
            `✅ *ʟᴇᴠᴇʟ ᴜᴘ ɴᴏᴛɪꜰ*\n\n` +
            `> Status: *ON* ✅\n` +
            `> Kamu akan menerima notifikasi saat naik level!`
        )
    }
    
    if (sub === 'off') {
        user.settings.levelupNotif = false
        db.save()
        return m.reply(
            `❌ *ʟᴇᴠᴇʟ ᴜᴘ ɴᴏᴛɪꜰ*\n\n` +
            `> Status: *OFF* ❌\n` +
            `> Notifikasi level up dinonaktifkan.`
        )
    }
    
    const status = user.settings.levelupNotif !== false ? 'ON ✅' : 'OFF ❌'
    return m.reply(
        `🔔 *ʟᴇᴠᴇʟ ᴜᴘ ɴᴏᴛɪꜰ*\n\n` +
        `> Status saat ini: *${status}*\n\n` +
        `╭┈┈⬡「 📋 *ᴜsᴀɢᴇ* 」\n` +
        `┃ > \`.levelup on\` - Aktifkan\n` +
        `┃ > \`.levelup off\` - Nonaktifkan\n` +
        `╰┈┈┈┈┈┈┈┈⬡`
    )
}

export { pluginConfig as config, handler }