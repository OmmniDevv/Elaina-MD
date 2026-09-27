/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'fliptext',
    alias: ['baliktext'],
    category: 'tools',
    description: 'Membalik susunan teks',
    usage: '.fliptext <teks>',
    example: '.fliptext Rimuru MD',
    cooldown: 3,
    energi: 1,
    isEnabled: true
}

async function handler(m) {
    const text = m.text?.trim()
    if (!text) return m.reply(`Contoh: ${m.prefix}fliptext Rimuru MD`)
    const flipped = [...text].reverse().join('')
    return m.reply(`「 FLIP TEXT 」\n\n• Normal :\n${text}\n\n• Flip :\n${flipped}`)
}

export { pluginConfig as config, handler }
