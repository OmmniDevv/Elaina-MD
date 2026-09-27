/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'clanrank',
    alias: ['rankclan', 'peringkatclan'],
    category: 'clan',
    description: 'Lihat peringkat clan kamu',
    usage: '.clanrank',
    example: '.clanrank',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

function getLevelFromExp(exp) {
    return Math.floor(Math.sqrt(exp / 100)) + 1
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
    
    const allClans = Object.values(db.db.data.clans)
        .sort((a, b) => {
            if (b.level !== a.level) return (b.level || 1) - (a.level || 1)
            if (b.exp !== a.exp) return (b.exp || 0) - (a.exp || 0)
            return (b.wins || 0) - (a.wins || 0)
        })
    
    const rank = allClans.findIndex(c => c.id === clan.id) + 1
    const totalClans = allClans.length
    const level = clan.level || getLevelFromExp(clan.exp || 0)
    
    let rankIcon = ''
    if (rank === 1) rankIcon = '👑'
    else if (rank === 2) rankIcon = '🥈'
    else if (rank === 3) rankIcon = '🥉'
    else rankIcon = '📊'
    
    const higherClans = allClans.filter((c, i) => i < rank - 1 && i < 3)
    const lowerClans = allClans.filter((c, i) => i > rank - 1 && i < rank + 3)
    
    let txt = `${rankIcon} *ᴘᴇʀɪɴɢᴋᴀᴛ ᴄʟᴀɴ*\n\n`
    txt += `╭┈┈⬡「 🏰 *${clan.name}* 」\n`
    txt += `┃ 🎯 Peringkat: *${rank} / ${totalClans}*\n`
    txt += `┃ 📊 Persentase: *${Math.floor((rank / totalClans) * 100)}%* teratas\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    
    if (higherClans.length > 0) {
        txt += `╭┈┈⬡「 ⬆️ *ᴄʟᴀɴ ᴅɪ ᴀᴛᴀꜱ* 」\n`
        for (let i = 0; i < higherClans.length; i++) {
            const c = higherClans[i]
            const pos = i + 1
            txt += `┃ ${pos}. *${c.name}* (Level ${c.level || getLevelFromExp(c.exp || 0)})\n`
        }
        txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    }
    
    txt += `╭┈┈⬡「 🎯 *ᴄʟᴀɴ ᴋᴀᴍᴜ* 」\n`
    txt += `┃ 📛 *${clan.name}*\n`
    txt += `┃ 🏆 Level: *${level}*\n`
    txt += `┃ 👥 Member: *${clan.members?.length || 0}*\n`
    txt += `┃ 💰 Kas: *Rp ${(clan.bank || 0).toLocaleString('id-ID')}*\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    
    if (lowerClans.length > 0) {
        txt += `╭┈┈⬡「 ⬇️ *ᴄʟᴀɴ ᴅɪ ʙᴀᴡᴀʜ* 」\n`
        for (let i = 0; i < lowerClans.length; i++) {
            const c = lowerClans[i]
            const pos = rank + i + 1
            if (pos <= totalClans) {
                txt += `┃ ${pos}. *${c.name}* (Level ${c.level || getLevelFromExp(c.exp || 0)})\n`
            }
        }
        txt += `╰┈┈┈┈┈┈┈┈⬡`
    }
    
    await m.reply(txt)
}

export { pluginConfig as config, handler };
