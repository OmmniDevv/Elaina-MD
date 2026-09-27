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
    name: 'tebakanime',
    alias: ['tebaknime', 'guessanime'],
    category: 'game',
    description: 'Tebak anime dari deskripsi (dapat limit)',
    usage: '.tebakanime',
    example: '.tebakanime',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 30,
    energi: 1,
    isEnabled: true
}

const API_URL = 'https://api.jikan.moe/v4/anime'

let activeGames = {}

async function getRandomAnime() {
    const randomId = Math.floor(Math.random() * 50000) + 1
    try {
        const res = await axios.get(`${API_URL}/${randomId}`)
        return res.data.data
    } catch {
        return null
    }
}

async function handler(m, { sock, db }) {
    const chatId = m.chat
    
    if (activeGames[chatId]) {
        return m.reply(`⏳ *ᴍᴀꜱɪʜ ᴀᴅᴀ ɢᴀᴍᴇ ʏᴀɴɢ ʙᴇʀʟᴀɴɢꜱᴜɴɢ!*\n\n> Jawab dulu yaa darling~`)
    }
    
    m.react('🎮')
    await m.reply(`⏳ *ᴍᴇɴᴄᴀʀɪ ᴀɴɪᴍᴇ...*\n\n💗 *Rimuru:* Lagi nyari anime buat tebakan darling~`)
    
    try {
        let anime = null
        let attempts = 0
        while (!anime && attempts < 5) {
            anime = await getRandomAnime()
            attempts++
        }
        
        if (!anime) {
            return m.reply(`💔 *ɢᴀɢᴀʟ*\n\n> Gagal mengambil data anime. Coba lagi yaa~`)
        }
        
        const soal = anime.synopsis?.substring(0, 200) || anime.title
        const jawaban = anime.title.toLowerCase()
        
        activeGames[chatId] = {
            jawaban: jawaban,
            soal: soal,
            time: setTimeout(() => {
                if (activeGames[chatId]) {
                    m.reply(`⏰ *ᴡᴀᴋᴛᴜ ʜᴀʙɪꜱ!*\n\n> Jawabannya: *${anime.title}*`)
                    delete activeGames[chatId]
                }
            }, 30000)
        }
        
        await sock.sendMessage(m.chat, {
            image: { url: anime.images?.jpg?.image_url },
            caption: `🎮 *ᴛᴇʙᴀᴋ ᴀɴɪᴍᴇ* 🎮\n\n` +
                    `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
                    `┃ 📝 *ᴅᴇꜱᴋʀɪᴘꜱɪ*:\n` +
                    `┃ ${soal}\n` +
                    `┃\n` +
                    `┃ ⏱️ *ᴡᴀᴋᴛᴜ*: 30 detik\n` +
                    `┃ 💰 *ʜᴀᴅɪᴀʜ*: 50 limit\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        }, { quoted: m })
        
    } catch (err) {
        console.error('[TebakAnime] Error:', err)
        m.react('💔')
        m.reply(`💔 *ᴇʀʀᴏʀ*\n\n> ${err.message}`)
    }
}

// Listener untuk jawaban
async function answerHandler(m, { sock, db }) {
    const chatId = m.chat
    const game = activeGames[chatId]
    
    if (!game) return false
    
    const userAnswer = m.text?.toLowerCase().trim()
    if (userAnswer === game.jawaban) {
        clearTimeout(game.time)
        delete activeGames[chatId]
        
        const user = db.getUser(m.sender)
        user.limit = (user.limit || 0) + 50
        db.setUser(m.sender, user)
        
        await m.reply(`🎉 *ʙᴇɴᴀʀ!*\n\n> Jawaban: *${game.jawaban}*\n> Kamu dapat +50 limit! 🎁`)
        await m.react('🎉')
        return true
    }
    return false
}

export { pluginConfig as config, handler, answerHandler };
