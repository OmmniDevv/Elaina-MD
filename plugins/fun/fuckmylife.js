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
    name: 'fuckmylife',
    alias: ['fml'],
    category: 'fun',
    description: 'Random FML story',
    usage: '.fuckmylife',
    example: '.fuckmylife',
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
        const data = await f(`https://api.neoxr.eu/api/fml?apikey=${NEOXR_APIKEY}`)
        
        if (!data?.status || !data?.data?.text) {
            m.react('❌')
            return m.reply(`❌ Gagal mengambil FML story`)
        }    
        await m.reply(data.data.text)
        m.react('✅')
        
    } catch (err) {
        m.react('☢')
        return m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }