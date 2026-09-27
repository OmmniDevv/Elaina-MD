/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'delenergi',
    alias: ['kurangenergi', 'removeenergi', 'hapusenergi', 'delenergy'],
    category: 'owner',
    description: 'Kurangi energi user',
    usage: '.delenergi <jumlah> @user',
    example: '.delenergi 50 @user',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

function formatNumber(num) {
    if (num === -1) return '∞ Unlimited'
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function extractTarget(m) {
    if (m.quoted) return m.quoted.sender
    if (m.mentionedJid?.length) return m.mentionedJid[0]
    return null
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const args = m.args
    
    const numArg = args.find(a => !isNaN(a) && !a.startsWith('@'))
    const amount = parseInt(numArg) || 0
    
    let targetJid = await extractTarget(m)
    
    if (!targetJid && amount > 0) {
        targetJid = m.sender
    }
    
    if (!targetJid || amount <= 0) {
        return m.reply(
            `⚡ *ᴅᴇʟ ᴇɴᴇʀɢɪ*\n\n` +
            `> \`.delenergi <jumlah>\` - dari diri sendiri\n` +
            `> \`.delenergi <jumlah> @user\` - dari user\n\n` +
            `\`Contoh: ${m.prefix}delenergi 50\``
        )
    }
    
    if (amount <= 0) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Jumlah harus lebih dari 0`)
    }
    
    const user = db.getUser(targetJid)
    
    if (!user) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> User tidak ditemukan di database`)
    }
    
    if (user.energi === -1) {
        db.setUser(targetJid, { energi: 25 })
    }
    
    const newEnergi = db.updateEnergi(targetJid, -amount)
    
    await m.react('✅')
    
    await m.reply(
        `✅ *ᴇɴᴇʀɢɪ ᴅɪᴋᴜʀᴀɴɢɪ*\n\n` +
        `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
        `┃ 👤 ᴜsᴇʀ: @${targetJid.split('@')[0]}\n` +
        `┃ ➖ ᴋᴜʀᴀɴɢ: *-${formatNumber(amount)}*\n` +
        `┃ ⚡ sɪsᴀ: *${formatNumber(newEnergi)}*\n` +
        `╰┈┈⬡`,
        { mentions: [targetJid] }
    )
}

export { pluginConfig as config, handler }