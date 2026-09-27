/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'clankick',
    alias: ['kickclan'],
    category: 'clan',
    description: 'Kick member dari clan (leader only)',
    usage: '.clankick @user',
    example: '.clankick @user',
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
    if (clan.leader !== m.sender) return m.reply(`❌ Hanya leader yang bisa kick`)

    const target = m.mentionedJid?.[0] || m.quoted?.sender
    if (!target) {
        return m.reply(
            `👢 *CLAN KICK*\n\n` +
            `Tag atau reply member yang mau dikeluarkan\n\n` +
            `Contoh: *.clankick @user*`
        )
    }

    if (target === m.sender) return m.reply(`❌ Tidak bisa kick diri sendiri`)
    if (!clan.members.includes(target)) return m.reply(`❌ User bukan member clan ini`)

    clan.members = clan.members.filter(jid => jid !== target)
    db.setUser(target, { clanId: null })
    db.save()

    const emblem = clan.emblem || '🏰'

    await m.reply(
        `${emblem} *KICKED*\n\n` +
        `@${target.split('@')[0]} dikeluarkan dari *${clan.name}*\n` +
        `Sisa members: ${clan.members.length}/50`,
        { mentions: [target] }
    )
}

export { pluginConfig as config, handler }