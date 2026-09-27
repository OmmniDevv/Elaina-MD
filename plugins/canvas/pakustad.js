/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { f } from '../../src/lib/elaina-http.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: ['pakustad', 'pak-ustad', 'tanyaustad'],
    alias: [],
    category: 'fun',
    description: 'Tanya pak ustad (gambar)',
    usage: '.pakustad <pertanyaan>',
    example: '.pakustad kenapa aku ganteng',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const text = m.text || m.quoted?.text
    
    if (!text) {
        return m.reply(
            `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
            `> \`${m.prefix}pakustad <pertanyaan>\`\n\n` +
            `> Contoh: \`${m.prefix}pakustad kenapa aku ganteng\``
        )
    }
    
    await m.react('🕕')
    
    try {
        const apiUrl = `https://api.cuki.biz.id/api/canvas/ustadz?apikey=cuki-x&text=${encodeURIComponent(text)}`
        const { results } = await f(apiUrl)
        await sock.sendMedia(m.chat, results.url, text, m, {
            type: 'image'
        })
        
        m.react('✅')
        
    } catch (err) {
        m.react('☢')
        return m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }