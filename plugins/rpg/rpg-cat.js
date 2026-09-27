// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// RPG Category Detail — dipanggil dari dropdown rpg-menu.js
// .rpgcat <category>

const RPG_CATEGORIES = {
    'adventure': { emoji: '⚔️', label: 'ADVENTURE', cmds: ['adventure', 'dungeon', 'aot', 'airdrop', 'battlepet', 'bansos'] },
    'economy': { emoji: '💰', label: 'ECONOMY', cmds: ['balance', 'bank', 'nabung', 'tarik', 'atm', 'transfer', 'judi', 'slot'] },
    'craft': { emoji: '🔨', label: 'CRAFT & SHOP', cmds: ['craft', 'shop', 'buy', 'sell', 'upgrade', 'repair'] },
    'pet': { emoji: '🐾', label: 'PET', cmds: ['pet', 'feed', 'petstore', 'berburu'] },
    'mining': { emoji: '⛏️', label: 'MINING & FISHING', cmds: ['mining', 'fishing', 'mancing'] },
    'claim': { emoji: '🎁', label: 'CLAIM', cmds: ['claim', 'daily', 'weekly', 'monthly', 'hourly', 'yearly'] },
    'rpg': { emoji: '📊', label: 'STATS & INFO', cmds: ['level', 'profile', 'inventory', 'inv', 'leaderboard', 'lb'] },
}

let handler = async (m, { conn, text, usedPrefix }) => {
    const cat = (text || '').toLowerCase().trim()
    if (!cat || !RPG_CATEGORIES[cat]) {
        let txt = `⚔️ *RPG CATEGORIES*\n\n`
        for (const [key, c] of Object.entries(RPG_CATEGORIES)) {
            txt += `${c.emoji} ${c.label} → ${usedPrefix}rpgcat ${key}\n`
        }
        return m.reply(txt)
    }

    const info = RPG_CATEGORIES[cat]

    // Collect actual commands from plugins
    const cmds = []
    for (const [, plugin] of Object.entries(global.plugins || {})) {
        if (!plugin || plugin.disabled) continue
        if (plugin.tags !== 'rpg' && !Array.isArray(plugin.tags)?.includes('rpg')) continue
        const helps = Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : [])
        for (const h of helps) {
            if (!h) continue
            const cmd = h.split(' ')[0].split('<')[0].trim().toLowerCase()
            if (info.cmds.some(c => cmd.includes(c))) {
                cmds.push(h)
            }
        }
    }

    let txt = `${info.emoji} *${info.label}*\n\n`
    if (cmds.length) {
        cmds.forEach(c => { txt += `• ${usedPrefix}${c}\n` })
    } else {
        txt += '_Belum ada command di kategori ini._\n'
    }
    txt += `\n_Ketik ${usedPrefix}rpg untuk kembali ke menu_`

    await m.reply(txt)
}

handler.help = ['rpgcat <kategori>']
handler.tags = ['rpg']
handler.command = /^(rpgcat|rpgkategori)$/i

export default handler
