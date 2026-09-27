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

import axios from 'axios'

const pluginConfig = {
    name: 'myip',
    alias: ['botip', 'publicip'],
    category: 'tools',
    description: 'Cek IP publik server bot',
    usage: '.myip',
    example: '.myip',
    isOwner: true,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

async function handler(m) {
    try {
        m.react('🔎')
        const { data } = await axios.get('https://api.ipify.org?format=json', { timeout: 10000 })
        const ip = data?.ip
        if (!ip) throw new Error('IP kosong')
        return m.reply(`🔎 *IP Publik Bot:* ${ip}`)
    } catch (error) {
        console.error('[myip]', error)
        return m.reply('❌ Gagal mengambil IP publik server.')
    }
}

export { pluginConfig as config, handler }
