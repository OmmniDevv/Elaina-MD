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
    name: 'fakesp',
    alias: ['spfake', 'suratpanggilan', 'fakesuratpanggil'],
    category: 'canvas',
    description: 'Bikin fake surat panggilan (buat konten/gaguan doang)',
    usage: '.fakesp <nama> | <instansi>',
    example: '.fakesp Rimuru | OSIS',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

const TEMPLATE_URL = 'https://i.imgur.com/sp-template.png'

async function downloadImage(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    return Buffer.from(response.data)
}

async function generateFakeSP(nama, instansi) {
    const templateBuffer = await downloadImage(TEMPLATE_URL)
    const template = await loadImage(templateBuffer)
    
    const canvas = createCanvas(template.width, template.height)
    const ctx = canvas.getContext('2d')
    
    ctx.drawImage(template, 0, 0)
    
    ctx.font = 'bold 18px "Times New Roman"'
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'
    
    ctx.fillText(nama.toUpperCase(), canvas.width / 2, 250)
    ctx.fillText(instansi.toUpperCase(), canvas.width / 2, 320)
    
    const now = new Date()
    ctx.font = '14px "Times New Roman"'
    ctx.fillText(now.toLocaleDateString('id-ID'), canvas.width / 2, 400)
    ctx.fillText('Pukul: 08.00 WIB', canvas.width / 2, 440)
    ctx.fillText('Tempat: Ruang Rapat Utama', canvas.width / 2, 480)
    
    return canvas.toBuffer('image/png')
}

async function handler(m, { sock }) {
    const text = m.args.join(' ') || m.text?.trim() || ''
    if (!text) return m.reply(`*Cara pakai:*\n${m.prefix}fakesp <nama> | <instansi>\nContoh: .fakesp Rimuru | OSIS`)
    
    const parts = text.split('|').map(p => p.trim())
    const nama = parts[0] || 'Darling'
    const instansi = parts[1] || 'OSIS'
    
    m.react('💕')
    await m.reply(`⏳ *Processing...*`)
    
    try {
        const imageBuffer = await generateFakeSP(nama, instansi)
        await sock.sendMessage(m.chat, { image: imageBuffer, caption: `💕 *FAKE SURAT PANGGILAN* 💕\n\n✅ Nama: ${nama}\n📌 Instansi: ${instansi}\n\n💗 *Rimuru:* Kamu dipanggil nih darling~` }, { quoted: m })
        m.react('✅')
    } catch (err) {
        m.react('💔')
        m.reply(`Error: ${err.message}`)
    }
}
export { pluginConfig as config, handler };