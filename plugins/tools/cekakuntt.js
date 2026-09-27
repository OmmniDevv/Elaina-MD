/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import config from '../../config.js';
const pluginConfig = {
    name: 'cektiktok',
    alias: ['cekakuntt', 'cektt', 'cektiktok'],
    category: 'stalker',
    description: 'Cek informasi akun TikTok (terdaftar atau manual)',
    usage: '.cektt <username>',
    example: '.cektt faizprst7',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true
}

async function handler(m, { args, usedPrefix, sock }) {
    let user = global.db.data.users[m.sender]
    if (!user) return m.reply('❌ Data user tidak ditemukan!')

    // ===== INIT =====
    if (!user.tiktok) {
        user.tiktok = {
            username: null,
            registered: false
        }
    }

    // ===== AMBIL USERNAME =====
    let username = args[0] || user.tiktok.username

    if (!username) {
        return m.reply(`❌ Kamu belum daftar!\n\nGunakan:\n${usedPrefix}daftartt username`)
    }

    // bersihin @ kalau ada
    username = username.replace('@', '').trim()

    try {
        let url = `https://api.deline.web.id/stalker/ttstalk?username=${username}`
        let res = await axios.get(url)

        if (!res.data.status) {
            return m.reply('❌ Gagal mengambil data!')
        }

        let u = res.data.result.user
        let s = res.data.result.stats

        // ===== FORMAT TEXT =====
        let teks = `
╭━━━〔 📱 *INFO AKUN TIKTOK* 〕━━━⬣

┃ 👤 *Username* : @${u.uniqueId}
┃ 📛 *Nama*     : ${u.nickname}
┃ 🌍 *Region*   : ${u.region}
┃ ✔️ *Verified* : ${u.verified ? '✅ Ya' : '❌ Tidak'}
┃ 🔒 *Privasi*  : ${u.privateAccount ? '🔐 Private' : '🌐 Publik'}

┣━━━〔 📊 *STATISTIK* 〕━━━⬣

┃ 👥 *Followers* : ${s.followerCount.toLocaleString()}
┃ ➡️ *Following* : ${s.followingCount.toLocaleString()}
┃ ❤️ *Likes*     : ${s.heartCount.toLocaleString()}
┃ 🎬 *Video*     : ${s.videoCount.toLocaleString()}

┣━━━〔 📝 *BIO* 〕━━━⬣

${u.signature ? u.signature : 'Tidak ada bio'}

╰━━━〔 ⚡ Data TikTok 〕━━━⬣
`

        // ===== KIRIM =====
        await sock.sendMessage(m.chat, {
            image: { url: u.avatarLarger },
            caption: teks
        }, { quoted: m })

    } catch (error) {
        console.error('Cek TikTok Error:', error)
        await m.reply('❌ Terjadi error saat mengambil data!\n\n> ' + error.message)
    }
}

export { pluginConfig as config, handler };
