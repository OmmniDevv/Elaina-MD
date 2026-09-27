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
    name: 'fakesertifikat',
    alias: ['sertifikatfake', 'fakecert'],
    category: 'canvas',
    description: 'Bikin fake sertifikat penghargaan (buat konten/gaguan doang)',
    usage: '.fakesertifikat <nama> | <penghargaan>',
    example: '.fakesertifikat Rimuru | Best Darling Award',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 8,
    energi: 1,
    isEnabled: true
}

const TEMPLATE_URL = 'https://i.imgur.com/sertifikat-template.png'

async function downloadImage(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    return Buffer.from(response.data)
}

const AWARDS = [
    'Best Darling of The Year', 'Most Lovable Person', 'Outstanding Achievement',
    'Best Wife/Husband Ever', 'Most Handsome/Beautiful', 'Kindest Heart Award',
    'Best Smile Award', 'Most Loyal Friend', 'Cutest Couple Award'
]

async function generateFakeSertifikat(nama, penghargaan) {
    const templateBuffer = await downloadImage(TEMPLATE_URL)
    const template = await loadImage(templateBuffer)
    
    const canvas = createCanvas(template.width, template.height)
    const ctx = canvas.getContext('2d')
    
    ctx.drawImage(template, 0, 0)
    
    ctx.font = 'bold 22px "Times New Roman"'
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'
    
    // Nama
    ctx.fillText(nama.toUpperCase(), canvas.width / 2, 280)
    
    // Penghargaan
    ctx.font = 'bold 18px "Times New Roman"'
    ctx.fillText(penghargaan.toUpperCase(), canvas.width / 2, 360)
    
    // Tanggal
    const now = new Date()
    ctx.font = '14px "Times New Roman"'
    ctx.fillText(now.toLocaleDateString('id-ID'), canvas.width / 2, 460)
    
    // Nomor sertifikat random
    const certNo = 'CERT-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    ctx.fillText(`No: ${certNo}`, canvas.width / 2, 510)
    
    return canvas.toBuffer('image/png')
}

async function handler(m, { sock }) {
    const text = m.args.join(' ') || m.text?.trim() || ''
    
    if (!text) {
        return m.reply(
            `💕 *ғᴀᴋᴇ ꜱᴇʀᴛɪꜰɪᴋᴀᴛ* 💕\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✦ *Cara Pakai*\n` +
            `┃\n` +
            `┃   ${m.prefix}fakesertifikat <nama> | <penghargaan>\n` +
            `┃\n` +
            `┃ ✦ *Contoh*\n` +
            `┃\n` +
            `┃   ${m.prefix}fakesertifikat Rimuru | Best Darling Award\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Mau award apa darling~?\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
    }
    
    const parts = text.split('|').map(p => p.trim())
    const nama = parts[0] || 'Darling'
    let penghargaan = parts[1] || AWARDS[Math.floor(Math.random() * AWARDS.length)]
    
    m.react('💕')
    await m.reply(`⏳ *ᴘʀᴏᴄᴇꜱꜱɪɴɢ...*\n\n💗 *Rimuru:* Lagi bikin sertifikat darling~`)
    
    try {
        const imageBuffer = await generateFakeSertifikat(nama, penghargaan)
        
        await sock.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `💕 *ғᴀᴋᴇ ꜱᴇʀᴛɪꜰɪᴋᴀᴛ* 💕\n\n` +
                    `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
                    `┃ ✅ *ʙᴇʀʜᴀꜱɪʟ*\n` +
                    `┃ 👤 *ɴᴀᴍᴀ*: ${nama}\n` +
                    `┃ 🏆 *ᴘᴇɴɢʜᴀʀɢᴀᴀɴ*: ${penghargaan}\n` +
                    `┃\n` +
                    `┃ 💗 *Rimuru:* Selamat ya darling! 🗿\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        }, { quoted: m })
        
        m.react('✅')
        
    } catch (err) {
        console.error('[FakeSertifikat] Error:', err)
        m.react('💔')
        return m.reply(`💔 *ᴇʀʀᴏʀ*\n\n> ${err.message}`)
    }
}
export { pluginConfig as config, handler };