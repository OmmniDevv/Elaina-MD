/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import scrapeWWCharacter from '../../src/scraper/wwchar.js';
const pluginConfig = {
    name: 'wwchar',
    alias: [],
    category: 'info',
    description: 'Informasi karakter Wuthering Waves',
    usage: '.wwchar <nama karakter>',
    example: '.wwchar Chisa',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const name = m.args.join(' ')
    if (!name) {
        return m.reply(`🌊 *ᴡᴜᴛʜᴇʀɪɴɢ ᴡᴀᴠᴇs*\n\n> Masukkan nama karakter\n\n\`Contoh: ${m.prefix}wwchar Chisa\``)
    }
    
    m.react('🔍')
    
    try {
        const data = await scrapeWWCharacter(name)
        
        if (!data || !data.title) {
            m.react('❌')
            return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Karakter "${name}" tidak ditemukan`)
        }
        
        m.react('🌊')
        
        const profile = data.profile || {}
        let caption = `🌊 *ᴡᴜᴛʜᴇʀɪɴɢ ᴡᴀᴠᴇs*\n\n`
        caption += `╭┈┈⬡「 👤 *${data.title.toUpperCase()}* 」\n`
        
        if (profile.real_name) caption += `┃ 📛 ɴᴀᴍᴇ: \`${profile.real_name}\`\n`
        if (profile.class) caption += `┃ ⚔️ ᴄʟᴀss: \`${profile.class}\`\n`
        if (profile.gender) caption += `┃ 👤 ɢᴇɴᴅᴇʀ: \`${profile.gender}\`\n`
        if (profile.age) caption += `┃ 📅 ᴀɢᴇ: \`${profile.age}\`\n`
        if (profile.birthplace) caption += `┃ 🏠 ʙɪʀᴛʜᴘʟᴀᴄᴇ: \`${profile.birthplace}\`\n`
        if (profile.nation) caption += `┃ 🌍 ɴᴀᴛɪᴏɴ: \`${profile.nation}\`\n`
        if (profile.affiliations) caption += `┃ 🏰 ᴀꜰꜰɪʟɪᴀᴛɪᴏɴ: \`${profile.affiliations}\`\n`
        
        caption += `╰┈┈⬡\n\n`
        
        if (profile.english || profile.japanese) {
            caption += `🎤 *ᴠᴏɪᴄᴇ ᴀᴄᴛᴏʀs*\n`
            if (profile.english) caption += `> 🇺🇸 EN: \`${profile.english}\`\n`
            if (profile.japanese) caption += `> 🇯🇵 JP: \`${profile.japanese}\`\n`
            if (profile.chinese) caption += `> 🇨🇳 CN: \`${profile.chinese}\`\n`
            if (profile.korean) caption += `> 🇰🇷 KR: \`${profile.korean}\`\n`
            caption += `\n`
        }
        
        if (data.bio) {
            caption += `📜 *ʙɪᴏ*\n> ${data.bio}\n\n`
        }
        
        caption += `> 🔗 \`${data.url}\``
        
        const imageUrl = data.images?.[0] || null
        
        if (imageUrl) {
            await sock.sendMessage(m.chat, {
                image: { url: imageUrl },
                caption
            }, { quoted: m })
        } else {
            await m.reply(caption)
        }
        
    } catch (error) {
        m.react('❌')
        m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> ${error.message}`)
    }
}

export { pluginConfig as config, handler };
