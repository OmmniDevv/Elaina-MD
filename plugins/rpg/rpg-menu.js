// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// RPG Menu — Kategori via quick_reply (WA buang single_select → pesan
// "tidak didukung"). Panjang >10 ditaruh di body teks.
import { sendQuickMenu } from '../../lib/menuHelper.js'

const RPG_CATEGORIES = {
    'adventure': { emoji: '⚔️', label: 'ADVENTURE', cmds: ['adventure', 'dungeon', 'aot', 'airdrop', 'battlepet', 'bansos'] },
    'economy': { emoji: '💰', label: 'ECONOMY', cmds: ['balance', 'bank', 'nabung', 'tarik', 'atm', 'transfer', 'judi', 'slot'] },
    'craft': { emoji: '🔨', label: 'CRAFT & SHOP', cmds: ['craft', 'shop', 'buy', 'sell', 'upgrade', 'repair'] },
    'pet': { emoji: '🐾', label: 'PET', cmds: ['pet', 'feed', 'petstore', 'berburu'] },
    'mining': { emoji: '⛏️', label: 'MINING & FISHING', cmds: ['mining', 'fishing', 'mancing'] },
    'claim': { emoji: '🎁', label: 'CLAIM', cmds: ['claim', 'daily', 'weekly', 'monthly', 'hourly', 'yearly'] },
    'rpg': { emoji: '📊', label: 'STATS & INFO', cmds: ['level', 'profile', 'inventory', 'inv', 'leaderboard', 'lb'] },
}

function buildCommandMap() {
    const map = {}
    for (const [, plugin] of Object.entries(global.plugins || {})) {
        if (!plugin || plugin.disabled) continue
        if (plugin.tags !== 'rpg' && !Array.isArray(plugin.tags)?.includes('rpg')) continue
        const helps = Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : [])
        for (const h of helps) {
            if (!h) continue
            const cmd = h.split(' ')[0].split('<')[0].trim()
            if (!cmd) continue
            // Categorize
            for (const [catKey, cat] of Object.entries(RPG_CATEGORIES)) {
                if (cat.cmds.some(c => cmd.toLowerCase().includes(c))) {
                    if (!map[catKey]) map[catKey] = []
                    map[catKey].push(h)
                    break
                }
            }
        }
    }
    return map
}

let handler = async (m, { conn, usedPrefix }) => {
    const cmdMap = buildCommandMap()

    // Build category rows for dropdown
    const catRows = Object.entries(RPG_CATEGORIES).map(([key, cat]) => ({
        title: `${cat.emoji} ${cat.label}`,
        description: `${(cmdMap[key] || []).length} commands`,
        id: `${usedPrefix}rpgcat ${key}`
    }))

    const headerRows = Object.entries(RPG_CATEGORIES)
        .map(([key, cat]) => `  ${cat.emoji} *${cat.label}* — ${(cmdMap[key] || []).length} cmds`)
        .join('\n')

    await sendQuickMenu(conn, m, {
        title: `⚔️ ${global.namebot || 'Elaina-MD'}`,
        text: `*⚔️ RPG MENU*\n\nPilih kategori di bawah~\n\n${headerRows || '(tidak ada RPG plugin aktif)'}`,
        footer: `_© ${global.namebot || 'Elaina-MD'}_`,
        items: Object.entries(RPG_CATEGORIES)
            .filter(([k]) => cmdMap[k] && cmdMap[k].length)
            .map(([key, cat]) => ({ label: `${cat.emoji} ${cat.label}`, id: `${usedPrefix}rpgcat ${key}` }))
    })
}

handler.help = ['rpg', 'rpgmenu']
handler.tags = ['rpg']
handler.command = /^(rpg|rpgmenu)$/i

export default handler
