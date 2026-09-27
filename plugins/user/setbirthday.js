/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import config from '../../config.js'
const pluginConfig = {
    name: 'setbirthday',
    alias: ['setbday', 'setultah', 'settgl'],
    category: 'user',
    description: 'Set tanggal ulang tahun',
    usage: '.setbirthday <DD-MM>',
    example: '.setbirthday 25-12',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

async function handler(m) {
    const db = getDatabase()
    const input = m.args?.[0]?.trim()
    const userJid = m.sender
    const cleanJid = userJid.replace(/@.+/g, '')
    
    if (!input) {
        const user = db.getUser(userJid)
        const currentBday = user?.birthday
        
        let text = `🎂 *sᴇᴛ ʙɪʀᴛʜᴅᴀʏ*\n\n`
        
        if (currentBday) {
            text += `> Birthday kamu: *${currentBday}*\n\n`
        }
        
        text += `╭┈┈⬡「 📋 *ғᴏʀᴍᴀᴛ* 」\n`
        text += `┃ ${m.prefix}setbirthday DD-MM\n`
        text += `╰┈┈┈┈┈┈┈┈⬡\n\n`
        text += `*Contoh:*\n`
        text += `> ${m.prefix}setbirthday 25-12\n`
        text += `> ${m.prefix}setbirthday 01-01`
        
        return m.reply(text)
    }
    
    const dateRegex = /^(\d{1,2})[-\/](\d{1,2})$/
    const match = input.match(dateRegex)
    
    if (!match) {
        return m.reply(`❌ Format salah! Gunakan: DD-MM\n\n> Contoh: ${m.prefix}setbirthday 25-12`)
    }
    
    const day = parseInt(match[1])
    const month = parseInt(match[2])
    
    if (month < 1 || month > 12) {
        return m.reply(`❌ Bulan tidak valid! (1-12)`)
    }
    
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (day < 1 || day > daysInMonth[month - 1]) {
        return m.reply(`❌ Tanggal tidak valid untuk bulan ${month}!`)
    }
    
    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}`
    
    db.setUser(m.sender, { 
        birthday: formattedDate 
    })
    
    await db.save()
    
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    
    await m.reply(
        `✅ *ʙɪʀᴛʜᴅᴀʏ ᴅɪsɪᴍᴘᴀɴ!*\n\n` +
        `╭┈┈⬡「 🎂 *ᴅᴇᴛᴀɪʟ* 」\n` +
        `┃ 📅 Tanggal: *${day} ${months[month - 1]}*\n` +
        `┃ 👤 User: @${cleanJid}\n` +
        `╰┈┈┈┈┈┈┈┈⬡\n\n` +
        `> Bot akan mengucapkan selamat\n` +
        `> ulang tahun di hari spesialmu! 🎉`,
        { mentions: [userJid] }
    )
}

export { pluginConfig as config, handler }