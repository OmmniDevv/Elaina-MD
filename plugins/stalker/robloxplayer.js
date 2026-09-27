/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import config from '../../config.js'
import te from '../../src/lib/elaina-error.js'
const NEOXR_APIKEY = config.APIkey?.neoxr || 'Milik-Bot-RimuruMD'

const pluginConfig = {
    name: 'robloxplayer',
    alias: ['robloxsearch', 'searchroblox', 'robloxfind'],
    category: 'stalker',
    description: 'Search Roblox player by username',
    usage: '.robloxplayer <username>',
    example: '.robloxplayer linkmon',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const query = m.text?.trim()
    
    if (!query) {
        return m.reply(
            `🎮 *ʀᴏʙʟᴏx ᴘʟᴀʏᴇʀ sᴇᴀʀᴄʜ*\n\n` +
            `> Masukkan username untuk dicari\n\n` +
            `\`${m.prefix}robloxplayer linkmon\``
        )
    }
    
    m.react('🔍')
    
    try {
        const res = await axios.get(`https://api.neoxr.eu/api/roblox-search?q=${encodeURIComponent(query)}&apikey=${NEOXR_APIKEY}`, {
            timeout: 30000
        })
        
        if (!res.data?.status || !res.data?.data?.length) {
            m.react('❌')
            return m.reply(`❌ Tidak ditemukan player dengan username: ${query}`)
        }
        
        const players = res.data.data.slice(0, 10)
        
        let text = `🎮 *ʀᴏʙʟᴏx ᴘʟᴀʏᴇʀ sᴇᴀʀᴄʜ*\n\n`
        text += `> Query: \`${query}\`\n`
        text += `> Ditemukan: *${players.length}* player\n\n`
        
        players.forEach((player, i) => {
            text += `╭┈┈⬡「 ${i + 1}. *${player.displayName}* 」\n`
            text += `┃ 🆔 ID: \`${player.id}\`\n`
            text += `┃ 👤 Username: \`${player.name}\`\n`
            text += `┃ 📛 Display: *${player.displayName}*\n`
            text += `┃ ✅ Verified: ${player.hasVerifiedBadge ? 'Ya' : 'Tidak'}\n`
            if (player.previousUsernames?.length > 0) {
                text += `┃ 📜 Previous: ${player.previousUsernames.join(', ')}\n`
            }
            text += `╰┈┈⬡\n\n`
        })
        
        text += `> _Gunakan \`.robloxstalk <username>\` untuk info detail_`
        
        await m.reply(text)
        m.react('✅')
        
    } catch (err) {
        console.error('[RobloxPlayer] Error:', err.message)
        m.react('☢')
        return m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }