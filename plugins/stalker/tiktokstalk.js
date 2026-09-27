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
    name: 'tiktokstalk',
    alias: ['ttstalk', 'stalktt'],
    category: 'stalker',
    description: 'Stalk akun TikTok',
    usage: '.tiktokstalk <username>',
    example: '.tiktokstalk mrbeast',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

function shortNum(num) {
    if (!num) return '0'
    num = parseInt(num)
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace('.0', '') + 'B'
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M'
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace('.0', '') + 'K'
    return num.toString()
}

async function handler(m, { sock }) {
    const username = m.args[0]?.replace('@', '')
    
    if (!username) {
        return m.reply(`🎵 *ᴛɪᴋᴛᴏᴋ sᴛᴀʟᴋ*\n\n> Masukkan username TikTok\n\n\`Contoh: ${m.prefix}tiktokstalk mrbeast\``)
    }
    
    m.react('🔍')
    
    try {
        const res = await axios.get(`https://firefly.maiku.my.id/api/stalk-tiktok?apikey=${config.APIkey.firefly}&username=${encodeURIComponent(username)}`, {
            timeout: 30000
        })
        
        if (!res.data?.status || !res.data?.data) {
            m.react('❌')
            return m.reply(`❌ Username *@${username}* tidak ditemukan`)
        }
        
        const d = res.data.data
        const s = d.stats
        
        const caption = `🎵 *ᴛɪᴋᴛᴏᴋ sᴛᴀʟᴋ*\n\n` +
            `👤 *Username:* @${d.username}\n` +
            `📛 *Nama:* ${d.nickname}\n` +
            `✅ *Verified:* ${d.verified ? 'Ya' : 'Tidak'}\n` +
            `🔒 *Private:* ${d.private ? 'Ya' : 'Tidak'}\n\n` +
            `👥 *Followers:* ${shortNum(s.followers)}\n` +
            `👤 *Following:* ${shortNum(s.following)}\n` +
            `❤️ *Likes:* ${shortNum(s.hearts)}\n` +
            `🎬 *Videos:* ${shortNum(s.videos)}\n\n` +
            `📝 *Bio:*\n${d.signature || '-'}\n\n` +
            `🔗 https://tiktok.com/@${d.username}`
        
        m.react('✅')
        
        await sock.sendMessage(m.chat, {
            image: { url: d.avatar },
            caption
        }, { quoted: m })
        
    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }