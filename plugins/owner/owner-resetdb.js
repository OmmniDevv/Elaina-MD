// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

if (!global.resetDbPending) global.resetDbPending = {}

let handler = async (m, { conn, usedPrefix, command, args }) => {
    const confirm = (args[0] || '').trim().toLowerCase()

    if (confirm !== 'confirm') {
        global.resetDbPending[m.sender] = Date.now()
        return conn.reply(m.chat,
            `⚠️ *PERINGATAN!*\n\n` +
            `Ini akan menghapus SEMUA data:\n` +
            `• Data users\n` +
            `• Data chats\n` +
            `• Data settings\n` +
            `• Data stats\n\n` +
            `Ketik: *${usedPrefix}${command} confirm*\ndalam 60 detik untuk melanjutkan.\n\n` +
            `❌ Aksi ini TIDAK BISA dibatalkan!`,
        m)
    }

    const pending = global.resetDbPending[m.sender]
    if (!pending || (Date.now() - pending) > 60000) {
        delete global.resetDbPending[m.sender]
        return conn.reply(m.chat, `❌ Timeout! Ketik *${usedPrefix}${command}* ulang untuk memulai.`, m)
    }

    delete global.resetDbPending[m.sender]

    // Backup dulu sebelum reset
    const dbPath = path.join(__dirname, '../../database.json')
    const backupPath = path.join(__dirname, `../../database_backup_${Date.now()}.json`)

    if (fs.existsSync(dbPath)) {
        fs.copyFileSync(dbPath, backupPath)
    }

    const userCount = Object.keys(global.db.data.users || {}).length
    const chatCount = Object.keys(global.db.data.chats || {}).length
    const settingsCount = Object.keys(global.db.data.settings || {}).length

    global.db.data.users = {}
    global.db.data.chats = {}
    global.db.data.settings = {}
    global.db.data.stats = {}

    await global.db.write()

    conn.reply(m.chat,
        `✅ *DATABASE DIRESET!*\n\n` +
        `Data yang dihapus:\n` +
        `👤 Users: ${userCount}\n` +
        `💬 Chats: ${chatCount}\n` +
        `⚙️ Settings: ${settingsCount}\n\n` +
        `📦 Backup: \`${path.basename(backupPath)}\``,
    m)
}

handler.help = ['resetdb [confirm]']
handler.tags = ['owner']
handler.command = /^(resetdb|cleardb|wipedb)$/i
handler.rowner = true

export default handler
