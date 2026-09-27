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
    name: 'dbinary',
    alias: ['decodebinary', 'binary2text'],
    category: 'tools',
    description: 'Decode binary menjadi teks',
    usage: '.dbinary <binary>',
    example: '.dbinary 1001001 110110 110',
    cooldown: 3,
    energi: 1,
    isEnabled: true
}

async function handler(m) {
    const text = m.text?.trim()
    if (!text) return m.reply(`Contoh: ${m.prefix}dbinary 1000001 1000010`)
    const chunks = text.split(/\s+/)
    if (!chunks.every(x => /^[01]+$/.test(x))) return m.reply('❌ Format binary tidak valid.')
    try {
        const result = chunks.map(x => String.fromCharCode(parseInt(x, 2))).join('')
        return m.reply(result || '❌ Binary kosong.')
    } catch {
        return m.reply('❌ Gagal decode binary.')
    }
}

export { pluginConfig as config, handler }
