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
    name: 'fakekartupelajar',
    alias: ['kartupelajarfake', 'fakestudentid', 'fakekps'],
    category: 'canvas',
    description: 'Bikin fake kartu pelajar (buat konten/gaguan doang)',
    usage: '.fakekartupelajar <nama> | <sekolah>',
    example: '.fakekartupelajar Rimuru | SMA Negeri 02',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

const TEMPLATE_URL = 'https://i.imgur.com/kartupelajar-template.png'

async function downloadImage(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    return Buffer.from(response.data)
}

async function generateFakeKartuPelajar(nama, sekolah) {
    const templateBuffer = await downloadImage(TEMPLATE_URL)
    const template = await loadImage(templateBuffer)
    
    const canvas = createCanvas(template.width, template.height)
    const ctx = canvas.getContext('2d')
    
    ctx.drawImage(template, 0, 0)
    
    ctx.font = 'bold 12px "Arial"'
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'
    
    ctx.fillText(nama.toUpperCase(), canvas.width / 2, 160)
    ctx.fillText(sekolah.toUpperCase(), canvas.width / 2, 190)
    
    const nisn = Math.floor(Math.random() * 10000000000)
    ctx.font = '10px "Arial"'
    ctx.fillText(`NISN: ${nisn}`, canvas.width / 2, 230)
    
    return canvas.toBuffer('image/png')
}

async function handler(m, { sock }) {
    const text = m.args.join(' ') || m.text?.trim() || ''
    if (!text) return m.reply(`*Cara pakai:*\n${m.prefix}fakekartupelajar <nama> | <sekolah>\nContoh: .fakekartupelajar Rimuru | SMA 02`)
    
    const parts = text.split('|').map(p => p.trim())
    const nama = parts[0] || 'Darling'
    const sekolah = parts[1] || 'SMA Negeri Zero'
    
    m.react('💕')
    await m.reply(`⏳ *Processing...*`)
    
    try {
        const imageBuffer = await generateFakeKartuPelajar(nama, sekolah)
        await sock.sendMessage(m.chat, { image: imageBuffer, caption: `💕 *FAKE KARTU PELAJAR* 💕\n\n✅ Nama: ${nama}\n🏫 Sekolah: ${sekolah}\n\n💗 *Rimuru:* Ini kartu pelajarnya darling~` }, { quoted: m })
        m.react('✅')
    } catch (err) {
        m.react('💔')
        m.reply(`Error: ${err.message}`)
    }
}
export { pluginConfig as config, handler };