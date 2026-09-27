/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'clancheckin',
    alias: ['checkin', 'dailyclan'],
    category: 'clan',
    description: 'Checkin harian untuk dapet XP clan',
    usage: '.clancheckin',
    example: '.clancheckin',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 86400,
    energi: 0,
    isEnabled: true
}

const BASE_XP = 100
const STREAK_BONUS = 25

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
    
    const today = new Date().toDateString()
    if (!clan.checkins) clan.checkins = {}
    if (!clan.memberXP) clan.memberXP = {}
    
    if (clan.checkins[m.sender] === today) {
        return m.reply(`✅ Kamu sudah checkin hari ini!\n> Kembali besok untuk dapat XP lagi!`)
    }
    
    let streak = clan.checkinStreak?.[m.sender] || 0
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const lastCheckin = clan.lastCheckin?.[m.sender]
    
    if (lastCheckin === yesterday.toDateString()) {
        streak++
    } else {
        streak = 1
    }
    
    const bonusXP = streak * STREAK_BONUS
    const totalXP = BASE_XP + bonusXP
    
    if (!clan.checkinStreak) clan.checkinStreak = {}
    if (!clan.lastCheckin) clan.lastCheckin = {}
    
    clan.checkins[m.sender] = today
    clan.checkinStreak[m.sender] = streak
    clan.lastCheckin[m.sender] = today
    clan.exp = (clan.exp || 0) + totalXP
    clan.memberXP[m.sender] = (clan.memberXP[m.sender] || 0) + totalXP
    
    await db.save()
    
    let txt = `✅ *ᴄʟᴀɴ ᴄʜᴇᴄᴋɪɴ!*\n\n`
    txt += `╭┈┈⬡「 📋 *ʜᴀꜱɪʟ* 」\n`
    txt += `┃ 📛 Clan: *${clan.name}*\n`
    txt += `┃ 👤 Member: @${m.sender.split('@')[0]}\n`
    txt += `┃ 🔥 Streak: *${streak} hari*\n`
    txt += `┃ 🎁 XP didapat: *+${totalXP}*\n`
    txt += `┃   └ Base: ${BASE_XP} + Bonus: ${bonusXP}\n`
    txt += `┃ 📈 Total XP clan: *${(clan.exp || 0).toLocaleString('id-ID')}*\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡`
    
    await m.reply(txt, { mentions: [m.sender] })
}

export { pluginConfig as config, handler };
