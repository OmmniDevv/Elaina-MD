/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
import config from '../../config.js';
const pluginConfig = {
    name: 'getjpg',
    alias: ['lihatjpg', 'showjpg'],
    category: 'owner',
    description: 'Ambil gambar dari folder assets/images',
    usage: '.getjpg <nama_file.jpg>',
    example: '.getjpg zerotwo.jpg',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const args = m.args || []
    const fileName = args[0]?.trim()

    if (!fileName) {
        return m.reply(`❌ Gunakan:\n.getjpg <nama_file.jpg>\nContoh: .getjpg zerotwo.jpg`)
    }

    const filePath = path.join(process.cwd(), 'assets', 'images', fileName)

    if (!fs.existsSync(filePath)) {
        return m.reply(`❌ File tidak ditemukan!\n> Cek nama file dan pastikan sudah tersimpan di assets/images`)
    }

    try {
        const buffer = fs.readFileSync(filePath)
        await sock.sendMessage(m.chat, {
            image: buffer,
            caption: `📸 *Rimuru Gallery*\n\n> File: ${fileName}`,
        }, { quoted: m })

    } catch (err) {
        m.reply(`❌ *Error*: ${err.message}`)
    }
}

export { pluginConfig as config, handler };
