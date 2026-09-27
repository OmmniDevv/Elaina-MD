/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
const pluginConfig = {
    name: 'bstation',
    alias: ['bili', 'bilibili'],
    category: 'search',
    description: 'Cari video di Bilibili TV',
    usage: '.bstation <query>',
    example: '.bstation Oshi no ko',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const query = m.text?.trim()
    
    if (!query) {
        return m.reply(
            `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
            `> \`${m.prefix}bstation <query>\`\n\n` +
            `> Contoh:\n` +
            `> \`${m.prefix}bstation Oshi no ko\``
        )
    }
    
    try {
        const res = await axios.get(`https://api.nekolabs.web.id/dsc/bstation/search?q=${encodeURIComponent(query)}`)
        
        if (!res.data?.success || !res.data?.result?.length) {
            return m.reply(`❌ Tidak ditemukan hasil untuk: ${query}`)
        }
        
        const videos = res.data.result.slice(0, 5)
        
        let txt = `📺 *ʙɪʟɪʙɪʟɪ ᴛᴠ sᴇᴀʀᴄʜ*\n\n`
        txt += `> Query: *${query}*\n`
        txt += `━━━━━━━━━━━━━━━\n\n`
        
        videos.forEach((v, i) => {
            txt += `╭─「 🎬 *${i + 1}* 」\n`
            txt += `┃ 📛 \`\`\`${v.title}\`\`\`\n`
            txt += `┃ 👤 \`${v.author?.nickname || 'Unknown'}\`\n`
            txt += `┃ 👁️ \`${v.view}\` • ⏱️ \`${v.duration}\`\n`
            txt += `┃ 🔗 \`${v.url}\`\n`
            txt += `╰━━━━━━━━━━━━━━\n\n`
        })
        
        return m.reply(txt.trim())
        
    } catch (err) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> ${err.message}`)
    }
}

export { pluginConfig as config, handler };
