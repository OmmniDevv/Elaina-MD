/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import { RIMURU_CORE_CONFIG } from "../../config.js";
import config from '../../config.js';
const pluginConfig = {
    name: 'kisahnabi',
    alias: ['nabi', 'storynabi', 'ceritanabi'],
    category: 'islamic',
    description: 'Kisah para nabi dan rasul',
    usage: '.kisahnabi <nama_nabi>',
    example: '.kisahnabi muhammad',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

const NABI_LIST = [
    'adam', 'idris', 'nuh', 'hud', 'shaleh', 'ibrahim', 'luth', 
    'ismail', 'ishaq', 'yaqub', 'yusuf', 'ayub', 'syuaib', 'musa',
    'harun', 'dzulkifli', 'daud', 'sulaiman', 'ilyas', 'ilyasa',
    'yunus', 'zakaria', 'yahya', 'isa', 'muhammad'
]

async function handler(m, { sock }) {
    try {
        const args = m.args || []
        const nabiName = args[0]?.toLowerCase()
        
        if (!nabiName) {
            let list = `📖 *ᴋɪsᴀʜ ᴘᴀʀᴀ ɴᴀʙɪ*\n\n`
            list += `╭┈┈⬡「 📋 *ᴅᴀꜰᴛᴀʀ ɴᴀʙɪ* 」\n`
            NABI_LIST.forEach((n, i) => {
                list += `┃ ${i + 1}. ${n.charAt(0).toUpperCase() + n.slice(1)}\n`
            })
            list += `╰┈┈┈┈┈┈┈┈⬡\n\n`
            list += `> Contoh: .kisahnabi muhammad`
            return m.reply(list)
        }
        
        if (!NABI_LIST.includes(nabiName)) {
            return m.reply(`❌ Nabi tidak ditemukan!\n\n> Gunakan .kisahnabi untuk melihat daftar`)
        }
        
        await m.react('📖')
        
        const apikey = config.APIkey?.lolhuman || 'APIKey-Milik-Bot-RimuruMD(RIMURU)'
        const url = `https://api.lolhuman.xyz/api/kisahnabi/${nabiName}?apikey=${apikey}`
        
        const response = await axios.get(url, { timeout: 30000 })
        const data = response.data
        
        if (data.status !== 200 || !data.result) {
            await m.react('❌')
            return m.reply(`❌ Gagal mengambil kisah nabi ${nabiName}`)
        }
        
        const result = data.result
        const saluranId = RIMURU_CORE_CONFIG.saluran?.id || config.saluran?.id
        const saluranName = RIMURU_CORE_CONFIG.saluran?.name || RIMURU_CORE_CONFIG.bot?.name || 'rimuru-AI'
        
        let story = result.story || ''
        if (story.length > 3500) {
            story = story.substring(0, 3500) + '...\n\n_(Kisah terpotong karena terlalu panjang)_'
        }
        
        let caption = `📖 *ᴋɪsᴀʜ ɴᴀʙɪ ${(result.name || nabiName).toUpperCase()}*\n\n`
        caption += `╭┈┈⬡「 📋 *ɪɴꜰᴏʀᴍᴀsɪ* 」\n`
        caption += `┃ 👤 Nama: *${result.name || nabiName}*\n`
        if (result.thn_kelahiran) caption += `┃ 📅 Lahir: *${result.thn_kelahiran}*\n`
        if (result.age) caption += `┃ ⏰ Usia: *${result.age} tahun*\n`
        if (result.place) caption += `┃ 📍 Tempat: *${result.place}*\n`
        caption += `╰┈┈┈┈┈┈┈┈⬡\n\n`
        caption += `📜 *ᴋɪsᴀʜ:*\n${story}\n\n`
        caption += `> 📖 Semoga bermanfaat`
        
        await m.react('✅')
        
        await sock.sendMessage(m.chat, {
            text: caption,
            contextInfo: {
                forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: saluranId,
                    newsletterName: saluranName,
                    serverMessageId: 127
                }
            }
        }, { quoted: m })
        
    } catch (err) {
        await m.react('❌')
        if (err.response?.status === 403) {
            return m.reply(`❌ *API Key tidak valid atau limit tercapai*`)
        }
        return m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> ${err.message}`)
    }
}

export { pluginConfig as config, handler };
