/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js'
import { getDatabase } from '../../src/lib/elaina-database.js'
import { isLid, lidToJid, resolveAnyLidToJid } from '../../src/lib/elaina-lid.js'

const pluginConfig = {
    name: 'ban',
    alias: ['addban', 'block'],
    category: 'owner',
    description: 'Memblokir user dari menggunakan bot',
    usage: '.ban <nomor/@tag>',
    example: '.ban 6281234567890',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

function resolveTarget(m) {
    let raw = ''

    if (m.quoted) {
        raw = m.quoted.sender || ''
    } else if (m.mentionedJid?.length) {
        raw = m.mentionedJid[0] || ''
    } else if (m.args[0]) {
        raw = m.args[0]
    }

    if (!raw) return ''

    if (isLid(raw)) raw = lidToJid(raw)
    let num = raw.replace(/[^0-9]/g, '')
    if (num.startsWith('08')) num = '62' + num.slice(1)
    if (num.startsWith('0')) num = '62' + num.slice(1)

    return num
}

async function handler(m, { sock }) {
    const targetNumber = resolveTarget(m)

    if (!targetNumber || targetNumber.length < 10 || targetNumber.length > 15) {
        return m.reply(
            `🚫 *ʙᴀɴ ᴜsᴇʀ*\n\n` +
            `> Masukkan nomor atau tag user\n\n` +
            `\`Contoh: ${m.prefix}ban 6281234567890\``
        )
    }

    if (config.isOwner(targetNumber)) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Tidak dapat ban owner`)
    }

    const db = getDatabase()
    const bannedList = db.setting('bannedUsers') || []

    const alreadyBanned = bannedList.some(b => {
        const c = String(b).replace(/[^0-9]/g, '')
        return c === targetNumber || c.endsWith(targetNumber) || targetNumber.endsWith(c)
    })

    if (alreadyBanned) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Nomor \`${targetNumber}\` sudah dibanned`)
    }

    bannedList.push(targetNumber)
    db.setting('bannedUsers', bannedList)
    config.bannedUsers = bannedList

    await m.react('🚫')

    await m.reply(
        `🚫 *ᴜsᴇʀ ᴅɪʙᴀɴɴᴇᴅ*\n\n` +
        `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
        `┃ 📱 ɴᴏᴍᴏʀ: \`${targetNumber}\`\n` +
        `┃ 🚫 sᴛᴀᴛᴜs: \`Banned\`\n` +
        `┃ 📊 ᴛᴏᴛᴀʟ: \`${bannedList.length}\` ᴜsᴇʀ\n` +
        `╰┈┈⬡`
    )
}

export { pluginConfig as config, handler }