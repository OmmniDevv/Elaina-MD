/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'clanannounce',
    alias: ['announce', 'clanbroadcast', 'pengumuman'],
    category: 'clan',
    description: 'Kirim pengumuman ke semua member clan',
    usage: '.clanannounce <pesan>',
    example: '.clanannounce Besok ada event war!',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const user = db.getUser(m.sender)
    const message = m.text?.trim()
    
    if (!message) {
        return m.reply(`📢 *ᴄʟᴀɴ ᴀɴɴᴏᴜɴᴄᴇ*\n\n> Kirim pengumuman ke semua member clan\n\n> Contoh: .clanannounce Besok ada event war!`)
    }
    
    if (!user.clanId) {
        return m.reply(`❌ Kamu belum punya clan!`)
    }
    
    const clan = db.db.data.clans[user.clanId]
    if (!clan) {
        return m.reply(`❌ Clan tidak ditemukan!`)
    }
    
    if (clan.leader !== m.sender && clan.roles?.[m.sender] !== 'coleader') {
        return m.reply(`❌ Hanya *Leader* atau *Co-Leader* yang bisa announce!`)
    }
    
    const userData = db.getUser(m.sender)
    const userName = userData?.name || m.pushName || m.sender.split('@')[0]
    
    let txt = `📢 *ᴄʟᴀɴ ᴀɴɴᴏᴜɴᴄᴇᴍᴇɴᴛ*\n\n`
    txt += `╭┈┈⬡「 🏰 *${clan.name}* 」\n`
    txt += `┃ 👑 Dari: *${userName}*\n`
    txt += `┃ 📝 Pesan:\n`
    txt += `┃ ✨ *${message}*\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    txt += `> Ketik .c untuk balas di clan chat`
    
    let successCount = 0
    for (const member of clan.members) {
        await sock.sendMessage(member, { text: txt }).catch(() => {})
        successCount++
    }
    
    await m.reply(`✅ Pengumuman terkirim ke *${successCount}* member clan!`)
}

export { pluginConfig as config, handler };
