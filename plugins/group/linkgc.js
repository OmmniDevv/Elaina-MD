/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'linkgc',
    alias: ['linkgrup', 'getlink', 'gclink'],
    category: 'group',
    description: 'Dapatkan link invite grup',
    usage: '.linkgc',
    example: '.linkgc',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true,
    isAdmin: true,
    isBotAdmin: true
}

async function handler(m, { sock }) {
    m.react('🕕')
    
    try {
        const code = await sock.groupInviteCode(m.chat)
        const urlGrup = `https://chat.whatsapp.com/${code}`
        await m.reply(`Link grup grup ini\n${urlGrup}`)
        
        m.react('✅')
        
    } catch (err) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }