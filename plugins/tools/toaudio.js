/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { queueFFmpeg } from '../../src/lib/elaina-ffmpeg.js'
import fs from 'fs'
import path from 'path'
const pluginConfig = {
    name: 'toaudio',
    alias: ['tomp3', 'videotoaudio', 'extractaudio'],
    category: 'tools',
    description: 'Mengubah video/voice note menjadi audio MP3',
    usage: '.toaudio (reply/caption video/vn)',
    example: '.toaudio',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    let mediaSource = null
    let downloadFn = null
    let isVideo = false
    let isPtt = false
    const selfIsVideo = m.isVideo || m.type === 'videoMessage' || m.message?.videoMessage
    const selfIsAudio = m.isAudio || m.type === 'audioMessage' || m.message?.audioMessage
    const selfIsPtt = m.message?.audioMessage?.ptt === true
    const quotedIsVideo = m.quoted && (
        m.quoted.isVideo || 
        m.quoted.type === 'videoMessage' || 
        m.quoted.mtype === 'videoMessage' ||
        m.quoted.message?.videoMessage
    )
    const quotedIsAudio = m.quoted && (
        m.quoted.isAudio || 
        m.quoted.type === 'audioMessage' || 
        m.quoted.mtype === 'audioMessage' ||
        m.quoted.message?.audioMessage
    )
    const quotedIsPtt = m.quoted?.message?.audioMessage?.ptt === true
    
    if (selfIsVideo) {
        mediaSource = 'self'
        downloadFn = m.download
        isVideo = true
    } else if (selfIsAudio && selfIsPtt) {
        mediaSource = 'self'
        downloadFn = m.download
        isPtt = true
    } else if (quotedIsVideo) {
        mediaSource = 'quoted'
        downloadFn = m.quoted.download
        isVideo = true
    } else if (quotedIsAudio) {
        mediaSource = 'quoted'
        downloadFn = m.quoted.download
        isPtt = quotedIsPtt
    }
    
    if (!mediaSource) {
        await m.reply(
            `❌ *ɢᴀɢᴀʟ*\n\n` +
            `> Tidak ada video/voice note yang terdeteksi!\n\n` +
            `*Cara penggunaan:*\n` +
            `> 1. Kirim video + caption \`${m.prefix}toaudio\`\n` +
            `> 2. Reply video/VN dengan \`${m.prefix}toaudio\``
        )
        return
    }
    if (!isVideo && !isPtt) {
        await m.reply(
            `⚠️ *sᴜᴅᴀʜ ᴀᴜᴅɪᴏ*\n\n` +
            `> Media ini sudah dalam format audio.\n` +
            `> Gunakan \`${m.prefix}tovn\` jika ingin mengubah ke voice note.`
        )
        return
    }

    await m.reply(`🕕 *ᴍᴇᴍᴘʀᴏsᴇs...*\n\n> Mengekstrak audio dari media...`)

    const tempDir = path.join(process.cwd(), 'temp')
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

    const ext = isVideo ? 'mp4' : 'ogg'
    const inputPath = path.join(tempDir, `input_${Date.now()}.${ext}`)
    const outputPath = path.join(tempDir, `audio_${Date.now()}.mp3`)

    try {
        const buffer = await downloadFn()

        if (!buffer || buffer.length === 0) {
            await m.reply(
                `❌ *ɢᴀɢᴀʟ*\n\n` +
                `> Tidak dapat mengunduh media.\n` +
                `> Media mungkin sudah tidak tersedia.`
            )
            return
        }

        fs.writeFileSync(inputPath, buffer)

        await queueFFmpeg(`ffmpeg -y -i "${inputPath}" -vn -ar 44100 -ac 2 -b:a 192k "${outputPath}"`)

        if (!fs.existsSync(outputPath)) {
            await m.reply(
                `❌ *ᴋᴏɴᴠᴇʀsɪ ɢᴀɢᴀʟ*\n\n` +
                `> Gagal mengekstrak audio dari media.\n` +
                `> Pastikan ffmpeg terinstall dengan benar.`
            )
            return
        }

        const audioBuffer = fs.readFileSync(outputPath)

        await sock.sendMedia(m.chat, audioBuffer, null, m, {
            type: 'audio'
        })

    } catch (error) {
        await m.reply(
            `❌ *ᴇʀʀᴏʀ*\n\n` +
            `> Terjadi kesalahan saat memproses.\n` +
            `> _${error.message}_`
        )
    } finally {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
    }
}

export { pluginConfig as config, handler }