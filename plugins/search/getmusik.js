/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import config from '../../config.js';
import { musicSessions } from './carimusik.js';

const pluginConfig = {
    name: 'getmusik',
    alias: ['dlmusik', 'downloadmusik'],
    category: 'search',
    description: 'Download lagu dari hasil carimusik',
    usage: '.getmusik <nomor>',
    example: '.getmusik 1',
    cooldown: 15,
    energi: 2,
    isEnabled: true
}

let thumbMusic = null

async function getThumbMusic() {
    if (thumbMusic) return thumbMusic
    try {
        const response = await fetch('https://files.catbox.moe/s1fkp1.png', {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(15000)
        })
        if (response.ok) thumbMusic = Buffer.from(await response.arrayBuffer())
    } catch {}
    return thumbMusic
}

async function getContextInfo(title, body, thumbnail) {
    const saluranId = config.saluran?.id || config.saluran?.id
    const saluranName = config.saluran?.name || config.bot?.name || 'rimuru-AI'

    const ctx = {
        forwardingScore: 9999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: saluranId,
            newsletterName: saluranName,
            serverMessageId: 127
        }
    }

    const thumb = thumbnail || await getThumbMusic()
    if (thumb) {
        ctx.externalAdReply = {
            title,
            body,
            thumbnail: thumb,
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: config.saluran?.link || ''
        }
    }

    return ctx
}

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

async function handler(m, { sock }) {
    
    const args = m.args || []
    const num = parseInt(args[0])
    
    const session = musicSessions.get(m.sender)
    
    if (!session) {
        return m.reply(
            `🎵 *ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴜsɪᴋ*\n\n` +
            `> Gunakan \`${m.prefix}carimusik <judul>\` dulu untuk mencari lagu`
        )
    }
    
    if (!num || num < 1 || num > session.songs.length) {
        return m.reply(
            `⚠️ *ɴᴏᴍᴏʀ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ*\n\n` +
            `> Pilih nomor 1-${session.songs.length}`
        )
    }
    
    const selectedSong = session.songs[num - 1]
    
    m.react('⏳')
    
    try {
        await m.reply(`🎵 *ᴍᴇɴɢᴜɴᴅᴜʜ...*\n\n> ${selectedSong.title}`)
        
        const NEOXR_APIKEY = config.zeroApi?.neoxr || config.zeroApi?.neoxr || 'Milik-Bot-RimuruMD'
        const apiUrl = `https://api.neoxr.eu/api/song?q=${encodeURIComponent(session.query)}&select=${num}&apikey=${NEOXR_APIKEY}`
        const { data } = await axios.get(apiUrl, { timeout: 60000 })
        
        if (!data?.status || !data?.data?.url) {
            m.react('❌')
            return m.reply('❌ *ɢᴀɢᴀʟ*\n\n> Gagal mengunduh lagu')
        }
        
        const song = data.data
        
        let thumbBuffer = null
        if (song.artwork_url) {
            try {
                const thumbRes = await axios.get(song.artwork_url.replace('-large', '-t500x500'), { 
                    responseType: 'arraybuffer', 
                    timeout: 10000 
                })
                thumbBuffer = Buffer.from(thumbRes.data)
            } catch {}
        }
        
        const duration = formatDuration(song.duration || 0)
        const plays = formatNumber(song.playback_count || 0)
        const likes = formatNumber(song.likes_count || 0)
        
        const caption = `🎵 *${song.title}*\n\n` +
            `╭┈┈⬡「 📋 *ɪɴꜰᴏ* 」\n` +
            `┃ 👤 Artist: ${song.user?.username || '-'}\n` +
            `┃ 🎭 Genre: ${song.genre || '-'}\n` +
            `┃ ⏱️ Duration: ${duration}\n` +
            `┃ ▶️ Plays: ${plays}\n` +
            `┃ ❤️ Likes: ${likes}\n` +
            `╰┈┈┈┈┈┈┈┈⬡`
        
        await sock.sendMessage(m.chat, {
            audio: { url: song.url },
            mimetype: 'audio/mpeg',
            fileName: `${song.title}.mp3`,
            contextInfo: await getContextInfo('🎵 MUSIK', song.title, thumbBuffer)
        }, { quoted: m })
        
        await sock.sendMessage(m.chat, {
            text: caption,
            contextInfo: await getContextInfo('🎵 MUSIK INFO', song.user?.username || '-', thumbBuffer)
        }, { quoted: m })
        
        musicSessions.delete(m.sender)
        m.react('✅')
        
    } catch (error) {
        m.react('❌')
        m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> ${error.message}`)
    }
}
export { pluginConfig as config, handler };