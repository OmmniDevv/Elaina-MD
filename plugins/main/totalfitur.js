/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getAllPlugins } from '../../src/lib/elaina-plugins.js'
import config from '../../config.js'
import te from '../../src/lib/elaina-error.js'

const pluginConfig = {
    name: 'totalfitur',
    alias: ['totalfeature', 'totalcmd', 'countplugin', 'distribusi'],
    category: 'main',
    description: 'Lihat total fitur/command bot',
    usage: '.totalfitur',
    example: '.totalfitur',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

const ICONS = {
    main: '🏠', tools: '🔧', downloader: '📥', download: '📥', sticker: '🎨',
    ai: '🤖', media: '📷', game: '🎮', rpg: '⚔️', maker: '🖼️', fun: '🎭',
    group: '👥', owner: '👑', premium: '💎', info: '📊', search: '🔍',
    canvas: '🎨', anime: '🌸', nsfw: '🔞', utility: '🛠️', economy: '💰',
    stalker: '🔎', random: '🎲', religi: '🕌', islamic: '☪️', cek: '✅',
    store: '🛒', panel: '🖥️', convert: '🔄', primbon: '🔮', tts: '🗣️',
    otp: '🔑', vps: '☁️', pushkontak: '📱', jpm: '🎰', ephoto: '📸',
    other: '📦'
}

async function handler(m, { sock }) {
    try {
        const allPlugins = getAllPlugins()
        const cats = {}
        let total = 0, enabled = 0

        for (const p of allPlugins) {
            if (!p.config) continue
            const cat = p.config.category || 'other'
            if (!cats[cat]) cats[cat] = { total: 0, enabled: 0 }
            cats[cat].total++
            total++
            if (p.config.isEnabled !== false) {
                cats[cat].enabled++
                enabled++
            }
        }

        await m.react('📊')

        const sorted = Object.entries(cats).sort((a, b) => b[1].total - a[1].total)

        const tableData = sorted.map(([cat, data]) => {
            const pct = ((data.total / total) * 100).toFixed(1)
            return [
                `${ICONS[cat] || '📦'} ${cat.toUpperCase()}`,
                data.total.toString(),
                `${pct}%`
            ]
        })

        await sock.sendTable(
            m.chat,
            'Distribusi Fitur',
            ['Kategori', 'Jumlah', 'Persen'],
            tableData,
            m,
            {
                headerText: `Total: ${total} | Aktif: ${enabled} | Kategori: ${sorted.length}`,
                footer: `Total ${total} fitur tersedia`
            }
        )

    } catch (error) {
        await m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }