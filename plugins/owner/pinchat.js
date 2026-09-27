/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: ['pinchat', 'pin'],
    alias: [],
    category: 'owner',
    description: 'Pin/unpin chat',
    usage: '.pinchat <nomor/reply> atau .pinchat buka <nomor>',
    example: '.pinchat 628xxx',
    isOwner: true,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const action = m.args[0]?.toLowerCase()
    let targetJid = null
    let pin = true

    if (action === 'buka' || action === 'unpin') {
        pin = false
        const num = (m.args[1] || '').replace(/[^0-9]/g, '')
        if (num) targetJid = num + '@s.whatsapp.net'
        else if (m.quoted) targetJid = m.quoted.sender || m.quoted.participant
        else if (!m.isGroup) targetJid = m.chat
    } else {
        if (m.mentionedJid?.length > 0) {
            targetJid = m.mentionedJid[0]
        } else if (m.quoted) {
            targetJid = m.quoted.sender || m.quoted.participant
        } else if (m.args[0]) {
            const num = m.args[0].replace(/[^0-9]/g, '')
            if (num) targetJid = num + '@s.whatsapp.net'
        } else if (!m.isGroup) {
            targetJid = m.chat
        }
    }

    if (!targetJid) {
        return m.reply(
            '📌 *ᴘɪɴ ᴄʜᴀᴛ*\n\n' +
            '> `.pinchat 628xxx` — Pin chat\n' +
            '> `.pinchat` (di private chat) — Pin chat ini\n' +
            '> `.pinchat buka 628xxx` — Unpin chat'
        )
    }

    try {
        await sock.chatModify({ pin }, targetJid)
        await m.react('✅')
        const target = targetJid.split('@')[0]
        return m.reply(
            pin
                ? `📌 *ᴄʜᴀᴛ ᴅɪᴘɪɴ*\n\n> Target: ${target}`
                : `📍 *ᴘɪɴ ᴅɪʜᴀᴘᴜs*\n\n> Target: ${target}`
        )
    } catch (err) {
        return m.reply(`❌ Gagal: ${err.message}`)
    }
}

export { pluginConfig as config, handler }
