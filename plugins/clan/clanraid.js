/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'clanraid',
    alias: ['raid', 'clanevent'],
    category: 'clan',
    description: 'Mulai raid event clan',
    usage: '.clanraid',
    example: '.clanraid',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3600,
    energi: 10,
    isEnabled: true
}

const RAID_TYPES = {
    'goblin': { name: '👺 Goblin Invasion', duration: 30, reward: 5000, xp: 1000, targetKills: 50 },
    'skeleton': { name: '💀 Skeleton Army', duration: 45, reward: 10000, xp: 2000, targetKills: 100 },
    'demon': { name: '👹 Demon Horde', duration: 60, reward: 20000, xp: 4000, targetKills: 200 },
    'dragon': { name: '🐉 Dragon Flight', duration: 90, reward: 50000, xp: 10000, targetKills: 500 }
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
        return m.reply(`❌ Hanya *Leader* atau *Co-Leader* yang bisa memulai raid!`)
    }
    
    if (clan.raid && clan.raid.active) {
        return m.reply(`⚠️ Raid sedang berlangsung!\n> Ketik *.clanraid* untuk join raid.`)
    }
    
    const clanLevel = clan.level || 1
    let availableRaids = Object.entries(RAID_TYPES)
    if (clanLevel < 5) availableRaids = availableRaids.filter(r => r[0] !== 'dragon')
    if (clanLevel < 3) availableRaids = availableRaids.filter(r => r[0] !== 'demon')
    
    const selectedRaid = availableRaids[Math.floor(Math.random() * availableRaids.length)][1]
    
    clan.raid = {
        active: true,
        type: selectedRaid.name,
        kills: 0,
        targetKills: selectedRaid.targetKills,
        startTime: Date.now(),
        endTime: Date.now() + (selectedRaid.duration * 1000),
        reward: selectedRaid.reward,
        xp: selectedRaid.xp,
        participants: [],
        contributions: {}
    }
    
    await db.save()
    
    let txt = `⚔️ *ᴄʟᴀɴ ʀᴀɪᴅ ꜱᴛᴀʀᴛᴇᴅ!*\n\n`
    txt += `╭┈┈⬡「 🎯 *ʀᴀɪᴅ ɪɴꜰᴏ* 」\n`
    txt += `┃ 🏷️ Type: *${selectedRaid.name}*\n`
    txt += `┃ ⏱️ Duration: *${selectedRaid.duration} menit*\n`
    txt += `┃ 🎯 Target kills: *${selectedRaid.targetKills}*\n`
    txt += `┃ 💰 Reward: *Rp ${selectedRaid.reward.toLocaleString('id-ID')}*\n`
    txt += `┃ 📈 XP: *+${selectedRaid.xp}*\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    txt += `> Ketik *.clanraid* untuk join dan kill monster!`
    
    await m.reply(txt)
}

export { pluginConfig as config, handler };
