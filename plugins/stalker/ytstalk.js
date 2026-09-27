/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import te from '../../src/lib/elaina-error.js'
import config from '../../config.js'

const pluginConfig = {
    name: 'ytstalk',
    alias: ['youtubestalk', 'stalkyt'],
    category: 'stalker',
    description: 'Stalk channel YouTube',
    usage: '.ytstalk <username>',
    example: '.ytstalk mrbeast',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const username = m.args[0]
    
    if (!username) {
        return m.reply(`📺 *ʏᴏᴜᴛᴜʙᴇ sᴛᴀʟᴋ*\n\n> Masukkan username YouTube\n\n\`Contoh: ${m.prefix}ytstalk mrbeast\``)
    }
    
    m.react('🔍')
    
    try {
        const res = await axios.get(`https://firefly.maiku.my.id/api/stalk-youtube?apikey=${config.APIkey.firefly}&username=${encodeURIComponent(username)}`, {
            timeout: 30000
        })
        
        if (!res.data?.status || !res.data?.data) {
            m.react('❌')
            return m.reply(`❌ Channel *${username}* tidak ditemukan`)
        }
        
        const c = res.data.data
        
        let caption = `📺 *ʏᴏᴜᴛᴜʙᴇ sᴛᴀʟᴋ*\n\n` +
            `👤 *Nama:* ${c.name}\n` +
            `🔗 *Username:* @${username}\n` +
            `✅ *Verified:* ${c.verified ? 'Ya' : 'Tidak'}\n\n` +
            `👥 *Subscribers:* ${c.subscribers}\n` +
            `🎬 *Total Video:* ${c.video_count}\n\n` +
            `📝 *Deskripsi:*\n${c.about || '-'}\n\n` +
            `🔗 ${c.url}`
            
        m.react('✅')
        
        await sock.sendMessage(m.chat, {
            image: { url: c.thumbnail },
            caption
        }, { quoted: m })
        
    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }