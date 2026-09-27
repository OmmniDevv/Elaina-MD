/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'

const pluginConfig = {
    name: 'antilink',
    alias: ['al', 'antilinkgroup', 'nolink'],
    category: 'group',
    description: 'Hapus otomatis semua link yang dikirim member grup',
    usage: '.antilink <on/off>',
    example: '.antilink on',
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

async function handler(m) {
    const db = getDatabase()
    const action = m.args?.[0]?.toLowerCase()
    const group = db.getGroup(m.chat) || {}

    if (!action || !['on', 'off', 'status'].includes(action)) {
        const status = group.antilink === 'on' ? '✅ AKTIF' : '❌ NONAKTIF'
        return m.reply(
            `🔗 *ANTI LINK GRUP*\n\n` +
            `> Status: *${status}*\n` +
            `> Deteksi: URL dengan atau tanpa https/http\n` +
            `> Tindakan: *Hapus pesan saja*\n\n` +
            `*Cara pakai:*\n` +
            `> ${m.prefix}antilink on\n` +
            `> ${m.prefix}antilink off`
        )
    }

    if (action === 'status') {
        return m.reply(`🔗 *AntiLink:* ${group.antilink === 'on' ? '✅ AKTIF' : '❌ NONAKTIF'}`)
    }

    if (action === 'on') {
        db.setGroup(m.chat, {
            antilink: 'on',
            antilinkKick: 'off'
        })
        return m.reply(`✅ *AntiLink aktif*\n> Setiap link member akan dihapus otomatis.`)
    }

    db.setGroup(m.chat, { antilink: 'off' })
    return m.reply(`❌ *AntiLink nonaktif*`)
}

export { pluginConfig as config, handler }
