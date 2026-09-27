/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'

const pluginConfig = {
    name: 'antiflood',
    alias: ['floodguard', 'noflood'],
    category: 'group',
    description: 'Deteksi banjir pesan cepat dan kick bertahap',
    usage: '.antiflood <on/off/status>',
    example: '.antiflood on',
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

const tracker = new Map()
const WINDOW_MS = 5000
const MESSAGE_LIMIT = 5
const WARNING_LIMIT = 3

function stateFor(chat, sender) {
    const key = `${chat}:${sender}`
    const now = Date.now()
    let state = tracker.get(key)
    if (!state || now - state.startedAt > WINDOW_MS) {
        state = { startedAt: now, count: 0 }
    }
    state.count += 1
    tracker.set(key, state)
    return { key, state }
}

function cleanup() {
    const now = Date.now()
    for (const [key, value] of tracker) {
        if (now - value.startedAt > WINDOW_MS * 3) tracker.delete(key)
    }
}
setInterval(cleanup, 15000).unref?.()

async function handler(m) {
    const db = getDatabase()
    const action = m.args?.[0]?.toLowerCase()
    const group = db.getGroup(m.chat) || {}
    if (!action || !['on', 'off', 'status'].includes(action)) {
        return m.reply(
            `🛡️ *ANTI FLOOD*\n\n` +
            `> Status: *${group.antiflood ? '✅ AKTIF' : '❌ NONAKTIF'}*\n` +
            `> Batas deteksi: *${MESSAGE_LIMIT} pesan / ${WINDOW_MS / 1000} detik*\n` +
            `> Setelah *${WARNING_LIMIT}x* pelanggaran → kick otomatis\n\n` +
            `> ${m.prefix}antiflood on/off`
        )
    }
    if (action === 'status') {
        return m.reply(`🛡️ *AntiFlood:* ${group.antiflood ? '✅ AKTIF' : '❌ NONAKTIF'}`)
    }
    db.setGroup(m.chat, { antiflood: action === 'on' })
    return m.reply(`${action === 'on' ? '✅' : '❌'} *AntiFlood ${action === 'on' ? 'diaktifkan' : 'dinonaktifkan'}*`)
}

async function handleAntiFlood(m, sock, db) {
    if (!m.isGroup || m.isAdmin || m.isOwner || m.fromMe) return false
    const group = db.getGroup(m.chat) || {}
    if (!group.antiflood) return false

    const { key, state } = stateFor(m.chat, m.sender)
    if (state.count < MESSAGE_LIMIT) return false

    state.count = 0
    state.startedAt = Date.now()
    tracker.set(key, state)

    try {
        const meta = await sock.groupMetadata(m.chat)
        const botJid = `${sock.user?.id?.split(':')[0]}@s.whatsapp.net`
        const participants = meta.participants || []
        const senderNum = String(m.sender || '').replace(/[^0-9]/g, '')
        const botNum = String(botJid || '').replace(/[^0-9]/g, '')
        const senderParticipant = participants.find(p => String(p.id || p.jid || p.participant || '').replace(/[^0-9]/g, '') === senderNum)
        const botParticipant = participants.find(p => String(p.id || p.jid || p.participant || '').replace(/[^0-9]/g, '') === botNum)
        if (senderParticipant?.admin) return false
        if (!botParticipant?.admin) return false

        await sock.sendMessage(m.chat, { delete: m.key })

        const warnings = group.antifloodWarnings || {}
        const count = Number.parseInt(warnings[m.sender], 10) || 0
        const next = count + 1
        warnings[m.sender] = next

        if (next >= WARNING_LIMIT) {
            try {
                await sock.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
                delete warnings[m.sender]
                db.setGroup(m.chat, { antifloodWarnings: warnings })
                await sock.sendMessage(m.chat, {
                    text: `🚨 *AntiFlood*\n\n@${m.sender.split('@')[0]} dikeluarkan karena mengirim pesan terlalu cepat berulang kali.`,
                    mentions: [m.sender]
                })
            } catch {
                db.setGroup(m.chat, { antifloodWarnings: warnings })
            }
        } else {
            db.setGroup(m.chat, { antifloodWarnings: warnings })
            await sock.sendMessage(m.chat, {
                text: `⚠️ *AntiFlood*\n\n@${m.sender.split('@')[0]} terdeteksi melakukan flood.\n> Peringatan: *${next}/${WARNING_LIMIT}*`,
                mentions: [m.sender]
            })
        }
        return true
    } catch {
        return false
    }
}

export { pluginConfig as config, handler, handleAntiFlood }
