/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'clanlevel',
    alias: ['levelclan', 'clanlvl'],
    category: 'clan',
    description: 'Lihat level clan',
    usage: '.clanlevel',
    example: '.clanlevel',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

function getLevelInfo(exp) {
    const level = Math.floor(Math.sqrt(exp / 100)) + 1
    const currentLevelExp = 100 * Math.pow(level - 1, 2)
    const nextLevelExp = 100 * Math.pow(level, 2)
    const expToNext = nextLevelExp - exp
    
    return { level, currentLevelExp, nextLevelExp, expToNext }
}

function getLevelBadge(level) {
    if (level >= 50) return '👑'
    if (level >= 40) return '💎'
    if (level >= 30) return '⭐'
    if (level >= 20) return '🌟'
    if (level >= 10) return '✨'
    if (level >= 5) return '💫'
    return '🌱'
}

async function handler(m) {
    const db = getDatabase()
    const user = db.getUser(m.sender)
    const args = m.text?.trim().split(/\s+/)
    
    let targetClan = null
    let targetId = null
    
    if (args[0]) {
        const clanName = args.join(' ')
        targetClan = Object.values(db.db.data.clans).find(c => c.name.toLowerCase() === clanName.toLowerCase())
        if (targetClan) targetId = targetClan.id
    }
    
    if (!targetId && user.clanId) {
        targetId = user.clanId
        targetClan = db.db.data.clans[targetId]
    }
    
    if (!targetClan) {
        return m.reply(`❌ Kamu belum punya clan atau clan tidak ditemukan!\n> Buat clan dengan *.clancreate*`)
    }
    
    const exp = targetClan.exp || 0
    const { level, expToNext, nextLevelExp } = getLevelInfo(exp)
    const badge = getLevelBadge(level)
    const progressPercent = (exp / nextLevelExp) * 100
    const progressBar = '█'.repeat(Math.floor(progressPercent / 10)) + '░'.repeat(10 - Math.floor(progressPercent / 10))
    
    let txt = `${badge} *ᴄʟᴀɴ ʟᴇᴠᴇʟ*\n\n`
    txt += `╭┈┈⬡「 📊 *ꜱᴛᴀᴛꜱ* 」\n`
    txt += `┃ 📛 Nama: *${targetClan.name}*\n`
    txt += `┃ 🏆 Level: *${level}* ${badge}\n`
    txt += `┃ 📈 XP: *${exp.toLocaleString('id-ID')}* / ${nextLevelExp.toLocaleString('id-ID')}\n`
    txt += `┃ 📊 Progress: [${progressBar}] ${progressPercent.toFixed(1)}%\n`
    txt += `┃ 🎯 Sisa XP ke level ${level + 1}: *${expToNext.toLocaleString('id-ID')}*\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡`
    
    await m.reply(txt)
}

export { pluginConfig as config, handler };
