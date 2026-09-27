/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import likee from '../../src/scraper/likee.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'likeedl',
    alias: ['lkdl', 'likee', 'lk'],
    category: 'download',
    description: 'Download video Likee',
    usage: '.lkdl <url>',
    example: '.lkdl https://likee.video/@xxx',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const url = m.text?.trim()
    
    if (!url) {
        return m.reply(
            `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
            `> \`${m.prefix}lkdl <url>\`\n\n` +
            `> Contoh:\n` +
            `> \`${m.prefix}lkdl https://likee.video/@xxx\``
        )
    }
    
    if (!url.match(/likee\.(video|com)/i)) {
        return m.reply(`❌ URL tidak valid. Gunakan link Likee.`)
    }
    
    await m.react('🕕')
    
    try {
        const data = await likee(url)
        
        if (!data) {
            return m.reply(`❌ Gagal mengambil video. Coba link lain.`)
        }
        
        const videoUrl = data.without_watermark || data.with_watermark
        
        if (!videoUrl) {
            return m.reply(`❌ Video tidak ditemukan.`)
        }
        
        await sock.sendMedia(m.chat, videoUrl, null, m, {
            type: 'video',
            contextInfo: {
                forwardingScore: 99,
                isForwarded: true
            }
        })
        
        await m.react('✅')
        
    } catch (err) {
        return m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }