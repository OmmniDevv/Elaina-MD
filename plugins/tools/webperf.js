/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'

const pluginConfig = {
    name: ['webperf', 'webperformance', 'cekweb', 'speedtest'],
    alias: [],
    category: 'tools',
    description: 'Cek performa dan speed website',
    usage: '.webperf <url>',
    example: '.webperf https://google.com',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 15,
    energi: 1,
    isEnabled: true
}

const BASE_URL = 'https://api.denayrestapi.xyz'

function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getScoreEmoji(score) {
    if (score >= 90) return '🟢'
    if (score >= 70) return '🟡'
    if (score >= 50) return '🟠'
    return '🔴'
}

async function handler(m) {
    let url = m.text?.trim()
    
    if (!url) {
        return m.reply(
            `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
            `> \`${m.prefix}webperf <url>\`\n\n` +
            `> Contoh: \`${m.prefix}webperf https://google.com\``
        )
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
    }
    
    await m.reply(`⏳ *Menganalisa ${url}...*`)
    
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/tools/webperf`, {
            params: { url },
            timeout: 60000
        })
        
        const data = response.data
        
        if (data.status !== 200 || !data.result) {
            return m.reply(`❌ Gagal menganalisa website.`)
        }
        
        const r = data.result
        const scoreEmoji = getScoreEmoji(r.score || 0)
        
        let txt = `🌐 *ᴡᴇʙ ᴘᴇʀꜰᴏʀᴍᴀɴᴄᴇ*\n`
        txt += `━━━━━━━━━━━━━━━\n\n`
        
        txt += `📌 *URL:* ${r.url || url}\n`
        txt += `📝 *Title:* ${r.title || '-'}\n\n`
        
        if (r.description) {
            txt += `📄 *Description:*\n> ${r.description.substring(0, 100)}...\n\n`
        }
        
        txt += `*📊 ᴘᴇʀꜰᴏʀᴍᴀɴᴄᴇ*\n`
        txt += `┃ ${scoreEmoji} Score: *${r.score || 0}/100*\n`
        txt += `┃ ⚡ Load Time: *${r.loadTimeMs || 0}ms*\n`
        txt += `┃ 📦 Size: *${formatBytes(r.sizeBytes || 0)}*\n`
        txt += `┃ 🔢 HTTP Status: *${r.httpStatus || '-'}*\n\n`
        
        if (r.resources) {
            txt += `*📁 ʀᴇsᴏᴜʀᴄᴇs*\n`
            txt += `┃ 📜 Scripts: *${r.resources.scripts || 0}*\n`
            txt += `┃ 🖼️ Images: *${r.resources.images || 0}*\n`
            txt += `┃ 🎨 CSS: *${r.resources.css || 0}*\n`
            txt += `┃ ✏️ Inline Styles: *${r.resources.inlineStyles || 0}*\n\n`
        }
        
        if (r.hints?.length > 0) {
            txt += `*💡 ʜɪɴᴛs*\n`
            for (const hint of r.hints.slice(0, 3)) {
                txt += `> ${hint}\n`
            }
            txt += `\n`
        }
        
        txt += `━━━━━━━━━━━━━━━\n`
        txt += `_Powered by denayrestapi.xyz_`
        
        await m.reply(txt)
        m.react('🌐')
        
    } catch (err) {
        m.react('❌')
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> ${err.message}`)
    }
}

export { pluginConfig as config, handler };
