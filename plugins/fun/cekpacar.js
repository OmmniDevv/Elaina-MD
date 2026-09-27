/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'cekpacar',
    alias: ['pacar', 'pasangan', 'gebetan'],
    category: 'fun',
    description: 'Cek status hubungan seseorang',
    usage: '.cekpacar atau .cekpacar @tag',
    example: '.cekpacar',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const args = m.args || []
    let targetJid = m.sender
    let isOther = false
    if (m.quoted) {
        targetJid = m.quoted.sender
        isOther = true
    } else if (m.mentionedJid?.[0]) {
        targetJid = m.mentionedJid[0]
        isOther = true
    } else if (args[0]) {
        let num = args[0].replace(/[^0-9]/g, '')
        if (num.length > 5 && num.length < 20) {
            targetJid = num + '@s.whatsapp.net'
            isOther = true
        }
    }
    
    const userData = db.getUser(targetJid) || {}
    
    if (!userData.fun?.pasangan) {
        const nama = isOther ? `@${targetJid.split('@')[0]}` : 'Kamu'
        await m.react('💔')
        return m.reply(
            `💔 *sᴛᴀᴛᴜs ʜᴜʙᴜɴɢᴀɴ*\n\n` +
            `*${nama}* tidak punya pasangan.\n` +
            `TIP: Cari pasangan dulu dengan \`${m.prefix}tembak @tag\``,
            { mentions: isOther ? [targetJid] : [] }
        )
    }
    
    const partnerJid = userData.fun.pasangan
    const partnerData = db.getUser(partnerJid) || {}
    const isMutual = partnerData.fun?.pasangan === targetJid
    const nama = isOther ? `@${targetJid.split('@')[0]}` : 'Kamu'
    if (isMutual) {
        await m.react('💕')
        await m.reply(
            `💕 *sᴛᴀᴛᴜs ʜᴜʙᴜɴɢᴀɴ*\n\n` +
            `*${nama}* sedang pacaran dengan @${partnerJid.split('@')[0]}! 🥳`,
            { mentions: [targetJid, partnerJid] }
        )
    } else {
        await m.react('💭')
        await m.reply(
            `💭 *sᴛᴀᴛᴜs ʜᴜʙᴜɴɢᴀɴ*\n\n` +
            `*${nama}* lagi pdkt sama @${partnerJid.split('@')[0]}\n` +
            `Status: *Digantung* 😅\n\n` +
            `Menunggu jawaban...`,
            { mentions: [targetJid, partnerJid] }
        )
    }
}

export { pluginConfig as config, handler }