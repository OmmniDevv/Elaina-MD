/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import moment from 'moment-timezone'
import fs from 'fs'
import path from 'path'
import config from '../../config.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'savedb',
    alias: ['backupdb', 'downloaddb', 'getdb'],
    category: 'owner',
    description: 'Download file database',
    usage: '.savedb',
    example: '.savedb',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 0,
    isEnabled: true
}
async function handler(m, { sock }) {
    if (!config.isOwner(m.sender)) {
        return m.reply('❌ *Owner Only!*')
    }
    let dbPath = path.join(process.cwd(), 'database.json')
    if (!fs.existsSync(dbPath)) {
        dbPath = path.join(process.cwd(), 'database', 'db.json')
    }
    if (!fs.existsSync(dbPath)) {
        return m.reply(`❌ File database tidak ditemukan!`)
    }
    try {
        const stats = fs.statSync(dbPath)
        const data = fs.readFileSync(dbPath)
        const baseName = path.basename(dbPath)
        const now = moment().tz('Asia/Jakarta')
        const timestamp = now.format('YYYY-MM-DD_HH-mm-ss')
        const fileName = `${baseName.replace('.json', '')}_backup_${timestamp}.json`
        await sock.sendMessage(m.chat, {
            document: data,
            fileName: fileName,
            mimetype: 'application/json',
            caption: `📦 *ᴅᴀᴛᴀʙᴀsᴇ ʙᴀᴄᴋᴜᴘ*\n\n` +
                `╭┈┈⬡「 📋 *ɪɴғᴏ* 」\n` +
                `┃ 📁 File: \`${baseName}\`\n` +
                `┃ 📊 Size: \`${(stats.size / 1024).toFixed(2)} KB\`\n` +
                `┃ 📅 Date: \`${now.format('DD/MM/YYYY')}\`\n` +
                `┃ ⏰ Time: \`${now.format('HH:mm:ss')}\`\n` +
                `╰┈┈┈┈┈┈┈┈⬡`
        }, { quoted: m })
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}
export { pluginConfig as config, handler }