/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import * as levelHelper from '../../src/lib/elaina-level.js'
const pluginConfig = {
    name: 'addexp',
    alias: ['tambahexp', 'giveexp', 'addxp'],
    category: 'owner',
    description: 'Tambah exp user (max 9 Miliar)',
    usage: '.addexp <jumlah> @user',
    example: '.addexp 10000 @user',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

const MAX_EXP = 9000000000

function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B'
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K'
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
    let amount = parseInt(numArg) || 0
    
    let targetJid = await extractTarget(m)
    
    if (!targetJid && amount > 0) {
        targetJid = m.sender
    }
    
    if (!targetJid || amount <= 0) {
        return m.reply(
            `⭐ *ᴀᴅᴅ ᴇxᴘ*\n\n` +
            `> \`.addexp <jumlah>\` - ke diri sendiri\n` +
            `> \`.addexp <jumlah> @user\` - ke user\n` +
            `> Max: 9.000.000.000 (9B)\n\n` +
            `\`Contoh: ${m.prefix}addexp 10000\``
        )
    }
    
    if (amount <= 0) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Jumlah exp harus lebih dari 0`)
    }
    
    if (amount > MAX_EXP) {
        amount = MAX_EXP
    }
    
    const user = db.getUser(targetJid) || db.setUser(targetJid)
 
    await levelHelper.addExpWithLevelCheck(sock, m, db, user, amount)
    
    await m.react('✅')
    
    await m.reply(
        `✅ Berhasil menambahkan exp *${formatNumber(amount)}* ke *@${targetJid.split('@')[0]}*`,
        { mentions: [targetJid] }
    )
}

export { pluginConfig as config, handler }