/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import sharp from 'sharp';
import config from '../../config.js';
const pluginConfig = {
    name: 'burik',
    alias: ['rusak', 'jelek'],
    category: 'fun',
    description: 'Membuat foto menjadi burik/rusak',
    usage: '.burik (reply foto)',
    example: '.burik (reply foto)',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    try {
        const isQuotedImage = m.isQuoted && m.quoted?.isImage
        const isDirectImage = m.isImage

        if (!isQuotedImage && !isDirectImage) {
            return await m.reply('❗ Reply atau kirim sebuah foto terlebih dahulu!')
        }

        await m.reply('⏳ Sedang memproses foto...')

        const target = isQuotedImage ? m.quoted : m
        const buffer = await target.download()
        if (!buffer) return await m.reply('❌ Gagal mengunduh foto!')

        const resultBuffer = await sharp(buffer)
            .resize({ width: 100, height: 100, fit: 'inside' })
            .jpeg({ quality: 15 })
            .toBuffer()
        await m.replyImage(resultBuffer, '📸 Foto burik berhasil dibuat!')

    } catch (error) {
        console.error('Burik Plugin Error:', error)
        await m.reply(`❌ *GAGAL*\n\n> ${error.message}`)
    }
}

export { pluginConfig as config, handler };
