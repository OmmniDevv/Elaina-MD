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
    name: 'bratgura',
    alias: ['bratanimegura', 'bratgura', 'bratganime'],
    category: 'sticker',
    description: 'Membuat sticker anime chibi dengan teks brat style',
    usage: '.bratanime4 <text>',
    example: '.bratanime4 Besok cenin',
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

function getWrappedLines(ctx, text, maxWidth) {
    const words = text.split(' ')
    const lines = []
    let currentLine = ''

    for (const word of words) {
        if (ctx.measureText(word).width > maxWidth) {
            if (currentLine) { lines.push(currentLine); currentLine = '' }
            let charLine = ''
            for (const char of word) {
                if (ctx.measureText(charLine + char).width > maxWidth) {
                    lines.push(charLine)
                    charLine = char
                } else {
                    charLine += char
                }
            }
            if (charLine) currentLine = charLine
        } else {
            const test = currentLine ? `${currentLine} ${word}` : word
            if (ctx.measureText(test).width > maxWidth && currentLine) {
                lines.push(currentLine)
                currentLine = word
            } else {
                currentLine = test
            }
        }
    }
    if (currentLine) lines.push(currentLine)
    return lines
}

async function handler(m, { sock }) {
    const text = m.args.join(' ')
    if (!text) {
        return m.reply(`🎀 *ʙʀᴀᴛᴀɴɪᴍᴇ4 sᴛɪᴄᴋᴇʀ*\n\n> Masukkan teks\n\n\`Contoh: ${m.prefix}bratanime4 Besok cenin\``)
    }

    m.react('🕕')

    try {

        const bgUrls = [
            'https://files.catbox.moe/m9teca.jpg',
            'https://litter.catbox.moe/akn5gg.jpg',
            'https://tmpfiles.org/dl/wvwAALkspgUu/file.jpg',
            'https://gofile.io/d/s5gzIu',
            'https://put.icu/s/l9b7k5sm.png',
            'https://c.termai.cc/i132/s2x.png'
        ]

        let bgImage = null
        for (const url of bgUrls) {
            try {
                const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 8000 })
                bgImage = await loadImage(Buffer.from(response.data))
                break
            } catch (e) {
                console.warn(`Bratanime4: Gagal load dari ${url}, mencoba link berikutnya...`)
            }
        }

        if (!bgImage) throw new Error('Semua link gambar gagal dimuat')

        const canvas = createCanvas(bgImage.width, bgImage.height)
        const ctx = canvas.getContext('2d')

        ctx.drawImage(bgImage, 0, 0)

        const W = bgImage.width
        const H = bgImage.height

        const textAreaX = Math.floor(W * 0.55)
        const textAreaY = Math.floor(H * 0.08)
        const textAreaW = Math.floor(W * 0.42)
        const textAreaH = Math.floor(H * 0.80)

        const padding = 10

        let fontSize = 80
        let lines = []

        while (fontSize >= 12) {
            ctx.font = `bold ${fontSize}px Arial`
            lines = getWrappedLines(ctx, text, textAreaW - padding * 2)
            const lineHeight = fontSize * 1.2
            const totalH = lines.length * lineHeight
            if (totalH <= textAreaH - padding * 2) break
            fontSize -= 2
        }

        const lineHeight = fontSize * 1.2
        const totalTextH = lines.length * lineHeight

        const startY = textAreaY + padding + (textAreaH - totalTextH) / 2 + fontSize
        const centerX = textAreaX + (textAreaW / 2)

        ctx.font = `bold ${fontSize}px Arial`
        ctx.fillStyle = '#000000'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'alphabetic'

        lines.forEach((line, i) => {
            ctx.fillText(line, centerX, startY + i * lineHeight)
        })

        const buffer = canvas.toBuffer('image/jpeg')

        await sock.sendImageAsSticker(m.chat, buffer, m, {
            packname: config.sticker.packname,
            author: config.sticker.author
        })

        m.react('✅')
    } catch (err) {
        console.error('Bratanime4 error:', err)
        m.react('❌')
        m.reply('❌ Gagal membuat sticker bratanime4, coba lagi nanti.\n> ' + err.message)
    }
}

export { pluginConfig as config, handler };
