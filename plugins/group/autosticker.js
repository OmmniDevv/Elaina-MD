/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js'
import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'autosticker',
    alias: ['autostiker', 'as'],
    category: 'group',
    description: 'Toggle auto sticker - otomatis jadikan gambar/video jadi sticker',
    usage: '.autosticker on/off',
    example: '.autosticker on',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const args = m.args || []
    const groupData = db.getGroup(m.chat) || {}
    const current = groupData.autosticker ?? false
    const arg = args[0]?.toLowerCase()
    
    if (!arg) {
        const status = current ? '✅ Aktif' : '❌ Nonaktif'
        return m.reply(
            `🖼️ *ᴀᴜᴛᴏsᴛɪᴄᴋᴇʀ*\n\n` +
            `> Status: ${status}\n\n` +
            `> Gunakan:\n` +
            `> \`${m.prefix}autosticker on\` - aktifkan\n` +
            `> \`${m.prefix}autosticker off\` - nonaktifkan\n\n` +
            `> _Otomatis jadikan gambar/video jadi sticker_`
        )
    }
    
    
    if (arg === 'on' || arg === '1' || arg === 'aktif') {
        if (current) {
            return m.reply(`🖼️ *ᴀᴜᴛᴏsᴛɪᴄᴋᴇʀ*\n\n> Sudah aktif!`)
        }
        db.setGroup(m.chat, { autosticker: true })
        await db.save()
        return m.reply(`🖼️ *ᴀᴜᴛᴏsᴛɪᴄᴋᴇʀ*\n\n> ✅ Berhasil diaktifkan!\n> Gambar/video akan otomatis jadi sticker`)
    }
    
    if (arg === 'off' || arg === '0' || arg === 'nonaktif') {
        if (!current) {
            return m.reply(`🖼️ *ᴀᴜᴛᴏsᴛɪᴄᴋᴇʀ*\n\n> Sudah nonaktif!`)
        }
        db.setGroup(m.chat, { autosticker: false })
        await db.save()
        return m.reply(`🖼️ *ᴀᴜᴛᴏsᴛɪᴄᴋᴇʀ*\n\n> ❌ Berhasil dinonaktifkan!`)
    }
    
    return m.reply(`❌ Gunakan: \`${m.prefix}autosticker on/off\``)
}

async function autoStickerHandler(m, sock) {
    try {
        if (!m) return false
        if (!m.isGroup) return false
        if (m.isCommand) return false
        if (m.fromMe === true) return false
        
        const db = getDatabase()
        const groupData = db.getGroup(m.chat) || {}
        
        if (!groupData.autosticker) return false
        
        const msg = m.message
        if (!msg) return false
        
        const type = Object.keys(msg)[0]
        const content = msg[type]

        const isImage = type === 'imageMessage' || 
                        (type === 'viewOnceMessage' && content?.message?.imageMessage) ||
                        (type === 'viewOnceMessageV2' && content?.message?.imageMessage)
        
        const isVideo = type === 'videoMessage' ||
                        (type === 'viewOnceMessage' && content?.message?.videoMessage) ||
                        (type === 'viewOnceMessageV2' && content?.message?.videoMessage)
        
        if (!isImage && !isVideo) return false
        
        const buffer = await m.download()
        if (!buffer || buffer.length === 0) return false
        
        if (buffer.length > 10 * 1024 * 1024) return false
        
        if (isImage) {
            await sock.sendImageAsSticker(m.chat, buffer, m, {
                packname: config.sticker?.packname || 'Rimuru',
                author: config.sticker?.author || 'Bot'
            })
        } else if (isVideo) {
            const videoMsg = msg.videoMessage || content?.message?.videoMessage
            const duration = videoMsg?.seconds || 0
            if (duration > 10) return false
            
            await sock.sendVideoAsSticker(m.chat, buffer, m, {
                packname: config.sticker?.packname || 'Rimuru',
                author: config.sticker?.author || 'Bot'
            })
        }
        
        return true
    } catch (err) {
        return false
    }
}

export { pluginConfig as config, handler, autoStickerHandler }