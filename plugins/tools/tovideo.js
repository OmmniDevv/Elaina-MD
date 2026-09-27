/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import te from '../../src/lib/elaina-error.js'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import ffmpeg from 'fluent-ffmpeg'
ffmpeg.setFfmpegPath(ffmpegInstaller.path)

const pluginConfig = {
    name: 'tovideo',
    alias: ['tovid', 'stickertovideo', 'giftomp4', 'webmtomp4'],
    category: 'tools',
    description: 'Mengubah sticker animasi menjadi video MP4',
    usage: '.tovideo (reply/caption sticker animasi)',
    example: '.tovideo',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 8,
    energi: 2,
    isEnabled: true
}

function isAnimatedWebp(buffer) {
    if (!buffer || buffer.length < 50) return false
    return buffer.includes(Buffer.from('ANIM')) || buffer.includes(Buffer.from('ANMF'))
}

function getTempDir() {
    const tmpDir = path.join(process.cwd(), 'tmp')
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
    return tmpDir
}

async function webpToGif(buffer) {

    const meta = await sharp(buffer).metadata()
    if (!meta.pages || meta.pages <= 1) return null
    return sharp(buffer, { animated: true, pages: -1 }).gif({ loop: 0 }).toBuffer()
}

function gifToMp4(gifBuffer) {
    return new Promise((resolve, reject) => {
        const tmpDir = getTempDir()
        const ts = Date.now()
        const inputPath = path.join(tmpDir, `gif_${ts}.gif`)
        const outputPath = path.join(tmpDir, `vid_${ts}.mp4`)

        fs.writeFileSync(inputPath, gifBuffer)

        const cleanup = () => {
            try { if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath) } catch {}
            try { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath) } catch {}
        }

        const timeout = setTimeout(() => {
            cleanup()
            reject(new Error('Conversion timeout'))
        }, 60000)

        ffmpeg(inputPath)
            .inputOptions(['-y'])
            .outputOptions([
                '-movflags', 'faststart',
                '-pix_fmt', 'yuv420p',
                '-vf', "scale=trunc(iw/2)*2:trunc(ih/2)*2",
                '-c:v', 'libx264',
                '-preset', 'ultrafast',
                '-crf', '23',
                '-an'
            ])
            .toFormat('mp4')
            .on('end', () => {
                clearTimeout(timeout)
                try {
                    if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size < 100) {
                        cleanup()
                        return reject(new Error('Output file empty'))
                    }
                    const mp4Buffer = fs.readFileSync(outputPath)
                    cleanup()
                    resolve(mp4Buffer)
                } catch (err) {
                    cleanup()
                    reject(err)
                }
            })
            .on('error', (err) => {
                clearTimeout(timeout)
                cleanup()
                reject(new Error('FFmpeg: ' + err.message))
            })
            .save(outputPath)
    })
}

async function handler(m, { sock }) {
    let downloadFn = null
    const selfIsSticker = m.isSticker || m.type === 'stickerMessage' || m.message?.stickerMessage
    const quotedIsSticker = m.quoted && (
        m.quoted.isSticker ||
        m.quoted.type === 'stickerMessage' ||
        m.quoted.mtype === 'stickerMessage' ||
        m.quoted.message?.stickerMessage
    )

    if (selfIsSticker) {
        downloadFn = m.download
    } else if (quotedIsSticker) {
        downloadFn = m.quoted.download
    }

    if (!downloadFn) {
        return m.reply(
            `❌ *ɢᴀɢᴀʟ*\n\n` +
            `> Tidak ada sticker yang terdeteksi!\n\n` +
            `*Cara penggunaan:*\n` +
            `> 1. Kirim sticker + caption \`${m.prefix}tovideo\`\n` +
            `> 2. Reply sticker dengan \`${m.prefix}tovideo\``
        )
    }

    await m.react('🕕')

    try {
        const buffer = await downloadFn()

        if (!buffer || buffer.length === 0) {
            await m.react('❌')
            return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Tidak dapat mengunduh sticker.`)
        }

        const animated = isAnimatedWebp(buffer)

        if (!animated) {

            const pngBuffer = await sharp(buffer).png().toBuffer()
            await sock.sendMessage(m.chat, {
                image: pngBuffer,
                caption: `✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Sticker statis → gambar`
            }, { quoted: m })
            await m.react('✅')
            return
        }
        const gifBuffer = await webpToGif(buffer)
        if (!gifBuffer) {
            await m.react('❌')
            return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Sticker tidak bisa dikonversi (tidak animated)`)
        }

        const mp4Buffer = await gifToMp4(gifBuffer)

        if (!mp4Buffer || mp4Buffer.length < 100) {
            await m.react('❌')
            return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Video output kosong`)
        }

        await sock.sendMedia(m.chat, mp4Buffer, null, m, {
            type: 'video'
        })
        await m.react('✅')

    } catch (error) {
        console.error('[ToVideo] Error:', error.message)
        await m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }