/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: ['unblock', 'unblocknomor'],
    alias: [],
    category: 'owner',
    description: 'Buka blokir nomor WhatsApp',
    usage: '.unblock <nomor/reply/mention>',
    example: '.unblock 628xxx',
    isOwner: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    let targetJid = null

    if (m.mentionedJid?.length > 0) {
        targetJid = m.mentionedJid[0]
    } else if (m.quoted) {
        targetJid = m.quoted.sender || m.quoted.participant
    } else if (m.args[0]) {
        let num = m.args[0].replace(/[^0-9]/g, '')
        if (!num) return m.reply('❌ Nomor tidak valid.')
        targetJid = num + '@s.whatsapp.net'
    } else if (!m.isGroup) {
        targetJid = m.chat
    }

    if (!targetJid) {
        return m.reply(
            '⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n' +
            '> `.unblock 628xxx` — Unblock via nomor\n' +
            '> `.unblock` (reply pesan) — Unblock pengirim\n' +
            '> `.unblock @mention` — Unblock yang di-mention\n' +
            '> `.unblock` (di private chat) — Unblock user ini'
        )
    }

    try {
        await sock.updateBlockStatus(targetJid, 'unblock')
        await m.react('✅')
        return m.reply(
            `✅ *ɴᴏᴍᴏʀ ᴅɪ-ᴜɴʙʟᴏᴄᴋ*\n\n` +
            `> Target: @${targetJid.split('@')[0]}`,
            { mentions: [targetJid] }
        )
    } catch (err) {
        return m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }