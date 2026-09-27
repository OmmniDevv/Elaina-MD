/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'clanjoin',
    alias: ['joinclan', 'guildjoin'],
    category: 'clan',
    description: 'Gabung ke clan',
    usage: '.clanjoin <clan_id>',
    example: '.clanjoin clan_123456',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

const MAX_MEMBERS = 50

async function handler(m) {
    const db = getDatabase()
    const user = db.getUser(m.sender)
    const clanId = m.text?.trim()

    if (!clanId) {
        return m.reply(
            `🏰 *JOIN CLAN*\n\n` +
            `Masukkan ID clan!\n\n` +
            `Contoh: *.clanjoin clan_123456*\n` +
            `Cek ID: *.clanleaderboard*`
        )
    }

    if (user.clanId) {
        return m.reply(`❌ Kamu sudah punya clan\nKeluar dulu: *.clanleave*`)
    }

    if (!db.db.data.clans) db.db.data.clans = {}

    const clan = db.db.data.clans[clanId]
        || Object.values(db.db.data.clans).find(c => c.name.toLowerCase() === clanId.toLowerCase())
        || Object.values(db.db.data.clans).find(c => c.id.toLowerCase() === clanId.toLowerCase())
    if (!clan) return m.reply(`❌ Clan tidak ditemukan`)
    if (!clan.isOpen) return m.reply(`❌ *${clan.name}* sedang tertutup`)
    if (clan.members.length >= MAX_MEMBERS) return m.reply(`❌ *${clan.name}* sudah penuh (${MAX_MEMBERS}/${MAX_MEMBERS})`)

    clan.members.push(m.sender)
    db.setUser(m.sender, { clanId })
    db.save()

    const emblem = clan.emblem || '🏰'

    await m.reply(
        `${emblem} *WELCOME!*\n\n` +
        `@${m.sender.split('@')[0]} bergabung ke *${clan.name}*\n\n` +
        `Leader: @${clan.leader.split('@')[0]}\n` +
        `Members: ${clan.members.length}/${MAX_MEMBERS}\n\n` +
        `Lihat info: *.claninfo*`,
        { mentions: [m.sender, clan.leader] }
    )
}

export { pluginConfig as config, handler }