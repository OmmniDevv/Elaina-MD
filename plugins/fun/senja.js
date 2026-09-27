/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import config from '../../config.js'
import { f } from '../../src/lib/elaina-http.js'
import te from '../../src/lib/elaina-error.js'
const NEOXR_APIKEY = config.APIkey?.neoxr || 'Milik-Bot-RimuruMD'

const pluginConfig = {
    name: 'senja',
    alias: ['katacinta', 'romanticquotes'],
    category: 'fun',
    description: 'Random kata-kata senja/romantis',
    usage: '.senja',
    example: '.senja',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    m.react('🕕')
    try {
        const res = await f(`https://api.neoxr.eu/api/senja?apikey=${NEOXR_APIKEY}`)
        
        if (!res.status || !res.data?.text) {
            m.react('❌')
            return m.reply(`❌ Gagal mengambil kata senja`)
        }
        await m.reply(res.data.text)
        m.react('✅')
    } catch (err) {
        m.react('☢')
        return m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }