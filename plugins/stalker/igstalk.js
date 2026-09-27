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
    name: 'igstalk',
    alias: ['instagramstalk', 'stalking'],
    category: 'stalker',
    description: 'Stalk akun Instagram',
    usage: '.igstalk <username>',
    example: '.igstalk cristiano',
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
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace('.0', '') + ' miliar'
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + ' jt'
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace('.0', '') + ' rb'
    return num.toString()
}

async function handler(m, { sock }) {
    const username = m.args[0]?.replace('@', '')
    
    if (!username) {
        return m.reply(
            `📸 *ɪɴsᴛᴀɢʀᴀᴍ sᴛᴀʟᴋ*\n\n` +
            `> Masukkan username Instagram\n\n` +
            `\`Contoh: ${m.prefix}igstalk cristiano\``
        )
    }
    
    m.react('🔍')
    
    try {
        const res = await axios.get(
            `https://firefly.maiku.my.id/api/stalk-instagram?apikey=${config.APIkey.firefly}&username=${encodeURIComponent(username)}`,
            { timeout: 30000 }
        )
        
        const d = res.data?.data
        if (!res.data?.status || !d?.username) {
            m.react('❌')
            return m.reply(`❌ Akun *@${username}* tidak ditemukan`)
        }
        
        const caption = `📸 *ɪɴsᴛᴀɢʀᴀᴍ sᴛᴀʟᴋ*\n\n` +
            `👤 *Username:* ${d.username}\n` +
            `📛 *Nama:* ${d.full_name || '-'}\n` +
            `✅ *Verified:* ${d.is_verified ? 'Ya' : 'Tidak'}\n` +
            `🔒 *Private:* ${d.is_private ? 'Ya' : 'Tidak'}\n\n` +
            `👥 *Pengikut:* ${shortNum(d.stats?.followers)}\n` +
            `👤 *Mengikuti:* ${shortNum(d.stats?.following)}\n` +
            `📷 *Postingan:* ${shortNum(d.stats?.posts)}\n\n` +
            `📝 *Bio:*\n${d.bio || '-'}\n\n` +
            `🔗 https://instagram.com/${d.username}`
        
        m.react('✅')
        
        const profilePic = d.profile_pic
        if (profilePic) {
            await sock.sendMessage(m.chat, {
                image: { url: profilePic },
                caption
            }, { quoted: m })
        } else {
            await m.reply(caption)
        }
        
    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }