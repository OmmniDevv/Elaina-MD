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
    name: 'ganti-rimuru-promote.jpg',
    alias: ['gantirimurupromote', 'setrimurupromote'],
    category: 'owner',
    description: 'Ganti gambar rimuru-promote.jpg',
    usage: '.ganti-rimuru-promote.jpg (reply/kirim gambar)',
    example: '.ganti-rimuru-promote.jpg',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const isImage = m.isImage || (m.quoted && m.quoted.type === 'imageMessage')
    if (!isImage) return m.reply(`🖼️ *ɢᴀɴᴛɪ RIMURU-PROMOTE.JPG*\n\n> Kirim/reply gambar untuk mengganti\n> File: assets/images/rimuru-promote.jpg`)
    try {
        let buffer = m.quoted && m.quoted.isMedia ? await m.quoted.download() : await m.download()
        if (!buffer) return m.reply('❌ Gagal mendownload gambar')
        await m.reply(`⏳ Sedang mengupload gambar...`)
        try {
            const newUrl = await updateAssetUrl('rimuru-promote', buffer, 'rimuru-promote.jpg')
            m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Gambar rimuru-promote.jpg telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
        } catch (e) {
            m.reply(`❌ Gagal mengupload gambar: ${e.message}`)
        }
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }