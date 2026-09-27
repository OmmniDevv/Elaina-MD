/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs'
import path from 'path'
import te from '../../src/lib/elaina-error.js'
import { updateAssetUrl } from '../../src/lib/elaina-uploader.js'
const pluginConfig = {
    name: 'ganti-rimuru.mp3',
    alias: ['gantirimuruaudio', 'setrimuruaudio'],
    category: 'owner',
    description: 'Ganti audio rimuru.mp3',
    usage: '.ganti-rimuru.mp3 (reply/kirim audio)',
    example: '.ganti-rimuru.mp3',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const isAudio = m.type === 'audioMessage' || (m.quoted && m.quoted.type === 'audioMessage')
    
    if (!isAudio) {
        return m.reply(`🎵 *ɢᴀɴᴛɪ ᴏᴜʀɪɴ.ᴍᴘ3*\n\n> Kirim/reply audio untuk mengganti\n> File: assets/audio/rimuru.mp3`)
    }
    
    try {
        let buffer
        if (m.quoted && m.quoted.isMedia) {
            buffer = await m.quoted.download()
        } else if (m.isMedia) {
            buffer = await m.download()
        }
        
        if (!buffer) {
            return m.reply(`❌ Gagal mendownload audio`)
        }
        
        await m.reply(`⏳ Sedang mengupload gambar...`)
        try {
            const newUrl = await updateAssetUrl('rimuru-mp3', buffer, 'rimuru.mp3')
            m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> File rimuru.mp3 telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
        } catch (e) {
            m.reply(`❌ Gagal mengupload file: ${e.message}`)
        }
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }