/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import { isLid, lidToJid } from '../../src/lib/elaina-lid.js'

const pluginConfig = {
    name: 'unmutemember',
    alias: ['unmutmember', 'unsilentmember', 'unbisukanmember', 'listmutemember', 'listmute'],
    category: 'group',
    description: 'Membuka mute member tertentu',
    usage: '.unmutemember <@tag/reply/nomor>',
    example: '.unmutemember @user',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    isBotAdmin: true,
    cooldown: 5,
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
    if (!raw.includes('@')) raw = raw.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

    return raw
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const groupData = db.getGroup(m.chat) || {}
    const mutedMembers = groupData.mutedMembers || []

    if (m.command === 'listmutemember' || m.command === 'listmute') {
        if (mutedMembers.length === 0) {
            return m.reply(`🔇 *LIST MUTED MEMBERS*\n\n> Tidak ada member yang dimute di grup ini`)
        }

        let txt = `🔇 *LIST MUTED MEMBERS*\n\n╭┈┈⬡「 📋 *ᴅᴀꜰᴛᴀʀ* 」\n`
        mutedMembers.forEach((jid, i) => {
            const num = jid.replace(/@.+/g, '')
            txt += `┃ ${i + 1}. @${num}\n`
        })
        txt += `╰┈┈⬡\n\n> Total: \`${mutedMembers.length}\` member dimute`

        return m.reply(txt, { mentions: mutedMembers })
    }

    const targetJid = resolveTarget(m)

    if (!targetJid) {
        return m.reply(
            `🔊 *UNMUTE MEMBER*\n\n` +
            `> Membuka mute member tertentu\n\n` +
            `\`Contoh:\`\n` +
            `> ${m.prefix}unmutemember @user\n` +
            `> ${m.prefix}unmutemember 6281234567890\n` +
            `> Reply pesan member + ${m.prefix}unmutemember`
        )
    }

    const targetNumber = targetJid.replace(/@.+/g, '')

    const index = mutedMembers.findIndex(jid => {
        const c = jid.replace(/@.+/g, '')
        return c === targetNumber || c.endsWith(targetNumber) || targetNumber.endsWith(c)
    })

    if (index === -1) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Member @${targetNumber} tidak sedang dimute`, { mentions: [targetJid] })
    }

    mutedMembers.splice(index, 1)
    db.setGroup(m.chat, { ...groupData, mutedMembers })

    m.react('🔊')
    await m.reply(
        `🔊 *MEMBER DIUNMUTE*\n\n` +
        `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
        `┃ 👤 ᴍᴇᴍʙᴇʀ: @${targetNumber}\n` +
        `┃ 🔊 sᴛᴀᴛᴜs: \`Unmuted\`\n` +
        `┃ 📊 sɪsᴀ ᴍᴜᴛᴇ: \`${mutedMembers.length}\` ᴍᴇᴍʙᴇʀ\n` +
        `╰┈┈⬡`,
        { mentions: [targetJid] }
    )
}

export { pluginConfig as config, handler }
