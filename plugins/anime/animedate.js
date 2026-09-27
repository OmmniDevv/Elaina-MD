/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import { createCanvas } from '@napi-rs/canvas';
const pluginConfig = {
    name: 'animedate',
    alias: ['animerilis', 'animekalender', 'animerelease'],
    category: 'anime',
    description: 'Kalender rilis anime musim ini (Spring/Summer/Fall/Winter)',
    usage: '.animedate [season]',
    example: '.animedate\n.animedate spring\n.animedate summer\n.animedate fall\n.animedate winter',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

const THEME = {
    bg: '#0a050f',
    primary: '#ff2a6d',
    secondary: '#ff69b4',
    white: '#ffffff',
    gray: '#ff99bb',
    glow: '#ff2a6d',
    cardBg: '#1a0b1a',
    gold: '#ffd700'
}

// API Jikan
const JIKAN_API = "https://api.jikan.moe/v4"

// Season mapping
const SEASONS = {
    winter: { month: 1, endMonth: 3, name: 'Winter', emoji: '❄️' },
    spring: { month: 4, endMonth: 6, name: 'Spring', emoji: '🌸' },
    summer: { month: 7, endMonth: 9, name: 'Summer', emoji: '☀️' },
    fall: { month: 10, endMonth: 12, name: 'Fall', emoji: '🍂' }
}

// Day mapping
const DAYS = [
    { id: 'monday', name: 'Senin', short: 'Sen', emoji: '📅' },
    { id: 'tuesday', name: 'Selasa', short: 'Sel', emoji: '📅' },
    { id: 'wednesday', name: 'Rabu', short: 'Rab', emoji: '📅' },
    { id: 'thursday', name: 'Kamis', short: 'Kam', emoji: '📅' },
    { id: 'friday', name: 'Jumat', short: 'Jum', emoji: '📅' },
    { id: 'saturday', name: 'Sabtu', short: 'Sab', emoji: '📅' },
    { id: 'sunday', name: 'Minggu', short: 'Min', emoji: '📅' }
]

const dayMap = {
    'monday': 'Senin', 'tuesday': 'Selasa', 'wednesday': 'Rabu',
    'thursday': 'Kamis', 'friday': 'Jumat', 'saturday': 'Sabtu', 'sunday': 'Minggu'
}

const HARI_INDO = {
    'Senin': 'Senin', 'Selasa': 'Selasa', 'Rabu': 'Rabu', 'Kamis': 'Kamis',
    'Jumat': 'Jumat', 'Sabtu': 'Sabtu', 'Minggu': 'Minggu'
}

// Cache
const cache = new Map()
const CACHE_DURATION = 12 * 60 * 60 * 1000 // 12 jam

function getCurrentSeason() {
    const now = new Date()
    const month = now.getMonth() + 1
    
    if (month >= 1 && month <= 3) return 'winter'
    if (month >= 4 && month <= 6) return 'spring'
    if (month >= 7 && month <= 9) return 'summer'
    return 'fall'
}

async function getSeasonalAnime(season, year) {
    const cacheKey = `${season}_${year}`
    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey)
        if (Date.now() - cached.timestamp < CACHE_DURATION) return cached.data
        cache.delete(cacheKey)
    }

    try {
        const response = await axios.get(`${JIKAN_API}/seasons/${year}/${season}`, {
            params: { limit: 100, sfw: true },
            timeout: 15000,
            headers: { 'User-Agent': 'Rimuru-Bot/1.0' }
        })

        if (!response.data.data) {
            return { success: false, error: 'Gagal mengambil data' }
        }

        const animes = response.data.data.map(anime => {
            let broadcastDay = null
            let broadcastTime = null
            
            if (anime.broadcast && anime.broadcast.day_of_week) {
                broadcastDay = anime.broadcast.day_of_week.toLowerCase()
                broadcastTime = anime.broadcast.time || 'TBA'
            }
            
            return {
                title: anime.title,
                score: anime.score || 'N/A',
                episodes: anime.episodes || '?',
                aired: anime.aired?.string?.split(' to ')[0] || 'TBA',
                broadcastDay,
                broadcastTime,
                status: anime.status,
                image: anime.images?.jpg?.image_url
            }
        })

        // Filter yang sudah tayang
        const filtered = animes.filter(a => a.status !== 'Not yet aired')
        
        const result = { success: true, data: filtered, season, year }
        cache.set(cacheKey, { data: result, timestamp: Date.now() })
        return result
    } catch (err) {
        console.error('[AnimeDate] Error:', err.message)
        if (err.response?.status === 429) {
            return { success: false, error: 'Terlalu banyak request, coba lagi nanti darling~' }
        }
        return { success: false, error: err.message }
    }
}

