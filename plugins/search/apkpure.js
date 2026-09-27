/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const pluginConfig = {
    name: 'apkpure',
    alias: ['apkp'],
    category: 'search',
    description: 'Cari APK di ApkPure',
    usage: '.apkpure <query>',
    example: '.apkpure WhatsApp',
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
            `> \`${m.prefix}apkpure <query>\`\n\n` +
            `> Contoh:\n` +
            `> \`${m.prefix}apkpure WhatsApp\``
        )
    }
    
    try {
        const res = await axios.get(`https://api.nekolabs.web.id/dsc/apkpure/search?q=${encodeURIComponent(query)}`)
        
        if (!res.data?.success || !res.data?.result?.length) {
            return m.reply(`❌ Tidak ditemukan hasil untuk: ${query}`)
        }
        
        const apps = res.data.result.slice(0, 5)
        
        let txt = `📱 *ᴀᴘᴋᴘᴜʀᴇ sᴇᴀʀᴄʜ*\n\n`
        txt += `> Query: *${query}*\n\n`
        
        apps.forEach((a, i) => {
            txt += `*${i + 1}.* \`\`\`${a.name}\`\`\`\n`
            txt += `   ├ 📦 \`${a.package}\`\n`
            txt += `   ├ 📥 \`${a.installed}\`\n`
            txt += `   ├ ⭐ \`${a.score}/10\`\n`
            txt += `   ├ 🏷️ \`v${a.version}\`\n`
            txt += `   └ 🔗 \`${a.url}\`\n\n`
        })
        
        return m.reply(txt.trim())
        
    } catch (err) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> ${err.message}`)
    }
}
export { pluginConfig as config, handler };