/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
const pluginConfig = {
    name: 'santuy',
    alias: ['santuyvid'],
    category: 'asupan',
    description: 'Video santuy',
    usage: '.santuy',
    example: '.santuy',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

function loadJsonData(filename) {
    try {
        const filePath = path.join(process.cwd(), 'src', 'tiktok', filename)
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        }
    } catch {}
    return []
}

async function handler(m, { sock }) {
    m.react('⏳')
    
    try {
        const data = loadJsonData('santuy.json')
        
        if (data.length === 0) {
            m.react('❌')
            return m.reply(`❌ Data tidak tersedia`)
        }
        
        const item = data[Math.floor(Math.random() * data.length)]
        
        const res = await axios.get(item.url, { 
            responseType: 'arraybuffer',
            timeout: 60000
        })
        
        m.react('✅')
        
        await sock.sendMessage(m.chat, {
            video: Buffer.from(res.data),
            caption: `😎 *sᴀɴᴛᴜʏ*`
        }, { quoted: m })
        
    } catch (error) {
        m.react('❌')
        m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> Video tidak ditemukan`)
    }
}

export { pluginConfig as config, handler };
