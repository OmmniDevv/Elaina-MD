/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import config from '../../config.js';

const pluginConfig = {
    name: 'fakepaspor',
    alias: ['pasporfake', 'fakepassport'],
    category: 'canvas',
    description: 'Bikin fake paspor (buat konten/gaguan doang)',
    usage: '.fakepaspor <nama> | <umur> | <negara>',
    example: '.fakepaspor Rimuru | 20 | Jepang',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 8,
    energi: 1,
    isEnabled: true
}

const TEMPLATE_URL = 'https://i.imgur.com/JZqRkYp.png'

async function downloadImage(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    return Buffer.from(response.data)
}

function formatTanggal() {
    const now = new Date()
    return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
}

function formatExpired() {
    const now = new Date()
    now.setFullYear(now.getFullYear() + 5)
    return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
}

async function generateFakePaspor(nama, umur, negara) {
    const templateBuffer = await downloadImage(TEMPLATE_URL)
    const template = await loadImage(templateBuffer)
    
    const canvas = createCanvas(template.width, template.height)
    const ctx = canvas.getContext('2d')
    
    ctx.drawImage(template, 0, 0)
    
    // Setting font
    ctx.font = 'bold 20px "Arial"'
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'left'
    
    // Nama
    ctx.fillText(nama.toUpperCase(), 180, 210)
    
    // Negara
    ctx.fillText(negara.toUpperCase(), 180, 250)
    
    // Umur
    ctx.fillText(umur.toString(), 180, 290)
    
    // Tanggal terbit & expired
    ctx.font = '16px "Arial"'
    ctx.fillText(formatTanggal(), 180, 340)
    ctx.fillText(formatExpired(), 180, 380)
    
    // Nomor paspor random
    const passportNo = 'X' + Math.random().toString(36).substring(2, 10).toUpperCase()
    ctx.font = 'bold 18px "Arial"'
    ctx.fillText(passportNo, 500, 450)
    
    return canvas.toBuffer('image/png')
}

async function handler(m, { sock }) {
    const text = m.args.join(' ') || m.text?.trim() || ''
    
    if (!text) {
        return m.reply(
            `💕 *ғᴀᴋᴇ ᴘᴀꜱᴘᴏʀ* 💕\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✦ *Cara Pakai*\n` +
            `┃\n` +
            `┃   ${m.prefix}fakepaspor <nama> | <umur> | <negara>\n` +
            `┃\n` +
            `┃ ✦ *Contoh*\n` +
            `┃\n` +
            `┃   ${m.prefix}fakepaspor Rimuru | 20 | Jepang\n` +
            `┃   ${m.prefix}fakepaspor Darling | 18 | Indonesia\n` +
            `┃\n` +
            `┃ ⚠️ *Peringatan!*\n` +
            `┃   Fitur ini cuma buat konten/gaguan\n` +
            `┃   JANGAN dipakai buat hal ilegal!\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Mau bikin paspor palsu siapa darling~?\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
    }
    
    const parts = text.split('|').map(p => p.trim())
    const nama = parts[0] || 'Darling'
    const umur = parts[1] || '20'
    const negara = parts[2] || 'Indonesia'
    
    if (nama.length > 30) {
        return m.reply(`💔 *ᴇʀʀᴏʀ*\n\n> Nama terlalu panjang darling~ maksimal 30 karakter 🥺`)
    }
    
    m.react('💕')
    await m.reply(`⏳ *ᴘʀᴏᴄᴇꜱꜱɪɴɢ...*\n\n💗 *Rimuru:* Lagi bikin fake paspor darling~ tunggu sebentar yaa 🎨`)
    
    try {
        const imageBuffer = await generateFakePaspor(nama, umur, negara)
        
        await sock.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `💕 *ғᴀᴋᴇ ᴘᴀꜱᴘᴏʀ* 💕\n\n` +
                    `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
                    `┃ ✅ *ʙᴇʀʜᴀꜱɪʟ*\n` +
                    `┃\n` +
                    `┃ 👤 *ɴᴀᴍᴀ*: ${nama}\n` +
                    `┃ 🎂 *ᴜᴍᴜʀ*: ${umur} tahun\n` +
                    `┃ 🏳️ *ɴᴇɢᴀʀᴀ*: ${negara}\n` +
                    `┃\n` +
                    `┃ ⚠️ *Cuma buat konten!*\n` +
                    `┃ 💗 *Rimuru:* Ini paspornya darling~ jangan dipake beneran ya! 🗿\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        }, { quoted: m })
        
        m.react('✅')
        
    } catch (err) {
        console.error('[FakePaspor] Error:', err)
        m.react('💔')
        return m.reply(
            `💔 *ᴇʀʀᴏʀ*\n\n` +
            `> ${err.message}\n\n` +
            `> Coba lagi ya darling~ 🥺`
        )
    }
}
export { pluginConfig as config, handler };