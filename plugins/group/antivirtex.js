/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import config from '../../config.js';
import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'antivirtex',
    alias: ['antivirtexgc', 'antivtxt', 'antitxtv'],
    category: 'group',
    description: 'Hapus otomatis pesan yang mengandung karakter aneh/virtex di grup',
    usage: '.antivirtex on/off',
    example: '.antivirtex on',
    isAdmin: true,
    isGroup: true,
    cooldown: 3,
    isEnabled: true
}

function isVirtex(text) {
    if (!text || typeof text !== 'string') return false
    
    const virtexPatterns = [
        /[\x00-\x1F\x7F]/g,
        /[\u200B-\u200D\uFEFF]/g,
        /[\uD800-\uDFFF]{2,}/g,
        /[^\x20-\x7E\x0A\x0D\u0600-\u06FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/g,
        /(.)\1{20,}/g,
        /.{500,}/g,
        /[\u2000-\u200F\uFEFF\u00AD-\uFFFF]/g,
        /[\u0300-\u036F]{5,}/g
    ]    
    for (const pattern of virtexPatterns) {
        if (pattern.test(text)) return true
    }
    
    let unicodeCount = 0
    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i)
        if (code > 0x7F && code < 0x0600) unicodeCount++
        if (code > 0x06FF && code < 0x4E00) unicodeCount++
        if (code > 0x9FFF && code < 0x3040) unicodeCount++
        if (code > 0x30FF && code < 0x1100) unicodeCount++
    }
    if (unicodeCount > text.length * 0.7) return true
    
    return false
}

async function handler(m, { sock, db }) {
    const args = m.args || []
    const mode = args[0]?.toLowerCase()
    
    const groupData = db.getGroup(m.chat) || {}
    const currentStatus = groupData.antivirtex === true
    
    if (mode === 'on') {
        if (currentStatus) {
            return m.reply(
                `⚠️ *ᴀɴᴛɪᴠɪʀᴛᴇx ᴀʟʀᴇᴀᴅʏ ᴀᴄᴛɪᴠᴇ*\n\n` +
                `> Status: *✅ ON*\n` +
                `> Anti virtex sudah aktif di grup ini.`
            )
        }
        db.setGroup(m.chat, { antivirtex: true })
        m.react('✅')
        return m.reply(
            `✅ *ᴀɴᴛɪᴠɪʀᴛᴇx ᴀᴋᴛɪꜰ*\n\n` +
            `> Pesan yang mengandung karakter aneh/virtex akan otomatis dihapus.\n` +
            `> Gunakan \`.antivirtex off\` untuk menonaktifkan.`
        )
    }
    
    if (mode === 'off') {
        if (!currentStatus) {
            return m.reply(
                `⚠️ *ᴀɴᴛɪᴠɪʀᴛᴇx ᴀʟʀᴇᴀᴅʏ ɪɴᴀᴄᴛɪᴠᴇ*\n\n` +
                `> Status: *❌ OFF*\n` +
                `> Anti virtex sudah nonaktif di grup ini.`
            )
        }
        db.setGroup(m.chat, { antivirtex: false })
        m.react('❌')
        return m.reply(
            `❌ *ᴀɴᴛɪᴠɪʀᴛᴇx ɴᴏɴᴀᴋᴛɪꜰ*\n\n` +
            `> Pesan virtex tidak akan dihapus lagi.`
        )
    }
    
    const status = currentStatus ? '✅ AKTIF' : '❌ NONAKTIF'
    
    m.reply(
        `🛡️ *ᴀɴᴛɪᴠɪʀᴛᴇx*\n\n` +
        `╭┈┈⬡「 📋 *sᴛᴀᴛᴜs* 」\n` +
        `┃ 🔔 sᴛᴀᴛᴜs: ${status}\n` +
        `╰┈┈⬡\n\n` +
        `> *Penggunaan:*\n` +
        `> \`${m.prefix}antivirtex on\` - Aktifkan\n` +
        `> \`${m.prefix}antivirtex off\` - Nonaktifkan`
    )
}

async function antivirtexListener(sock) {
    const db = getDatabase()
    
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return
        
        for (const msg of messages) {
            try {
                const jid = msg.key?.remoteJid
                if (!jid || !jid.endsWith('@g.us')) continue
                
                const groupData = db.getGroup(jid) || {}
                if (!groupData.antivirtex) continue
                
                let text = ''
                const message = msg.message
                
                if (message?.conversation) text = message.conversation
                else if (message?.extendedTextMessage?.text) text = message.extendedTextMessage.text
                else if (message?.imageMessage?.caption) text = message.imageMessage.caption
                else if (message?.videoMessage?.caption) text = message.videoMessage.caption
                else if (message?.documentMessage?.caption) text = message.documentMessage.caption
                
                if (text && isVirtex(text)) {
                    await sock.sendMessage(jid, { delete: msg.key })
                    
                    const sender = msg.key.participant || msg.participant || msg.key.remoteJid
                    await sock.sendMessage(jid, {
                        text: `🚫 *ᴠɪʀᴛᴇx ᴅᴇᴛᴇᴄᴛᴇᴅ*\n\n> Pesan dari @${sender?.split('@')[0]} telah dihapus karena mengandung karakter aneh/virtex!`,
                        mentions: [sender]
                    })
                    
                    console.log(`[AntiVirtex] Pesan virtex dihapus di ${jid} dari ${sender}`)
                }
            } catch (err) {
                console.error('[AntiVirtex] Error:', err.message)
            }
        }
    })
    
    console.log('✅ AntiVirtex Listener siap!')
}

export { pluginConfig as config, handler, antivirtexListener };
