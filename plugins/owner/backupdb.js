/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { sendStoreBackup, SCHEMA_VERSION } from '../../src/lib/elaina-store-backup.js'
const pluginConfig = {
    name: 'backupdb',
    alias: ['dbbackup', 'backupstore', 'storebackup'],
    category: 'owner',
    description: 'Backup database/store dan kirim ke owner',
    usage: '.backupdb',
    isOwner: true,
    isGroup: false,
    isEnabled: true
}

async function handler(m, { sock }) {
    const backupContents = [
        '📁 database/*.json (semua file JSON)',
        '📁 database/cpanel/* (data cPanel)',
        '📄 storage/database.json (main database)',
        '📄 db.json (root database)',
        '📄 database/main/*.json (main database)',
        '📋 backup_metadata.json (info schema)'
    ]
    
    await m.reply(
        `🕕 *Membuat backup database...*\n\n` +
        `╭┈┈⬡「 📦 *ᴀᴘᴀ ʏᴀɴɢ ᴅɪ-ʙᴀᴄᴋᴜᴘ* 」\n` +
        backupContents.map(c => `┃ ${c}`).join('\n') +
        `\n╰┈┈┈┈┈┈┈┈⬡`
    )
    
    const result = await sendStoreBackup(sock)
    
    if (result.success) {
        await m.reply(
            `✅ *Backup Berhasil!*\n\n` +
            `📦 Size: ${result.size}\n` +
            `📁 Files: ${result.files}\n` +
            `🔖 Schema: v${SCHEMA_VERSION}\n\n` +
            `> Type-safe backup, kompatibel dengan update mendatang.\n` +
            `> Backup telah dikirim ke owner utama.`
        )
    } else {
        await m.reply(`❌ Backup gagal: ${result.error}`)
    }
}

export { pluginConfig as config, handler }