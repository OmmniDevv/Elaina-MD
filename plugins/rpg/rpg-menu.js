// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// RPG Menu — Kategori dropdown style (kayak menucat.js)
// Bukan button, biar nggak kebanyakan

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

    const buttons = [
        {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
                title: '⚔️ RPG MENU',
                sections: [{ title: 'PILIH KATEGORI', rows: catRows }],
                has_multiple_buttons: true
            })
        }
    ]

    const ftroliQuoted = {
        key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
        message: {
            orderMessage: {
                orderId: '1337',
                itemCount: Object.values(cmdMap).reduce((a, b) => a + b.length, 0),
                status: 'INQUIRY',
                surface: 'CATALOG',
                message: '⚔️ RPG Menu',
                orderTitle: '⚔️ RPG Commands',
                sellerJid: `${global.nomorbot || '0'}@s.whatsapp.net`,
                token: 'elaina-rpg',
                totalAmount1000: 0,
                totalCurrencyCode: 'IDR'
            }
        }
    }

    try {
        await conn.sendMessage(m.chat, {
            interactiveMessage: {
                title: '',
                footer: `⚔️ *RPG MENU*\n\nPilih kategori di bawah~\n_© ${global.namebot || 'Elaina-MD'}_`,
                document: Buffer.from(JSON.stringify({ rpg: true })),
                mimetype: 'image/jpeg',
                jpegThumbnail: null,
                nativeFlowMessage: {
                    messageParamsJson: JSON.stringify({
                        bottom_sheet: {
                            in_thread_buttons_limit: 1,
                            divider_indices: [1],
                            list_title: 'Pilih kategori RPG',
                            button_title: '⚔️ RPG Menu'
                        }
                    }),
                    buttons
                }
            }
        }, { quoted: ftroliQuoted })
    } catch (e) {
        // Fallback: text menu
        let txt = `⚔️ *RPG MENU*\n\n`
        for (const [key, cat] of Object.entries(RPG_CATEGORIES)) {
            const cmds = cmdMap[key] || []
            if (!cmds.length) continue
            txt += `${cat.emoji} *${cat.label}*\n`
            cmds.forEach(c => { txt += `  • ${usedPrefix}${c}\n` })
            txt += '\n'
        }
        await m.reply(txt)
    }
}

handler.help = ['rpg', 'rpgmenu']
handler.tags = ['rpg']
handler.command = /^(rpg|rpgmenu)$/i

export default handler
