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
    name: 'asupan',
    alias: ['asupanrandom'],
    category: 'asupan',
    description: 'Random video asupan',
    usage: '.asupan',
    example: '.asupan',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

function loadJsonData() {
    const tiktokDir = path.join(process.cwd(), 'src', 'tiktok')
    const files = ['bocil.json', 'gheayubi.json', 'kayes.json', 'notnot.json', 'panrika.json', 'santuy.json', 'tiktokgirl.json', 'ukhty.json']
    let allUrls = []
    
    for (const file of files) {
        try {
            const filePath = path.join(tiktokDir, file)
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
                allUrls = allUrls.concat(data.map(d => d.url))
            }
        } catch {}
    }
    
    return allUrls
}

async function handler(m, { sock }) {
    m.react('🕕')
    
    try {
        const urls = loadJsonData()
        
        if (urls.length === 0) {
            m.react('❌')
            return m.reply(`❌ Data asupan tidak tersedia`)
        }
        
        const url = urls[Math.floor(Math.random() * urls.length)]
        
        const res = await f(url, 'arrayBuffer')
        
        m.react('✅')
        
        await sock.sendMedia(m.chat, Buffer.from(res), null, m, {
            type: 'video'
        })
        
    } catch (error) {
        m.react('❌')
        m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> Video asupan tidak ditemukan`)
    }
}

export { pluginConfig as config, handler }
