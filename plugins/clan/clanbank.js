/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'clanbank',
    alias: ['kasclan', 'clanbalance'],
    category: 'clan',
    description: 'Cek saldo kas clan',
    usage: '.clanbank',
    example: '.clanbank',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
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
    
    const totalDonations = clan.bank || 0
    const topDonors = Object.entries(clan.donations || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    
    let txt = `🏦 *ᴋᴀꜱ ᴄʟᴀɴ*\n\n`
    txt += `╭┈┈⬡「 📊 *ɪɴꜰᴏ* 」\n`
    txt += `┃ 📛 Clan: *${clan.name}*\n`
    txt += `┃ 💰 Total kas: *Rp ${totalDonations.toLocaleString('id-ID')}*\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    
    if (topDonors.length > 0) {
        txt += `╭┈┈⬡「 🎖️ *ᴛᴏᴘ ᴅᴏɴᴀᴛᴏʀ* 」\n`
        for (let i = 0; i < topDonors.length; i++) {
            const [donorId, amount] = topDonors[i]
            const donorData = db.getUser(donorId)
            const name = donorData?.name || donorId.split('@')[0]
            const medal = i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📌'
            txt += `┃ ${medal} ${i+1}. *${name}*\n`
            txt += `┃    └ Rp ${amount.toLocaleString('id-ID')}\n`
        }
        txt += `╰┈┈┈┈┈┈┈┈⬡`
    }
    
    await m.reply(txt)
}

export { pluginConfig as config, handler };
