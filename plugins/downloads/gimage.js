/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import config from '../../config.js';
const pluginConfig = {
    name: 'gimage',
    alias: ['googleimage', 'image'],
    category: 'downloads',
    description: 'Mencari dan mendownload gambar dari Google',
    usage: '.gimage [nama gambar]',
    example: '.gimage pemandangan aesthetic',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 3,
    isEnabled: true
}

async function handler(m, { sock, text }) {
    if (!text) return m.reply(`⚠️ *Input Salah*\n\nPenggunaan: *${pluginConfig.usage}*\nContoh: ${pluginConfig.example}`)

    await m.reply('⏳ *Sedang mencari gambar...*')

    try {
        // Menggunakan public scrapper API untuk mengambil gambar dari Google Images
        const response = await axios.get(`https://api.vreden.web.id/api/gimage?query=${encodeURIComponent(text)}`)
        
        // Memastikan struktur response API valid
        if (!response.data || response.data.status !== 200 || !response.data.result) {
            return await m.reply('❌ Gambar tidak ditemukan atau API sedang gangguan.')
        }

        const images = response.data.result
        if (images.length === 0) return await m.reply('❌ Tidak ada hasil gambar.')

        // Mengambil gambar pertama secara acak dari 3 hasil teratas agar lebih bervariasi
        const randomIndex = Math.floor(Math.random() * Math.min(images.length, 3))
        const imageUrl = images[randomIndex]

        // Mengirimkan gambar menggunakan socket Baileys bawaan bot-mu
        await sock.sendMessage(m.chat, { 
            image: { url: imageUrl }, 
            caption: `✨ *Hasil Pencarian Gambar:* "${text}"` 
        }, { quoted: m })

    } catch (error) {
        console.error('Google Image Plugin Error:', error)
        await m.reply(`❌ *GAGAL*\n\n> ${error.message}`)
    }
}

export { pluginConfig as config, handler };
