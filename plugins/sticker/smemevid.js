/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs'
import path from 'path'
import os from 'os'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { createCanvas } from '@napi-rs/canvas'
import config from '../../config.js'

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

const pluginConfig = {
    name: 'smemevid',
    alias: ['smemevideo', 'memevid'],
    category: 'sticker',
    description: 'Membuat sticker meme dari video',
    usage: '.smemevid <top>|<bottom>',
    example: '.smemevid WIDTH OR HEIGHT|WHY NOT BOTH?',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 15,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const isVideo = m.isVideo || (m.quoted && m.quoted.isVideo) || (m.quoted && m.quoted.type === 'videoMessage')
    if (!isVideo) {
        return m.reply(`🎬 *ᴍᴇᴍᴇ ᴠɪᴅᴇᴏ*\n\n> Reply atau kirim video dengan caption\n\n\`Contoh: ${m.prefix}smemevid Top|Bottom\``)
    }

    const input = m.args.join(' ')
    if (!input || !input.includes('|')) {
        return m.reply(`🎬 *ᴍᴇᴍᴇ ᴠɪᴅᴇᴏ*\n\n> Format: top|bottom\n\n\`Contoh: ${m.prefix}smemevid WIDTH OR HEIGHT|WHY NOT BOTH?\``)
    }

    const [top, bottom] = input.split('|').map(s => s.trim().toUpperCase())

    m.react('🕕')

    try {
        let mediaBuffer
        if (m.quoted) {
            mediaBuffer = await m.quoted.download()
        } else if (m.download) {
            mediaBuffer = await m.download()
        }

        if (!mediaBuffer) {
            m.react('❌')
            return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Gagal mengunduh video`)
        }

        const tempId = Date.now()
        const inputVideo = path.join(os.tmpdir(), `vid-${tempId}.mp4`)
        const outputVideo = path.join(os.tmpdir(), `vid-out-${tempId}.mp4`)
        const overlayImage = path.join(os.tmpdir(), `overlay-${tempId}.png`)

        fs.writeFileSync(inputVideo, mediaBuffer)

        const getMetadata = (file) => {
            return new Promise((resolve, reject) => {
                ffmpeg.ffprobe(file, (err, metadata) => {
                    if (err) reject(err)
                    else resolve(metadata)
                })
            })
        }

        const metadata = await getMetadata(inputVideo)
        const videoStream = metadata.streams.find(s => s.codec_type === 'video')
        if (!videoStream) throw new Error('Stream video tidak ditemukan')

        const size = 512

        const canvas = createCanvas(size, size)
        const ctx = canvas.getContext('2d')

        const drawMemeText = (ctx, text, x, y, width, isBottom) => {
            if (!text) return

            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'black'
            ctx.textAlign = 'center'
            ctx.textBaseline = isBottom ? 'bottom' : 'top'
            ctx.lineJoin = 'round'

            let fontSize = Math.floor(width / 8)
            ctx.font = `bold ${fontSize}px Impact, Arial`

            while (ctx.measureText(text).width > width - 20) {
                fontSize -= 2
                ctx.font = `bold ${fontSize}px Impact, Arial`
                if (fontSize < 10) break
            }

            ctx.lineWidth = Math.floor(fontSize / 6)
            ctx.strokeText(text, x, y)
            ctx.fillText(text, x, y)
        }

        drawMemeText(ctx, top, size / 2, 10, size, false)
        drawMemeText(ctx, bottom, size / 2, size - 10, size, true)

        const bufferImage = canvas.toBuffer('image/png')
        fs.writeFileSync(overlayImage, bufferImage)

        await new Promise((resolve, reject) => {
            ffmpeg(inputVideo)
                .input(overlayImage)
                .complexFilter([
                    `[0:v]crop='min(iw,ih)':'min(iw,ih)',scale=${size}:${size},fps=8[vid]`,
                    `[vid][1:v]overlay=0:0[out]`
                ])
                .outputOptions([
                    '-map [out]',
                    '-an',
                    '-c:v libx264',
                    '-preset fast',
                    '-crf 26',
                    '-t 4'
                ])
                .save(outputVideo)
                .on('end', () => resolve())
                .on('error', (err) => reject(err))
        })

        const stickerConfig = config.sticker || { packname: 'Rimuru-AI', author: 'Bot' }

        await sock.sendVideoAsSticker(m.chat, outputVideo, m, {
            packname: stickerConfig.packname,
            author: stickerConfig.author
        })

        m.react('✅')

        try {
            fs.unlinkSync(inputVideo)
            fs.unlinkSync(outputVideo)
            fs.unlinkSync(overlayImage)
        } catch (e) { }

    } catch (error) {
        m.react('☢')
        m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Terjadi kesalahan saat memproses video`)
    }
}

export { pluginConfig as config, handler }
