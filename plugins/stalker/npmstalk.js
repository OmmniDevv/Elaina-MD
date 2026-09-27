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
    name: 'npmstalk',
    alias: ['stalknpm', 'npms'],
    category: 'stalker',
    description: 'Stalk akun NPM (Node Package Manager)',
    usage: '.npmstalk <username>',
    example: '.npmstalk hanya_zann',
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
    const username = m.args[0]
    
    if (!username) {
        return m.reply(`📦 *ɴᴘᴍ sᴛᴀʟᴋ*\n\n> Masukkan username NPM\n\n\`Contoh: ${m.prefix}npmstalk hanya_zann\``)
    }
    
    m.react('🔍')
    
    try {
        const res = await axios.get(`https://firefly.maiku.my.id/api/stalk-npm?apikey=${config.APIkey.firefly}&username=${encodeURIComponent(username)}`, {
            timeout: 30000
        })
        
        if (!res.data?.status || !res.data?.data) {
            m.react('❌')
            return m.reply(`❌ Username *${username}* tidak ditemukan`)
        }
        
        const d = res.data.data
        const s = d.stats || {}
        
        let caption = `📦 *ɴᴘᴍ sᴛᴀʟᴋ*\n\n` +
            `👤 *Username:* ${d.username}\n` +
            `📛 *Nama:* ${d.name || '-'}\n` +
            `📧 *Email:* ${d.email || '-'}\n\n` +
            `📦 *Total Packages:* ${s.total_packages || 0}\n` +
            `📉 *Monthly Downloads:* ${shortNum(s.total_monthly_downloads)}\n\n` +
            `🔗 ${d.profile}\n\n`
            
        if (d.packages && d.packages.length > 0) {
            caption += `*Daftar Package:*\n`
            d.packages.slice(0, 5).forEach((pkg, i) => {
                caption += `> 📦 *${pkg.name}* (v${pkg.version})\n`
                caption += `> 📉 ${shortNum(pkg.downloads_monthly)} dl/month\n`
                caption += `> 📝 ${pkg.description}\n\n`
            })
        }
        
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
