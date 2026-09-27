/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';

const pluginConfig = {
    name: 'deluserall',
    alias: ['deletealluser', 'hapussemua', 'delalluser', 'resetuser', 'clearuser'],
    category: 'owner',
    description: 'Hapus SEMUA user dari database (LANGSUNG HAPUS)',
    usage: '.deluserall',
    example: '.deluserall',
    isOwner: true,
    cooldown: 10,
    isEnabled: true
}

async function handler(m) {
    const db = getDatabase()
    
    const users = Object.entries(db.data.users || {})
    
    if (users.length === 0) {
        return m.reply(`❌ *Tidak ada user di database*\n\n> Database user sudah kosong, Darling~`)
    }

    const totalUsers = users.length
    let totalKoin = 0
    let totalEnergi = 0
    let totalExp = 0

    for (const [jid, user] of users) {
        totalKoin += user.koin || 0
        totalEnergi += user.energi || 0
        totalExp += user.exp || 0
    }

    // LANGSUNG HAPUS SEMUA
    db.data.users = {}
    db.save()

    let txt = `╭━━━〔 💀 *ᴢᴇʀᴏ ᴛᴡᴏ ᴍᴀꜱꜱ ᴅᴇʟᴇᴛᴇ* 💀 〕━━━⬣
│
│  ✅ *SEMUA USER BERHASIL DIHAPUS!*
│
│  📊 *ꜱᴛᴀᴛɪꜱᴛɪᴋ*
│  ├ 👥 User terhapus : *${totalUsers}*
│  ├ 💰 Total Koin   : *${totalKoin.toLocaleString('id-ID')}*
│  ├ ⚡ Total Energi  : *${totalEnergi.toLocaleString('id-ID')}*
│  └ 📈 Total Exp     : *${totalExp.toLocaleString('id-ID')}*
│
│  🩸 *Darling, database user kini kosong.*
│  🩸 *Semua data telah lenyap...*
│
│  💀 *Ketik .daftar untuk registrasi ulang*
│
╰━━━━━━━━━━━━━━━━━━━━━━━⬣`

    await m.reply(txt)
}
export { pluginConfig as config, handler };