/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'spamngl',
    alias: [],
    category: 'tools',
    description: 'Send NGL Spam',
    usage: '.spamngl <url> | <text> | <jumlah>',
    example: '.spamngl https://ngl.link/xxxx | hai | 10',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const text = m.text?.split('|')
    const [ link, kata, jumlah ] = text
    if(!link) return m.reply(`*LINK NGL NYA MANA ??*\nContoh: \`${m?.prefix}spamngl https://ngl.link/xxxx | hai | 10`)
    if(!kata) return m.reply(`*KATA KATA NYA MANA ??*\n\nContoh: \`${m?.prefix}spamngl https://ngl.link/xxxx | hai | 10`)
    if(!jumlah) return m.reply(`*JUMLAH NYA MANA ??*\n\nContoh: \`${m?.prefix}spamngl https://ngl.link/xxxx | hai | 10`)
    if(isNaN(jumlah)) return m.reply(`*JUMLAH NYA HARUS ANGKA*\n\nContoh: \`${m?.prefix}spamngl https://ngl.link/xxxx | hai | 10`)
    m.react('🎴')
    
    try {
        for(let i = 0; i < jumlah; i++) {
            axios.get(`https://api.cuki.biz.id/api/tools/sendngl?apikey=cuki-x&link=${encodeURIComponent(link)}&text=${encodeURIComponent(kata)}`, {
                timeout: 30000
            })
            await new Promise(resolve => setTimeout(resolve, 4000))
        }
        await m.react('✅')
        await sock.sendMessage(m.chat, {
            text: `✅ *DONE*\n\nBerhasil mengirim spam NGL Message!\nTarget: ${link}\nPesan: ${kata} (${jumlah}x)`
        }, { quoted: m })
        
    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }