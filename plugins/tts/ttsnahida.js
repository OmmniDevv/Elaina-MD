/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
const pluginConfig = {
    name: 'ttsnahida',
    alias: ['nahidatts'],
    category: 'tts',
    description: 'Text to Speech dengan suara Nahida',
    usage: '.ttsnahida <text>',
    example: '.ttsnahida Halo traveler!',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 15,
    energi: 1,
    isEnabled: true
}

async function convertToOpus(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-i', inputPath,
            '-c:a', 'libopus',
            '-b:a', '64k',
            '-vbr', 'on',
            '-compression_level', '10',
            '-y',
            outputPath
        ])
        ffmpeg.on('close', (code) => code === 0 ? resolve(true) : reject(new Error(`FFmpeg error`)))
        ffmpeg.on('error', reject)
    })
}

async function handler(m, { sock }) {
    const text = m.text?.trim()
    
    if (!text) {
        return m.reply(`🎤 *ɴᴀʜɪᴅᴀ ᴛᴛs*\n\n> Gunakan: \`${m.prefix}ttsnahida <text>\``)
    }
    
    m.react('🌿')
    
    try {
        const res = await axios.get(`https://api.emiliabot.my.id/tools/text-to-speech?text=${encodeURIComponent(text)}`, { timeout: 60000 })
        
        const voice = res.data?.result?.find(v => v.nahida && !v.error)
        if (!voice) {
            m.react('❌')
            return m.reply(`❌ Nahida voice error. Coba \`${m.prefix}ttsgoku\` atau \`${m.prefix}ttsnami\``)
        }
        
        const tempDir = path.join(process.cwd(), 'temp')
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })
        
        const wavPath = path.join(tempDir, `tts_${Date.now()}.wav`)
        const opusPath = path.join(tempDir, `tts_${Date.now()}.ogg`)
        
        const audioRes = await axios.get(voice.nahida, { responseType: 'arraybuffer' })
        fs.writeFileSync(wavPath, Buffer.from(audioRes.data))
        await convertToOpus(wavPath, opusPath)
        
        await sock.sendMessage(m.chat, {
            audio: fs.readFileSync(opusPath),
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                externalAdReply: {
                    title: '🌿 Nahida TTS',
                    body: text.substring(0, 50),
                    thumbnailUrl: 'https://i.ibb.co/5xK7QnW/tts.png',
                    mediaType: 2
                }
            }
        }, { quoted: m })
        
        fs.unlinkSync(wavPath)
        fs.unlinkSync(opusPath)
        m.react('✅')
        
    } catch (err) {
        m.react('❌')
        m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> ${err.message}`)
    }
}

export { pluginConfig as config, handler };