async function renderCalendar(animes, season, year) {
    // Kelompokan berdasarkan hari
    const schedule = {
        monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
    }
    
    for (const anime of animes) {
        if (anime.broadcastDay && schedule[anime.broadcastDay]) {
            schedule[anime.broadcastDay].push(anime)
        }
    }
    
    // Hitung tinggi canvas
    let totalRows = 0
    for (const day of DAYS) {
        totalRows += Math.max(1, schedule[day.id].length) + 1 // +1 buat header hari
    }
    
    const w = 600
    let h = 150 + (totalRows * 35)
    h = Math.min(h, 900)
    const canvas = createCanvas(w, h)
    const ctx = canvas.getContext('2d')

    const grad = ctx.createLinearGradient(0, 0, w, h)
    grad.addColorStop(0, THEME.bg)
    grad.addColorStop(1, THEME.cardBg)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    ctx.globalAlpha = 0.05
    for (let i = 0; i < w; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, h)
        ctx.strokeStyle = THEME.primary
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(w, i)
        ctx.stroke()
    }
    ctx.globalAlpha = 1

    ctx.strokeStyle = THEME.primary
    ctx.lineWidth = 3
    ctx.strokeRect(12, 12, w - 24, h - 24)

    // Header
    ctx.fillStyle = THEME.primary
    ctx.font = 'bold 22px "Segoe UI"'
    ctx.textAlign = 'center'
    ctx.shadowColor = THEME.glow
    ctx.shadowBlur = 10
    ctx.fillText(`📅 RIMURU RELEASE CALENDAR 📅`, w/2, 42)
    ctx.shadowBlur = 0

    const seasonEmoji = SEASONS[season]?.emoji || '🌸'
    ctx.fillStyle = THEME.white
    ctx.font = 'bold 16px "Segoe UI"'
    ctx.fillText(`${seasonEmoji} ${SEASONS[season]?.name || season.toUpperCase()} ${year} ${seasonEmoji}`, w/2, 70)

    let y = 105
    
    for (const day of DAYS) {
        const animesOnDay = schedule[day.id]
        
        // Hari header
        ctx.fillStyle = THEME.secondary
        ctx.font = 'bold 13px "Segoe UI"'
        ctx.fillText(`${day.emoji} ${day.name}`, 25, y)
        
        if (animesOnDay.length === 0) {
            ctx.fillStyle = THEME.gray
            ctx.font = '10px "Segoe UI"'
            ctx.fillText('Tidak ada anime yang rilis', 25, y + 22)
            y += 40
        } else {
            for (let i = 0; i < Math.min(animesOnDay.length, 4); i++) {
                const anime = animesOnDay[i]
                let title = anime.title.length > 35 ? anime.title.substring(0, 32) + '...' : anime.title
                
                ctx.fillStyle = THEME.white
                ctx.font = '10px "Segoe UI"'
                ctx.fillText(`${i+1}. ${title}`, 30, y + 18 + (i * 20))
                
                ctx.fillStyle = THEME.gray
                ctx.font = '9px "Segoe UI"'
                ctx.fillText(`⭐ ${anime.score}`, w - 80, y + 18 + (i * 20))
            }
            
            if (animesOnDay.length > 4) {
                ctx.fillStyle = THEME.gray
                ctx.font = '9px "Segoe UI"'
                ctx.fillText(`+ ${animesOnDay.length - 4} anime lainnya...`, 30, y + 18 + (4 * 20))
            }
            
            y += 35 + (Math.min(animesOnDay.length, 5) * 20)
        }
        
        y += 5
    }

    ctx.fillStyle = `${THEME.primary}80`
    ctx.font = '9px "Segoe UI"'
    ctx.fillText('❥ Rimuru AI | Data from MyAnimeList (Jikan API)', w/2, h - 18)

    return canvas.toBuffer('image/png')
}

function formatCaption(animes, season, year) {
    const seasonData = SEASONS[season]
    let caption = `📅 *RIMURU RELEASE CALENDAR* 📅\n\n`
    caption += `${seasonData.emoji} *${seasonData.name} ${year}* ${seasonData.emoji}\n`
    caption += `━━━━━━━━━━━━━━━━━━━━\n\n`
    
    const schedule = {
        monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
    }
    
    for (const anime of animes) {
        if (anime.broadcastDay && schedule[anime.broadcastDay]) {
            schedule[anime.broadcastDay].push(anime)
        }
    }
    
    for (const day of DAYS) {
        const animesOnDay = schedule[day.id]
        caption += `*${day.name}:*\n`
        
        if (animesOnDay.length === 0) {
            caption += `  - Tidak ada anime yang rilis\n`
        } else {
            for (let i = 0; i < Math.min(animesOnDay.length, 6); i++) {
                const anime = animesOnDay[i]
                caption += `  ${i+1}. *${anime.title}* (⭐ ${anime.score})\n`
            }
            if (animesOnDay.length > 6) {
                caption += `  + ${animesOnDay.length - 6} anime lainnya...\n`
            }
        }
        caption += `\n`
    }
    
    caption += `💕 *Rimuru:* ${seasonData.emoji} Jangan lupa nonton anime musim ini ya darling~ 🦋`
    
    return caption
}

async function handler(m, { sock }) {
    let seasonQuery = m.text?.trim()?.toLowerCase() || ''
    
    // Tentukan season
    let season = null
    let year = new Date().getFullYear()
    
    if (seasonQuery && SEASONS[seasonQuery]) {
        season = seasonQuery
    } else {
        season = getCurrentSeason()
        seasonQuery = season
    }
    
    await m.react('📅')
    
    try {
        await m.reply(`🦋 *Rimuru:* Lagi ambil kalender rilis anime ${SEASONS[season].emoji} ${SEASONS[season].name} ${year}... tunggu sebentar ya~ 📅`)
        
        const result = await getSeasonalAnime(season, year)
        
        if (!result.success || !result.data || result.data.length === 0) {
            await m.react('❌')
            return m.reply(`❌ *Gagal mengambil data!*\n\nData anime ${SEASONS[season].name} ${year} tidak ditemukan.\n\nCoba musim lain ya darling~ 🦋`)
        }
        
        try {
            const imgBuffer = await renderCalendar(result.data, season, year)
            await sock.sendMessage(m.chat, {
                image: imgBuffer,
                caption: formatCaption(result.data, season, year)
            }, { quoted: m })
        } catch (imgErr) {
            console.error('[AnimeDate] Canvas error:', imgErr)
            await m.reply(formatCaption(result.data, season, year))
        }
        
        await m.react('✅')
        
    } catch (err) {
        console.error('[AnimeDate] Error:', err)
        await m.react('❌')
        await m.reply(`❌ *Error:* ${err.message}\n\nCoba lagi nanti ya darling~ 🦋`)
    }
}

export { pluginConfig as config, handler };
