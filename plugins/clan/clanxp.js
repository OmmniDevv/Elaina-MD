/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'clanxp',
    alias: ['xpclan', 'clanexp'],
    category: 'clan',
    description: 'Lihat XP clan dan kontribusi member',
    usage: '.clanxp',
    example: '.clanxp',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m) {
    const db = getDatabase()
    const user = db.getUser(m.sender)
    
    if (!user.clanId) {
        return m.reply(`❌ Kamu belum punya clan!\n> Buat clan dengan *.clancreate*`)
    }
    
    const clan = db.db.data.clans[user.clanId]
    if (!clan) {
        return m.reply(`❌ Clan tidak ditemukan!`)
    }
    
    const memberContributions = {}
    if (clan.memberXP) {
        for (const member of clan.members) {
            memberContributions[member] = clan.memberXP[member] || 0
        }
    }
    
    const sortedMembers = Object.entries(memberContributions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    
    let txt = `📊 *ᴄʟᴀɴ ᴇxᴘ & ᴄᴏɴᴛʀɪʙᴜᴛɪᴏɴ*\n\n`
    txt += `╭┈┈⬡「 🏰 *ɪɴꜰᴏ ᴄʟᴀɴ* 」\n`
    txt += `┃ 📛 Nama: *${clan.name}*\n`
    txt += `┃ 📈 Total XP: *${(clan.exp || 0).toLocaleString('id-ID')}*\n`
    txt += `┃ 👥 Total Member: *${clan.members.length}*\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    
    if (sortedMembers.length > 0) {
        txt += `╭┈┈⬡「 🎖️ *ᴛᴏᴘ ᴄᴏɴᴛʀɪʙᴜᴛᴏʀ* 」\n`
        for (let i = 0; i < sortedMembers.length; i++) {
            const [memberId, xp] = sortedMembers[i]
            const userData = db.getUser(memberId)
            const name = userData?.name || memberId.split('@')[0]
            const medal = i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📌'
            txt += `┃ ${medal} ${i+1}. *${name}*\n`
            txt += `┃    └ XP: ${xp.toLocaleString('id-ID')}\n`
        }
        txt += `╰┈┈┈┈┈┈┈┈⬡`
    } else {
        txt += `> Belum ada kontribusi XP dari member`
    }
    
    await m.reply(txt)
}

export { pluginConfig as config, handler };
