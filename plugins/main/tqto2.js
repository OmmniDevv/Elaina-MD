/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js'

const pluginConfig = {
    name: 'tqto2',
    alias: ['thanksto2', 'credits2', 'kredit2'],
    category: 'main',
    description: 'Menampilkan daftar kontributor bot',
    usage: '.tqto2',
    example: '.tqto2',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const credits = [
        { name: 'Anita', role: 'Lead Staff', icon: '👩‍💻' },
        { name: 'Hair', role: 'Feature Developer', icon: '👨‍💻' },
        { name: 'Albert', role: 'Partner', icon: '🛒' },
        { name: 'Bima', role: 'Partner', icon: '🛒' },
        { name: 'Zanspiw', role: 'Youtuber', icon: '🌐' }
    ]

    await m.reply(`🍟 *Berikut ini adalah orang-orang yang berkontribusi di bot ${config.bot?.name || 'Rimuru MD'}*

${credits.map((c, i) => `*${i + 1}*. *${c.name}* [ ${c.icon} ${c.role} ]`).join('\n')}`)
}

export { pluginConfig as config, handler }