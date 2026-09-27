/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import { isLid, lidToJid, resolveAnyLidToJid } from '../../src/lib/elaina-lid.js'

const pluginConfig = {
    name: 'mutemember',
    alias: ['mutmember', 'silentmember', 'bisukanmember'],
    category: 'group',
    description: 'Bisukan member tertentu (pesan akan dihapus bot)',
    usage: '.mutemember <@tag/reply/nomor>',
    example: '.mutemember @user',
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
    const targetJid = resolveTarget(m)

    if (!targetJid) {
        return m.reply(
            `🔇 *MUTE MEMBER*\n\n` +
            `> Bisukan member tertentu di grup ini\n` +
            `> Pesan member yang dimute akan dihapus oleh bot\n\n` +
            `\`Contoh:\`\n` +
            `> ${m.prefix}mutemember @user\n` +
            `> ${m.prefix}mutemember 6281234567890\n` +
            `> Reply pesan member + ${m.prefix}mutemember`
        )
    }

    const targetNumber = targetJid.replace(/@.+/g, '')

    if (m.isGroup) {
        const isTargetAdmin = m.groupMetadata?.participants?.some(p => {
            const pJid = (p.id || p.jid || '').replace(/@.+/g, '')
            return pJid === targetNumber && (p.admin === 'admin' || p.admin === 'superadmin')
        })
        if (isTargetAdmin) {
            return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Tidak dapat mute admin grup`)
        }
    }

    const db = getDatabase()
    const groupData = db.getGroup(m.chat) || {}
    const mutedMembers = groupData.mutedMembers || []

    const alreadyMuted = mutedMembers.some(jid => {
        const c = jid.replace(/@.+/g, '')
        return c === targetNumber || c.endsWith(targetNumber) || targetNumber.endsWith(c)
    })

    if (alreadyMuted) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Member @${targetNumber} sudah dimute`, { mentions: [targetJid] })
    }

    mutedMembers.push(targetJid)
    db.setGroup(m.chat, { ...groupData, mutedMembers })

    m.react('🔇')
    await m.reply(
        `🔇 *MEMBER DIMUTE*\n\n` +
        `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
        `┃ 👤 ᴍᴇᴍʙᴇʀ: @${targetNumber}\n` +
        `┃ 🔇 sᴛᴀᴛᴜs: \`Muted\`\n` +
        `┃ 📊 ᴛᴏᴛᴀʟ ᴍᴜᴛᴇ: \`${mutedMembers.length}\` ᴍᴇᴍʙᴇʀ\n` +
        `╰┈┈⬡\n\n` +
        `> Semua pesan dari member ini akan dihapus otomatis\n` +
        `> Gunakan \`${m.prefix}unmutemember\` untuk unmute`,
        { mentions: [targetJid] }
    )
}

function isMutedMember(groupJid, senderJid, db) {
    const groupData = db.getGroup(groupJid) || {}
    const mutedMembers = groupData.mutedMembers || []
    if (mutedMembers.length === 0) return false

    const senderNumber = senderJid.replace(/@.+/g, '')
    return mutedMembers.some(jid => {
        const c = jid.replace(/@.+/g, '')
        return c === senderNumber || c.endsWith(senderNumber) || senderNumber.endsWith(c)
    })
}

export { pluginConfig as config, handler, isMutedMember }
