/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'clanleaderboard',
    alias: ['clanlb', 'topclan', 'guildrank'],
    category: 'clan',
    description: 'Lihat ranking clan',
    usage: '.clanleaderboard',
    example: '.clanleaderboard',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

function getRankTitle(level) {
    if (level >= 50) return '👑'
    if (level >= 30) return '💎'
    if (level >= 20) return '🏆'
    if (level >= 10) return '🥇'
    if (level >= 5) return '🥈'
    return '🥉'
}

async function handler(m) {
    const db = getDatabase()

    if (!db.db.data.clans) db.db.data.clans = {}

    const clans = Object.values(db.db.data.clans)
    if (clans.length === 0) {
        return m.reply(`🏰 Belum ada clan terdaftar\n\nBuat: *.clancreate <nama>*`)
    }

    clans.sort((a, b) => {
        const scoreA = ((a.wins || 0) * 100) + (a.exp || 0) + ((a.level || 1) * 500)
        const scoreB = ((b.wins || 0) * 100) + (b.exp || 0) + ((b.level || 1) * 500)
        return scoreB - scoreA
    })

    const medals = ['🥇', '🥈', '🥉']

    let txt = `🏰 *CLAN LEADERBOARD*\n\n`

    clans.slice(0, 10).forEach((clan, i) => {
        const medal = medals[i] || `${i + 1}.`
        const totalGames = (clan.wins || 0) + (clan.losses || 0)
        const winRate = totalGames > 0
            ? ((clan.wins / totalGames) * 100).toFixed(0)
            : '—'
        const emblem = clan.emblem || '🏰'
        const rank = getRankTitle(clan.level || 1)

        txt += `${medal} ${emblem} *${clan.name}*\n`
        txt += `   ${rank} Lv.${clan.level || 1} · ${clan.wins || 0}W/${clan.losses || 0}L (${winRate}%) · 👥 ${clan.members.length}\n\n`
    })

    txt += `Total *${clans.length}* clan terdaftar`

    await m.reply(txt)
}

export { pluginConfig as config, handler }