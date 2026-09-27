/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'

const pluginConfig = {
    name: 'antiswgc',
    alias: ['antiswgroup', 'antiswmentiongc', 'antiswtaggc'],
    category: 'group',
    description: 'Deteksi tipe SW group mention atau status mention yang masuk ke grup',
    usage: '.antiswgc <on/off>',
    example: '.antiswgc on',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    isBotAdmin: true,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m, { db }) {
    const action = (m.args || [])[0]?.toLowerCase()
    const group = db.getGroup(m.chat) || {}

    if (!action) {
        const status = group.antiswgc || 'off'
        await m.reply(
            `📡 *ᴀɴᴛɪsᴡɢᴄ*\n\n` +
            `> Status: *${status === 'on' ? '✅ Aktif' : '❌ Nonaktif'}*\n\n` +
            `> Fitur ini mendeteksi tipe SW group mention seperti:\n` +
            `> • groupStatusMentionMessage\n` +
            `> • groupMentionedMessage\n` +
            `> • statusMentionMessage\n` +
            `> • contextInfo.groupMentions\n\n` +
            `> \`${m.prefix}antiswgc on\`\n` +
            `> \`${m.prefix}antiswgc off\``
        )
        return
    }

    if (action === 'on') {
        db.setGroup(m.chat, { ...group, antiswgc: 'on' })
        await m.reply('✅ *AntiSWGC aktif*\n\n> Tipe SW group mention akan dihapus otomatis.')
        return
    }

    if (action === 'off') {
        db.setGroup(m.chat, { ...group, antiswgc: 'off' })
        await m.reply('❌ *AntiSWGC nonaktif*')
        return
    }

    await m.reply('❌ Gunakan: on atau off')
}

export { pluginConfig as config, handler }
