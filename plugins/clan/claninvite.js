/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'claninvite',
    alias: ['inviteclan'],
    category: 'clan',
    description: 'Invite & langsung tambahkan user ke clan',
    usage: '.claninvite @user',
    example: '.claninvite @user',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

async function handler(m) {
    const db = getDatabase()
    const user = db.getUser(m.sender)

    if (!user?.clanId) return m.reply(`❌ Kamu belum punya clan`)
    if (!db.db.data.clans) db.db.data.clans = {}

    const clan = db.db.data.clans[user.clanId]
    if (!clan) return m.reply(`❌ Clan tidak ditemukan`)

    const target = m.mentionedJid?.[0] || m.quoted?.sender
    if (!target) {
        return m.reply(
            `📨 *CLAN INVITE*\n\n` +
            `Tag atau reply user yang mau diundang\n\n` +
            `Contoh: *.claninvite @user*`
        )
    }

    if (target === m.sender) return m.reply(`❌ Tidak bisa invite diri sendiri`)

    const targetUser = db.getUser(target)
    if (targetUser?.clanId) return m.reply(`❌ User tersebut sudah punya clan`)
    if (clan.members.length >= 50) return m.reply(`❌ Clan sudah penuh (50/50)`)

    clan.members.push(target)
    db.setUser(target, { clanId: user.clanId })
    db.save()

    const emblem = clan.emblem || '🏰'

    await m.reply(
        `${emblem} *INVITED!*\n\n` +
        `@${target.split('@')[0]} bergabung ke *${clan.name}*\n` +
        `Members: ${clan.members.length}/50`,
        { mentions: [m.sender, target] }
    )
}

export { pluginConfig as config, handler }