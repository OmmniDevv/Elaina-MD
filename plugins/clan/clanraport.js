/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'clanreport',
    alias: ['reportclan', 'laporanclan', 'aktivitasclan'],
    category: 'clan',
    description: 'Lihat laporan aktivitas clan',
    usage: '.clanreport',
    example: '.clanreport',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
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
    
    const level = clan.level || getLevelFromExp(clan.exp || 0)
    const totalDonations = clan.bank || 0
    const donors = Object.keys(clan.donations || {}).length
    const totalXP = clan.exp || 0
    
    const memberCount = clan.members?.length || 0
    const onlineMembers = clan.members?.filter(member => {
        const userData = db.getUser(member)
        return userData?.online || false
    }).length || 0
    
    const activity = clan.chatHistory || []
    const last24h = activity.filter(msg => msg.time > Date.now() - (24 * 60 * 60 * 1000)).length
    const last7d = activity.filter(msg => msg.time > Date.now() - (7 * 24 * 60 * 60 * 1000)).length
    
    const topDonorsList = Object.entries(clan.donations || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
    
    const warHistory = db.db.data.warHistory?.filter(war => 
        war.attacker === clan.id || war.defender === clan.id
    ) || []
    
    const wins = warHistory.filter(war => {
        const isAttacker = war.attacker === clan.id
        return (isAttacker && war.attackerScore > war.defenderScore) || 
               (!isAttacker && war.defenderScore > war.attackerScore)
    }).length
    
    const totalWars = warHistory.length
    const winRate = totalWars > 0 ? Math.floor((wins / totalWars) * 100) : 0
    
    let txt = `📊 *ʟᴀᴘᴏʀᴀɴ ᴀᴋᴛɪᴠɪᴛᴀꜱ ᴄʟᴀɴ*\n\n`
    txt += `╭┈┈⬡「 🏰 *ɪɴꜰᴏ ᴜᴍᴜᴍ* 」\n`
    txt += `┃ 📛 Nama: *${clan.name}*\n`
    txt += `┃ 🏆 Level: *${level}*\n`
    txt += `┃ 📈 Total XP: *${totalXP.toLocaleString('id-ID')}*\n`
    txt += `┃ 👥 Member: *${memberCount}* (${onlineMembers} online)\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    
    txt += `╭┈┈⬡「 💰 *ᴇᴋᴏɴᴏᴍɪ* 」\n`
    txt += `┃ 💵 Total kas: *Rp ${totalDonations.toLocaleString('id-ID')}*\n`
    txt += `┃ 👤 Total donatur: *${donors} orang*\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    
    if (topDonorsList.length > 0) {
        txt += `╭┈┈⬡「 🎖️ *ᴛᴏᴘ ᴅᴏɴᴀᴛᴏʀ* 」\n`
        for (let i = 0; i < topDonorsList.length; i++) {
            const [donorId, amount] = topDonorsList[i]
            const donorData = db.getUser(donorId)
            const name = donorData?.name || donorId.split('@')[0]
            const medal = i === 0 ? '🏆' : i === 1 ? '🥈' : '🥉'
            txt += `┃ ${medal} ${name}: Rp ${amount.toLocaleString('id-ID')}\n`
        }
        txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    }
    
    txt += `╭┈┈⬡「 💬 *ᴀᴋᴛɪᴠɪᴛᴀꜱ* 」\n`
    txt += `┃ 📱 Chat 24 jam: *${last24h} pesan*\n`
    txt += `┃ 📱 Chat 7 hari: *${last7d} pesan*\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    
    txt += `╭┈┈⬡「 ⚔️ *ᴡᴀʀ ꜱᴛᴀᴛꜱ* 」\n`
    txt += `┃ 🏆 Menang: *${wins}*\n`
    txt += `┃ 📉 Kalah: *${totalWars - wins}*\n`
    txt += `┃ 📈 Win rate: *${winRate}%*\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡`
    
    await m.reply(txt)
}

export { pluginConfig as config, handler };
