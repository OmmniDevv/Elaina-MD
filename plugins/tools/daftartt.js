/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js';
const pluginConfig = {
    name: 'daftartiktok',
    alias: ['daftartt', 'regtt'],
    category: 'stalker',
    description: 'Mendaftarkan username TikTok ke database user',
    usage: '.daftartt <username>',
    example: '.daftartt faizprst7',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

async function handler(m, { args, usedPrefix, sock }) {
    let user = global.db.data.users[m.sender]
    if (!user) return m.reply('❌ Data user tidak ditemukan!')

    // ===== INIT DATA =====
    if (!user.tiktok) {
        user.tiktok = {
            username: null,
            registered: false
        }
    }

    let username = args[0]

    if (!username) {
        return m.reply(`❌ Masukkan username TikTok!\n\nContoh:\n${usedPrefix}daftartt faizprst7`)
    }

    // bersihin @ kalau ada
    username = username.replace('@', '').trim()

    // validasi sederhana
    if (username.length < 2) {
        return m.reply('❌ Username tidak valid!')
    }

    // simpan
    user.tiktok.username = username
    user.tiktok.registered = true

    m.reply(`
✅ *BERHASIL DAFTAR TIKTOK*

👤 Username: @${username}

Sekarang kamu bisa cek akun dengan:
${usedPrefix}cekakuntt
`)
}

export { pluginConfig as config, handler };
