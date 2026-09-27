/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/*
  Fitur tambahan hasil audit FURINA V17 → Rimuru MD.
*/

const pluginConfig = {
    name: 'ebinary',
    alias: ['encodebinary', 'text2binary'],
    category: 'tools',
    description: 'Encode teks menjadi binary',
    usage: '.ebinary <teks>',
    example: '.ebinary Rimuru',
    cooldown: 3,
    energi: 1,
    isEnabled: true
}

async function handler(m) {
    const text = m.text?.trim()
    if (!text) return m.reply(`Contoh: ${m.prefix}ebinary Rimuru`)
    const result = [...text].map(char => char.charCodeAt(0).toString(2)).join(' ')
    return m.reply(result)
}

export { pluginConfig as config, handler }
