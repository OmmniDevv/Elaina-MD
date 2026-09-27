/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { f } from '../../src/lib/elaina-http.js'
const pluginConfig = {
    name: 'bocil',
    alias: ['bocilvid'],
    category: 'asupan',
    description: 'Video bocil',
    usage: '.bocil',
    example: '.bocil',
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
    m.react('🕕')
    
    try {
        const data = loadJsonData('bocil.json')
        
        if (data.length === 0) {
            m.react('❌')
            return m.reply(`❌ Data tidak tersedia`)
        }
        
        const item = data[Math.floor(Math.random() * data.length)]
        
        await sock.sendMedia(m.chat, item.url, null, m, {
            type: 'video'
        })
        m.react('✅')
        
    } catch (error) {
        m.react('❌')
        m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> Video tidak ditemukan`)
    }
}

export { pluginConfig as config, handler }
