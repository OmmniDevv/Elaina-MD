/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'clanupgrade',
    alias: ['upgradeclan', 'levelupclan'],
    category: 'clan',
    description: 'Upgrade level clan menggunakan kas clan',
    usage: '.clanupgrade',
    example: '.clanupgrade',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 60,
    energi: 0,
    isEnabled: true
}

function getUpgradeCost(currentLevel) {
    return 50000 * Math.pow(currentLevel, 1.5)
}

function getLevelBenefits(level) {
    const benefits = {
        maxMembers: Math.min(10 + Math.floor(level / 2), 50),
        dailyBonus: 50 + (level * 10),
        warBonus: 5 + Math.floor(level / 2)
    }
    return benefits
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
    
    if (clan.leader !== m.sender && clan.roles?.[m.sender] !== 'coleader') {
        return m.reply(`❌ Hanya *Leader* atau *Co-Leader* yang bisa upgrade clan!`)
    }
    
    const currentLevel = clan.level || 1
    const cost = getUpgradeCost(currentLevel)
    const currentBenefits = getLevelBenefits(currentLevel)
    const nextBenefits = getLevelBenefits(currentLevel + 1)
    
    if ((clan.bank || 0) < cost) {
        return m.reply(`❌ Kas clan tidak cukup!\n\n> Dibutuhkan: *Rp ${cost.toLocaleString('id-ID')}*\n> Kas clan: *Rp ${(clan.bank || 0).toLocaleString('id-ID')}*\n> Kekurangan: *Rp ${(cost - (clan.bank || 0)).toLocaleString('id-ID')}*`)
    }
    
    clan.bank -= cost
    clan.level = currentLevel + 1
    await db.save()
    
    let txt = `⬆️ *ᴄʟᴀɴ ᴜᴘɢʀᴀᴅᴇᴅ!*\n\n`
    txt += `╭┈┈⬡「 📊 *ʜᴀꜱɪʟ ᴜᴘɢʀᴀᴅᴇ* 」\n`
    txt += `┃ 📛 Clan: *${clan.name}*\n`
    txt += `┃ 🏆 Level: *${currentLevel}* → *${clan.level}*\n`
    txt += `┃ 💰 Biaya: *-Rp ${cost.toLocaleString('id-ID')}*\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    txt += `╭┈┈⬡「 ✨ *ʙᴇɴᴇꜰɪᴛ ʙᴀʀᴜ* 」\n`
    txt += `┃ 👥 Max member: ${currentBenefits.maxMembers} → ${nextBenefits.maxMembers}\n`
    txt += `┃ 🎁 Daily bonus: +${currentBenefits.dailyBonus} → +${nextBenefits.dailyBonus} XP\n`
    txt += `┃ ⚔️ War bonus: ${currentBenefits.warBonus}% → ${nextBenefits.warBonus}%\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡`
    
    await m.reply(txt)
}

export { pluginConfig as config, handler };
