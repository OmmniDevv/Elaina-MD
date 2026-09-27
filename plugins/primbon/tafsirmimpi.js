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
    name: 'tafsirmimpi',
    alias: ['artimimpi', 'mimpi'],
    category: 'primbon',
    description: 'Cari tafsir mimpi',
    usage: '.tafsirmimpi <kata kunci>',
    example: '.tafsirmimpi bertemu',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const keyword = m.args.join(' ')
    if (!keyword) {
        return m.reply(`🌙 *ᴛᴀꜰsɪʀ ᴍɪᴍᴘɪ*\n\n> Masukkan kata kunci mimpi\n\n\`Contoh: ${m.prefix}tafsirmimpi bertemu\``)
    }
    
    m.react('🌙')
    
    try {
        const url = `https://api.siputzx.my.id/api/primbon/tafsirmimpi?mimpi=${encodeURIComponent(keyword)}`
        const { data } = await axios.get(url, { timeout: 30000 })
        
        if (!data?.status || !data?.data?.hasil?.length) {
            m.react('❌')
            return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Tidak ditemukan tafsir untuk: ${keyword}`)
        }
        
        const r = data.data
        let response = `🌙 *ᴛᴀꜰsɪʀ ᴍɪᴍᴘɪ*\n\n`
        response += `> Kata kunci: *${r.keyword}*\n`
        response += `> Ditemukan: *${r.total} hasil*\n\n`
        
        r.hasil.slice(0, 10).forEach((h, i) => {
            response += `*${i+1}. ${h.mimpi}*\n> ${h.tafsir}\n\n`
        })
        
        if (r.total > 10) {
            response += `_...dan ${r.total - 10} hasil lainnya_`
        }
        
        m.react('✅')
        await m.reply(response)
        
    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }