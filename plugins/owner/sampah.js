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
const pluginConfig = {
    name: 'sampah',
    alias: ['clearsampah', 'cleartemp', 'deltemp'],
    category: 'owner',
    description: 'Menghapus semua sampah di temp',
    usage: '.sampah',
    example: '.sampah',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 60,
    energi: 0,
    isEnabled: true
}

async function handler(m) {
    const tempPath = path.join(process.cwd(), 'temp')

    if (!fs.existsSync(tempPath)) {
        return m.reply('❌ Folder temp tidak ditemukan!')
    }

    await m.react('🗑️')

    try {
        const files = fs.readdirSync(tempPath)

        if (!files.length) {
            return m.reply('📁 Folder temp sudah kosong!')
        }

        let deleted = 0

        for (const file of files) {
            const filePath = path.join(tempPath, file)

            fs.rmSync(filePath, { recursive: true, force: true })
            deleted++
        }

        await m.react('✅')
        await m.reply(
            `🗑️ *TEMP CLEANED!*\n\n` +
            `> Total file/folder dihapus: *${deleted}*`
        )

    } catch (error) {
        await m.react('☢')
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }