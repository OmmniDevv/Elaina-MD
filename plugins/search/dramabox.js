/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import dramaboxsearch from '../../src/scraper/dramabox.js';
const pluginConfig = {
    name: 'dramabox',
    alias: ['drama', 'dramasearch'],
    category: 'search',
    description: 'Cari drama di DramaBox',
    usage: '.dramabox <query>',
    example: '.dramabox billionaire',
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
            `> \`${m.prefix}dramabox <query>\`\n\n` +
            `> Contoh:\n` +
            `> \`${m.prefix}dramabox billionaire\``
        )
    }
    
    try {
        const data = await dramaboxsearch(query)
        
        if (data.status === 'eror' || !data.results?.length) {
            return m.reply(`❌ Tidak ditemukan drama untuk: ${query}`)
        }
        
        const dramas = data.results.slice(0, 5)
        
        let txt = `🎬 *ᴅʀᴀᴍᴀʙᴏx sᴇᴀʀᴄʜ*\n\n`
        txt += `╭┈┈⬡「 🔍 *ɪɴꜰᴏ* 」\n`
        txt += `┃ 🔎 ǫᴜᴇʀʏ: *${query}*\n`
        txt += `┃ 📊 ᴛᴏᴛᴀʟ: *${data.total} hasil*\n`
        txt += `╰┈┈⬡\n\n`
        
        dramas.forEach((d, i) => {
            const desc = d.description?.substring(0, 80) || '-'
            txt += `╭┈┈⬡「 🎭 *${i + 1}* 」\n`
            txt += `┃ 📛 \`\`\`${d.title}\`\`\`\n`
            txt += `┃ 📺 ᴇᴘɪsᴏᴅᴇs: *${d.episodes || 0}*\n`
            txt += `┃ 📝 ${desc}${d.description?.length > 80 ? '...' : ''}\n`
            txt += `┃ 🔗 \`${d.play_url}\`\n`
            txt += `╰┈┈⬡\n\n`
        })
        
        return m.reply(txt.trim())
        
    } catch (err) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> ${err.message}`)
    }
}

export { pluginConfig as config, handler };
