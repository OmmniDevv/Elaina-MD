/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'clandemote',
    alias: ['demoteclan', 'removerole'],
    category: 'clan',
    description: 'Turunkan jabatan member',
    usage: '.clandemote @user',
    example: '.clandemote @user',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

async function handler(m, { mention }) {
    const db = getDatabase()
    const user = db.getUser(m.sender)
    const args = m.text?.trim().split(/\s+/)
    
    let target = mention?.[0] || (args[0] ? (args[0].includes('@') ? args[0] : null) : null)
    
    if (!target) {
        return m.reply(`📉 *ᴄʟᴀɴ ᴅᴇᴍᴏᴛᴇ*\n\n> Turunkan jabatan member ke member biasa\n\n> Contoh: .clandemote @user`)
    }
    
    target = target.replace('@', '').replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    
    if (!user.clanId) {
        return m.reply(`❌ Kamu belum punya clan!`)
    }
    
    const clan = db.db.data.clans[user.clanId]
    if (!clan) {
        return m.reply(`❌ Clan tidak ditemukan!`)
    }
    
    if (clan.leader !== m.sender) {
        return m.reply(`❌ Hanya *leader* clan yang bisa demote member!`)
    }
    
    if (!clan.members.includes(target)) {
        return m.reply(`❌ Target bukan member clan kamu!`)
    }
    
    if (target === m.sender) {
        return m.reply(`❌ Tidak bisa demote diri sendiri!`)
    }
    
    if (!clan.roles?.[target]) {
        return m.reply(`❌ Target tidak memiliki jabatan khusus!`)
    }
    
    const oldRole = clan.roles[target]
    delete clan.roles[target]
    await db.save()
    
    let txt = `📉 *ᴄʟᴀɴ ᴅᴇᴍᴏᴛᴇ!*\n\n`
    txt += `╭┈┈⬡「 📋 *ʜᴀꜱɪʟ* 」\n`
    txt += `┃ 📛 Clan: *${clan.name}*\n`
    txt += `┃ 👤 Member: @${target.split('@')[0]}\n`
    txt += `┃ 🔻 Jabatan lama: *${oldRole === 'coleader' ? 'Co-Leader' : 'Elder'}*\n`
    txt += `┃ 📌 Jabatan baru: *Member*\n`
    txt += `┃ 👑 Didemote oleh: @${m.sender.split('@')[0]}\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡`
    
    await m.reply(txt, { mentions: [target, m.sender] })
}

export { pluginConfig as config, handler };
