/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';

const config = {
    name: 'setlimitpremium',
    alias: ['setlimitprem', 'premlimit'],
    category: 'owner',
    description: 'Mengubah default limit premium',
    usage: '.setlimitpremium 50',
    example: '.setlimitpremium 50',
    isOwner: true,
    cooldown: 3
}

async function handler(m, { text }) {

    // ambil angka manual
    let newLimit = parseInt(text)

    // validasi
    if (!text || isNaN(newLimit)) {
        return m.reply(`❌ *FORMAT SALAH*

📌 *Penggunaan:*
.setlimitpremium <jumlah>

📌 *Contoh:*
.setlimitpremium 50

💡 Gunakan:
• Angka biasa → limit normal
• -1 → unlimited ♾️`)
    }

    // validasi limit
    if (newLimit < -1) {
        return m.reply('❌ Limit tidak valid')
    }

    try {

        // path config
        const configPath = path.join(process.cwd(), 'config.js')

        // cek file
        if (!fs.existsSync(configPath)) {
            return m.reply('❌ File config.js tidak ditemukan')
        }

        // baca config
        let content = fs.readFileSync(configPath, 'utf8')

        // regex premium
        const regex = /premium:\s*(-?\d+)/

        // cek regex
        if (!regex.test(content)) {
            return m.reply(`❌ Gagal menemukan:

premium:

di config.js 🗿`)
        }

        // ambil limit lama
        let oldLimit = content.match(regex)[1]

        // replace limit
        let newContent = content.replace(
            regex,
            `premium: ${newLimit}`
        )

        // save
        fs.writeFileSync(configPath, newContent)

        // format
        let oldText = oldLimit == -1
            ? '♾️ Unlimited'
            : oldLimit

        let newText = newLimit == -1
            ? '♾️ Unlimited'
            : newLimit

        // sukses
        m.reply(`✅ *LIMIT PREMIUM BERHASIL DIUBAH*

┌──────────────⬣
│ 💎 *Premium Limit*
├──────────────
│ 📌 Sebelum : ${oldText}
│ ✨ Sesudah : ${newText}
└──────────────⬣

📂 *File:*
config.js

🛠️ *Status:*
Berhasil update default premium limit

💡 *Catatan:*
• Perubahan berlaku setelah reset limit
• Gunakan -1 untuk unlimited 🗿`)

    } catch (err) {

        console.log(err)

        m.reply(`❌ *TERJADI ERROR*

📌 Pesan:
${err.message}`)
    }
}
export { config, handler };