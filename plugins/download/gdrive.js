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
    name: 'gdrive',
    alias: ['drive', 'drivedl', 'driveurl'],
    category: 'download',
    description: 'Download file dari Google Drive',
    usage: '.gdrive <url>',
    example: '.gdrive https://drive.google.com/file/d/xxx/view',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 15,
    energi: 1,
    isEnabled: true
}

function formatSize(bytes) {
    if (bytes === 0) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i]
}

async function drive(url) {
    let id
    let res = { error: true }
    
    if (!url || !url.match(/drive\.google/i)) return res
    
    try {
        id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1]
        if (!id) throw new Error("ID Not Found")
        
        const response = await axios.post(
            `https://drive.google.com/uc?id=${id}&authuser=0&export=download`,
            {},
            {
                headers: {
                    'accept-encoding': 'gzip, deflate, br',
                    'content-length': 0,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'origin': 'https://drive.google.com',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                    'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
                    'x-drive-first-party': 'DriveWebUi',
                    'x-json-requested': 'true'
                }
            }
        )
        
        const data = JSON.parse(response.data.slice(4))
        const { fileName, sizeBytes, downloadUrl } = data
        
        if (!downloadUrl) throw new Error("Link Download Limit!")
        
        return {
            downloadUrl: downloadUrl,
            fileName: fileName,
            fileSize: formatSize(sizeBytes),
            mimetype: 'application/octet-stream'
        }
        
    } catch (e) {
        console.error('[Drive] Error:', e.message)
        return res
    }
}

async function handler(m, { sock }) {
    const url = m.text?.trim() || m.args[0]
    
    if (!url) {
        return m.reply(
            `💕 *ɢᴏᴏɢʟᴇ ᴅʀɪᴠᴇ* 💕\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✦ *Cara Pakai*\n` +
            `┃\n` +
            `┃   ${m.prefix}gdrive <url>\n` +
            `┃\n` +
            `┃ ✦ *Contoh*\n` +
            `┃\n` +
            `┃   ${m.prefix}gdrive https://drive.google.com/file/d/xxx/view\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Mau download file dari Google Drive apa darling~?\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
    }
    
    if (!url.match(/drive\.google/i)) {
        return m.reply(
            `💔 *ᴇʀʀᴏʀ*\n\n` +
            `> URL tidak valid. Kirim link Google Drive yang bener darling~ 🥺`
        )
    }
    
    m.react('💕')
    await m.reply(`⏳ *ᴘʀᴏᴄᴇꜱꜱɪɴɢ...*\n\n💗 *Rimuru:* Lagi mengambil file dari Google Drive darling~ tunggu sebentar yaa 📁`)
    
    try {
        const data = await drive(url)
        
        if (data.error || !data.downloadUrl) {
            m.react('💔')
            return m.reply(
                `💔 *ɢᴀɢᴀʟ*\n\n` +
                `> File tidak dapat diakses atau link limit darling~ 🥺`
            )
        }
        
        await sock.sendMessage(m.chat, {
            document: { url: data.downloadUrl },
            fileName: data.fileName,
            mimetype: data.mimetype,
            caption: `💕 *ɢᴏᴏɢʟᴇ ᴅʀɪᴠᴇ* 💕\n\n` +
                    `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
                    `┃ 📄 *ɴᴀᴍᴀ*: ${data.fileName}\n` +
                    `┃ 📦 *ᴜᴋᴜʀᴀɴ*: ${data.fileSize}\n` +
                    `┃\n` +
                    `┃ 💗 *Rimuru:* Ini file nya darling~ 📂\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        }, { quoted: m })
        
        m.react('✅')
        
    } catch (err) {
        console.error('[GDrive] Error:', err)
        m.react('💔')
        return m.reply(
            `💔 *ᴇʀʀᴏʀ*\n\n` +
            `> ${err.message}\n\n` +
            `> Coba lagi ya darling~ 🥺`
        )
    }
}

export { pluginConfig as config, handler };
