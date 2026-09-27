/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import ytdl from 'ytdl-core';
import yts from 'yt-search';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
// plugins/play-zero.js

const pluginConfig = {
    name: 'play-zero',
    alias: ['playzero', 'pz', 'lagu'],
    category: 'music',
    description: 'Download & putar audio dari YouTube langsung (tanpa API)',
    usage: '.play-zero <judul lagu>',
    example: '.play-zero multo',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 15,
    energi: 2,
    isEnabled: true
}

const tempDir = path.join(__dirname, '../../temp')
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

// Fungsi download audio dari YouTube
async function downloadAudio(url, title) {
    return new Promise(async (resolve, reject) => {
        try {
            const ts = Date.now()
            const outputPath = path.join(tempDir, `${ts}_${title.replace(/[^\w\s]/gi, '')}.mp3`)
            
            const stream = ytdl(url, {
                filter: 'audioonly',
                quality: 'highestaudio',
                requestOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                }
            })
            
            const writeStream = fs.createWriteStream(outputPath)
            
            stream.pipe(writeStream)
            
            writeStream.on('finish', () => {
                const audioBuffer = fs.readFileSync(outputPath)
                fs.unlinkSync(outputPath) // hapus file temp setelah dibaca
                resolve(audioBuffer)
            })
            
            writeStream.on('error', reject)
            stream.on('error', reject)
            
        } catch (err) {
            reject(err)
        }
    })
}

async function handler(m, { sock }) {
    const query = m.text?.trim()
    
    if (!query) {
        return m.reply(`🎵 *PLAY ZERO*\n\n> Contoh: ${m.prefix}play-zero multo\n> Contoh: ${m.prefix}play-zero https://youtube.com/watch?v=xxxxx`)
    }
    
    await m.react('🎧')
    
    try {
        await m.reply('🎵 *Rimuru:* Darling~ lagi nyari lagunya ya... tunggu sebentar 🦋')
        
        let videoUrl, videoInfo
        
        // Cek apakah input berupa URL atau keyword
        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            videoUrl = query
            videoInfo = await ytdl.getInfo(videoUrl)
        } else {
            // Cari di YouTube
            const searchResult = await yts(query)
            if (!searchResult.videos.length) {
                throw new Error('Lagu tidak ditemukan')
            }
            videoUrl = searchResult.videos[0].url
            videoInfo = await ytdl.getInfo(videoUrl)
        }
        
        const title = videoInfo.videoDetails.title
        const duration = videoInfo.videoDetails.lengthSeconds
        const views = videoInfo.videoDetails.viewCount
        const channel = videoInfo.videoDetails.author.name
        const thumbnail = videoInfo.videoDetails.thumbnails.pop().url
        
        // Konversi durasi
        const durationMin = Math.floor(duration / 60)
        const durationSec = duration % 60
        const durationText = `${durationMin}:${durationSec.toString().padStart(2, '0')}`
        
        // Format view count
        const viewText = new Intl.NumberFormat('id-ID').format(views)
        
        // Kirim pesan proses
        await m.reply(`📥 *Downloading:* ${title}\n⏱️ *Durasi:* ${durationText}\n\nTunggu bentar lagi ya darling~`)
        
        // Download audio
        const audioBuffer = await downloadAudio(videoUrl, title)
        
        // Kirim gambar cover + caption
        const caption = `🎵 *${title}*\n\n` +
            `👤 *Artist:* ${channel}\n` +
            `⏱️ *Duration:* ${durationText}\n` +
            `👁️ *Views:* ${viewText}\n\n` +
            `🦋 *Rimuru:* Selamat menikmati darling~ jangan lupa putar ulang kalo suka! 💕`
        
        // Kirim gambar dulu
        await sock.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: caption
        }, { quoted: m })
        
        // Kirim audionya
        await sock.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: `${title}.mp3`
        }, { quoted: m })
        
        await m.react('✅')
        
    } catch (err) {
        console.error('[PlayZero]', err)
        await m.react('❌')
        
        let errorMsg = err.message || String(err)
        
        if (errorMsg.includes('getaddrinfo') || errorMsg.includes('ENOTFOUND')) {
            await m.reply(`❌ *Error:* Koneksi internet bermasalah, coba lagi ya darling~ 🗿`)
        } else if (errorMsg.includes('signature')) {
            await m.reply(`❌ *Error:* YouTube lagi update, coba lagi nanti ya darling~ 🦋`)
        } else {
            await m.reply(`❌ *Error:* ${errorMsg.substring(0, 100)}\n\n> Coba lagi nanti ya darling~`)
        }
    }
}

export { pluginConfig as config, handler };
