/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage } from '@napi-rs/canvas';
import axios from 'axios';
import config from '../../config.js';

const pluginConfig = {
    name: 'fakeatm',
    alias: ['atmfake', 'kartuatm', 'fakecardatm'],
    category: 'canvas',
    description: 'Bikin fake kartu ATM (buat konten/gaguan doang)',
    usage: '.fakeatm <nama> | <bank>',
    example: '.fakeatm Rimuru | BCA',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

const TEMPLATE_URL = 'https://i.imgur.com/atm-template.png'

async function downloadImage(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    return Buffer.from(response.data)
}

async function generateFakeATM(nama, bank) {
    const templateBuffer = await downloadImage(TEMPLATE_URL)
    const template = await loadImage(templateBuffer)
    
    const canvas = createCanvas(template.width, template.height)
    const ctx = canvas.getContext('2d')
    
    ctx.drawImage(template, 0, 0)
    
    ctx.font = 'bold 14px "Arial"'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'left'
    
    ctx.fillText(bank.toUpperCase(), 50, 80)
    
    ctx.font = 'bold 16px "Arial"'
    ctx.fillText(nama.toUpperCase(), 50, 180)
    
    const cardNo = '**** **** **** ' + Math.floor(Math.random() * 10000)
    ctx.font = '18px "Arial"'
    ctx.fillText(cardNo, 50, 230)
    
    const expired = `Valid Thru: ${Math.floor(Math.random() * 12 + 1)}/${new Date().getFullYear() + 5}`
    ctx.font = '10px "Arial"'
    ctx.fillText(expired, 50, 260)
    
    return canvas.toBuffer('image/png')
}

async function handler(m, { sock }) {
    const text = m.args.join(' ') || m.text?.trim() || ''
    if (!text) return m.reply(`*Cara pakai:*\n${m.prefix}fakeatm <nama> | <bank>\nContoh: .fakeatm Rimuru | BCA`)
    
    const parts = text.split('|').map(p => p.trim())
    const nama = parts[0] || 'Darling'
    const bank = parts[1] || 'BCA'
    
    m.react('💕')
    await m.reply(`⏳ *Processing...*`)
    
    try {
        const imageBuffer = await generateFakeATM(nama, bank)
        await sock.sendMessage(m.chat, { image: imageBuffer, caption: `💕 *FAKE KARTU ATM* 💕\n\n✅ Nama: ${nama}\n🏦 Bank: ${bank}\n\n💗 *Rimuru:* Saldo nya banyak ya darling~ 🗿` }, { quoted: m })
        m.react('✅')
    } catch (err) {
        m.react('💔')
        m.reply(`Error: ${err.message}`)
    }
}
export { pluginConfig as config, handler };