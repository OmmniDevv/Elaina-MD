/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'clanrename',
    alias: ['renameclan', 'guildrename'],
    category: 'clan',
    description: 'Ganti nama clan',
    usage: '.clanrename <nama baru>',
    example: '.clanrename DarkPhoenix',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 0,
    isEnabled: true
}

const MAX_CLAN_NAME = 20
const RENAME_COST = 25000

async function handler(m) {
    const db = getDatabase()
    const user = db.getUser(m.sender)
    const newName = m.text?.trim()
    
    if (!newName) {
        return m.reply(`🏷️ *ᴄʟᴀɴ ʀᴇɴᴀᴍᴇ*\n\n> Masukkan nama clan baru!\n> Biaya: *Rp ${RENAME_COST.toLocaleString('id-ID')}*\n\n> Contoh: .clanrename DarkPhoenix`)
    }
    
    if (newName.length > MAX_CLAN_NAME) {
        return m.reply(`❌ Nama clan maksimal ${MAX_CLAN_NAME} karakter!`)
    }
    
    if (!/^[a-zA-Z0-9\s]+$/.test(newName)) {
        return m.reply(`❌ Nama clan hanya boleh huruf, angka, dan spasi!`)
    }
    
    if (!user.clanId) {
        return m.reply(`❌ Kamu belum punya clan!\n> Buat clan dengan *.clancreate*`)
    }
    
    const clan = db.db.data.clans[user.clanId]
    if (!clan) {
        return m.reply(`❌ Clan tidak ditemukan!`)
    }
    
    if (clan.leader !== m.sender) {
        return m.reply(`❌ Hanya *leader* clan yang bisa rename clan!`)
    }
    
    const existingClan = Object.values(db.db.data.clans).find(c => c.name.toLowerCase() === newName.toLowerCase())
    if (existingClan && existingClan.id !== clan.id) {
        return m.reply(`❌ Nama clan *${newName}* sudah digunakan!`)
    }
    
    if ((user.koin || 0) < RENAME_COST) {
        return m.reply(`❌ Balance tidak cukup!\n\n> Dibutuhkan: *Rp ${RENAME_COST.toLocaleString('id-ID')}*\n> Kamu punya: *Rp ${(user.koin || 0).toLocaleString('id-ID')}*`)
    }
    
    const oldName = clan.name
    clan.name = newName
    db.updateKoin(m.sender, -RENAME_COST)
    await db.save()
    
    let txt = `🏷️ *ᴄʟᴀɴ ʀᴇɴᴀᴍᴇᴅ!*\n\n`
    txt += `╭┈┈⬡「 📋 *ʀᴇꜱᴜʟᴛ* 」\n`
    txt += `┃ 📛 Nama lama: *${oldName}*\n`
    txt += `┃ ✨ Nama baru: *${newName}*\n`
    txt += `┃ 👑 Leader: @${m.sender.split('@')[0]}\n`
    txt += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    txt += `> -Rp ${RENAME_COST.toLocaleString('id-ID')}`
    
    await m.reply(txt, { mentions: [m.sender] })
}

export { pluginConfig as config, handler };
