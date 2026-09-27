/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'notifpromote',
    alias: [],
    category: 'group',
    description: 'Toggle notifikasi saat ada yang dijadikan admin',
    usage: '.notifpromote on/off',
    example: '.notifpromote on',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

function handler(m, { sock, db }) {
    if (!m.isAdmin && !m.isOwner) {
        return m.reply(`❌ Hanya admin grup yang bisa menggunakan fitur ini`)
    }
    
    const args = m.args[0]?.toLowerCase()
    const group = db.getGroup(m.chat) || {}
    
    if (!['on', 'off'].includes(args)) {
        const status = group.notifPromote === true ? '✅ Aktif' : '❌ Nonaktif'
        return m.reply(`👑 *ɴᴏᴛɪꜰ ᴘʀᴏᴍᴏᴛᴇ*\n\n> Status: ${status}\n\n*Penggunaan:*\n\`${m.prefix}notifpromote on\` - Aktifkan\n\`${m.prefix}notifpromote off\` - Nonaktifkan`)
    }
    
    if (args === 'on') {
        group.notifPromote = true
        db.setGroup(m.chat, group)
        return m.reply(`✅ *ɴᴏᴛɪꜰ ᴘʀᴏᴍᴏᴛᴇ ᴅɪᴀᴋᴛɪꜰᴋᴀɴ*`)
    }
    
    if (args === 'off') {
        group.notifPromote = false
        db.setGroup(m.chat, group)
        return m.reply(`❌ *ɴᴏᴛɪꜰ ᴘʀᴏᴍᴏᴛᴇ ᴅɪɴᴏɴᴀᴋᴛɪꜰᴋᴀɴ*`)
    }
}

export { pluginConfig as config, handler }