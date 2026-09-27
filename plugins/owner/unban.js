/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js'
import { getDatabase } from '../../src/lib/elaina-database.js'
import { isLid, lidToJid } from '../../src/lib/elaina-lid.js'

const pluginConfig = {
    name: 'unban',
    alias: ['delban', 'unblock'],
    category: 'owner',
    description: 'Menghapus user dari daftar banned',
    usage: '.unban <nomor/@tag>',
    example: '.unban 6281234567890',
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
            `✅ *ᴜɴʙᴀɴ ᴜsᴇʀ*\n\n` +
            `> Masukkan nomor atau tag user\n\n` +
            `\`Contoh: ${m.prefix}unban 6281234567890\``
        )
    }

    const db = getDatabase()
    const bannedList = db.setting('bannedUsers') || []

    const index = bannedList.findIndex(b => {
        const c = String(b).replace(/[^0-9]/g, '')
        return c === targetNumber || c.endsWith(targetNumber) || targetNumber.endsWith(c)
    })

    if (index === -1) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Nomor \`${targetNumber}\` tidak dalam daftar banned`)
    }

    bannedList.splice(index, 1)
    db.setting('bannedUsers', bannedList)
    config.bannedUsers = bannedList

    await m.react('✅')

    await m.reply(
        `✅ *ᴜsᴇʀ ᴅɪᴜɴʙᴀɴ*\n\n` +
        `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
        `┃ 📱 ɴᴏᴍᴏʀ: \`${targetNumber}\`\n` +
        `┃ ✅ sᴛᴀᴛᴜs: \`Unbanned\`\n` +
        `┃ 📊 ᴛᴏᴛᴀʟ: \`${bannedList.length}\` ᴜsᴇʀ\n` +
        `╰┈┈⬡`
    )
}

export { pluginConfig as config, handler }