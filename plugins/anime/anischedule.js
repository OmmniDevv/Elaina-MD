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
    name: 'anischedule',
    alias: ['animejadwal', 'jadwalanime', 'animeday', ],
    category: 'anime',
    description: 'Menampilkan jadwal tayang anime musim ini (ambil dari API livechart)',
    usage: '.anischedule [hari] [musim]',
    example: '.anischedule\n.anischedule senin\n.anischedule spring-2025',
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
    textPrimary: '#ffffff',
    textSecondary: '#ff99bb',
    glow: '#ff2a6d',
    cardBg: '#1a0b1a'
}

// Mapping hari (Indonesia ke English)
const dayMap = {
    'senin': 'monday', 'sen': 'monday',
    'selasa': 'tuesday', 'sel': 'tuesday',
    'rabu': 'wednesday', 'rab': 'wednesday',
    'kamis': 'thursday', 'kam': 'thursday',
    'jumat': 'friday', 'jum': 'friday',
    'sabtu': 'saturday', 'sab': 'saturday',
    'minggu': 'sunday', 'min': 'sunday',
    'monday': 'monday', 'tuesday': 'tuesday', 'wednesday': 'wednesday',
    'thursday': 'thursday', 'friday': 'friday', 'saturday': 'saturday', 'sunday': 'sunday'
}

const hariIndonesia = {
    'monday': 'Senin', 'tuesday': 'Selasa', 'wednesday': 'Rabu',
    'thursday': 'Kamis', 'friday': 'Jumat', 'saturday': 'Sabtu', 'sunday': 'Minggu'
}

// Mapping musim
const seasonMap = {
    'winter': 'winter', 'spring': 'spring', 'summer': 'summer', 'fall': 'fall',
    'dingin': 'winter', 'semi': 'spring', 'panas': 'summer', 'gugur': 'fall'
}

// ============ API ENDPOINTS ============
// 1. AniStation Schedule API (scrape dari livechart.me)
const ANISTATION_API = "https://ani-station-schedule-api.vercel.app"

// 2. Jikan API (MyAnimeList) - buat fallback
const JIKAN_API = "https://api.jikan.moe/v4"

// 3. Fallback data (kalo API mati)
const FALLBACK_SCHEDULES = {
    'spring-2025': [
        { title: "DAN DA DAN Season 2", time: "23:00", studio: "Science SARU", day: "thursday" },
        { title: "Spy x Family Season 3", time: "23:00", studio: "Wit Studio/CloverWorks", day: "saturday" },
        { title: "Jujutsu Kaisen: Shimetsu Kaiyuu", time: "23:56", studio: "MAPPA", day: "thursday" },
        { title: "One Piece", time: "09:30", studio: "Toei Animation", day: "sunday" },
        { title: "Solo Leveling Season 2", time: "00:00", studio: "A-1 Pictures", day: "saturday" }
    ],
    'summer-2025': [
        { title: "Oshi no Ko Season 3", time: "23:00", studio: "Doga Kobo", day: "wednesday" },
        { title: "Kaiju No. 8 Season 2", time: "23:00", studio: "Production I.G", day: "saturday" }
    ]
}

// ============ FUNGSI ============

// Ambil jadwal dari API
async function fetchScheduleFromAPI(seasonYear = null) {
    try {
        // Tentukan musim & tahun
        let seasonQuery = seasonYear
        
        if (!seasonQuery) {
            const now = new Date()
            const month = now.getMonth()
            const year = now.getFullYear()
            
            let season = 'spring'
            if (month >= 0 && month <= 2) season = 'winter'
            else if (month >= 3 && month <= 5) season = 'spring'
            else if (month >= 6 && month <= 8) season = 'summer'
            else season = 'fall'
            
            seasonQuery = `${season}-${year}`
        }
        
        console.log(`[AniSchedule] Fetching schedule for: ${seasonQuery}`)
        
        // Coba ke AniStation API
        try {
            const response = await axios.get(`${ANISTATION_API}/${seasonQuery}`, {
                timeout: 10000,
                headers: { 'User-Agent': 'Rimuru-Bot/1.0' }
            })
            
            if (response.data && Array.isArray(response.data)) {
                return { success: true, data: response.data, source: 'anistation', season: seasonQuery }
            }
        } catch (e) {
            console.log('[AniSchedule] AniStation API error:', e.message)
        }
        
        // Fallback ke Jikan API (cari seasonal anime)
        try {
            const [season, year] = seasonQuery.split('-')
            const response = await axios.get(`${JIKAN_API}/seasons/${year}/${season}`, {
                timeout: 10000,
                params: { limit: 50, sfw: true }
            })
            
            if (response.data && response.data.data) {
                const schedules = response.data.data.map(anime => ({
                    title: anime.title,
                    english_title: anime.title_english || null,
                    time: anime.broadcast?.time || "TBA",
                    day: anime.broadcast?.day_of_week?.toLowerCase() || "unknown",
                    studio: anime.studios?.[0]?.name || "Unknown",
                    episodes: anime.episodes || "?",
                    score: anime.score || "N/A",
                    image: anime.images?.jpg?.image_url
                }))
                return { success: true, data: schedules, source: 'jikan', season: seasonQuery }
            }
        } catch (e) {
            console.log('[AniSchedule] Jikan API error:', e.message)
        }
        
        // Fallback terakhir: data hardcode
        if (FALLBACK_SCHEDULES[seasonQuery]) {
            return { success: true, data: FALLBACK_SCHEDULES[seasonQuery], source: 'fallback', season: seasonQuery }
        }
        
        // Fallback default
        return { success: true, data: FALLBACK_SCHEDULES['spring-2025'], source: 'fallback', season: 'spring-2025', isDefault: true }
        
    } catch (err) {
        console.error('[AniSchedule] Error:', err)
        return { success: false, error: err.message }
    }
}

// Filter jadwal berdasarkan hari
function filterByDay(schedules, day) {
    if (!day) return schedules
    return schedules.filter(s => s.day && s.day.toLowerCase() === day)
}

// Render gambar jadwal ke canvas
async function renderSchedule(schedules, season, filterDay = null, source = 'api') {
    const W = 650
    let H = 300 + Math.min(schedules.length, 15) * 60
    H = Math.min(H, 800)
    
    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext('2d')
    
    // Background
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#0a050f')
    grad.addColorStop(1, '#1a0b1a')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)
    
    // Header
    ctx.fillStyle = THEME.primary
    ctx.font = 'bold 22px "Segoe UI"'
    ctx.textAlign = 'center'
    ctx.shadowColor = THEME.glow
    ctx.shadowBlur = 10
    ctx.fillText('🦋 ANIME SCHEDULE 🦋', W/2, 40)
    ctx.shadowBlur = 0
    
    ctx.fillStyle = THEME.textSecondary
    ctx.font = '12px "Segoe UI"'
    let seasonText = season.toUpperCase()
    if (filterDay) seasonText += ` - ${hariIndonesia[filterDay] || filterDay}`
    ctx.fillText(seasonText, W/2, 65)
    
    let y = 95
    const maxShow = 12
    
    for (let i = 0; i < Math.min(schedules.length, maxShow); i++) {
        const anime = schedules[i]
        
        // Card background
        ctx.fillStyle = `${THEME.cardBg}cc`
        ctx.fillRect(20, y - 12, W - 40, 50)
        
        // Nama anime
        ctx.fillStyle = THEME.primary
        ctx.font = 'bold 13px "Segoe UI"'
        ctx.textAlign = 'left'
        let title = anime.title.length > 30 ? anime.title.substring(0, 27) + '...' : anime.title
        ctx.fillText(`${i+1}. ${title}`, 35, y + 5)
        
        // Studio & Waktu
        ctx.fillStyle = THEME.textSecondary
        ctx.font = '10px "Segoe UI"'
        let info = `${anime.studio || 'Unknown'}`
        if (anime.time && anime.time !== 'TBA') info += ` • 🕐 ${anime.time}`
        if (anime.day && hariIndonesia[anime.day]) info += ` • 📆 ${hariIndonesia[anime.day]}`
        ctx.fillText(info, 35, y + 22)
        
        // Score & Episodes
        if (anime.score && anime.score !== 'N/A') {
            ctx.fillStyle = THEME.secondary
            ctx.font = '10px "Segoe UI"'
            ctx.fillText(`⭐ ${anime.score}`, W - 50, y + 5)
        }
        
        y += 52
    }
    
    if (schedules.length > maxShow) {
        ctx.fillStyle = THEME.textSecondary
        ctx.font = '10px "Segoe UI"'
        ctx.fillText(`+ ${schedules.length - maxShow} anime lainnya...`, W/2, y + 10)
    }
    
    // Sumber data
    ctx.fillStyle = `${THEME.textSecondary}80`
    ctx.font = '9px "Segoe UI"'
    ctx.fillText(`📡 Source: ${source} | ❥ Rimuru AI`, W/2, H - 12)
    
    return canvas.toBuffer('image/png')
}

// Format caption text (fallback kalo gambar gagal)
function formatCaption(schedules, season, filterDay = null, source = 'api') {
    let caption = `🦋 *RIMURU ANIME SCHEDULE* 🦋\n\n`
    caption += `📅 *Musim:* ${season.toUpperCase()}\n`
    if (filterDay) caption += `📆 *Hari:* ${hariIndonesia[filterDay] || filterDay}\n`
    caption += `📡 *Source:* ${source}\n`
    caption += `━━━━━━━━━━━━━━━━━━━━\n\n`
    
    const maxShow = 12
    for (let i = 0; i < Math.min(schedules.length, maxShow); i++) {
        const anime = schedules[i]
        caption += `*${i+1}. ${anime.title}*\n`
        caption += `📀 Studio: ${anime.studio || 'Unknown'}\n`
        if (anime.time && anime.time !== 'TBA') caption += `🕐 Rilis: ${anime.time}\n`
        if (anime.day && hariIndonesia[anime.day]) caption += `📆 Hari: ${hariIndonesia[anime.day]}\n`
        if (anime.episodes) caption += `📺 Episode: ${anime.episodes}\n`
        if (anime.score && anime.score !== 'N/A') caption += `⭐ Score: ${anime.score}\n`
        caption += `━━━━━━━━━━━━━━━━━━━━\n`
    }
    
    if (schedules.length > maxShow) {
        caption += `\n*+ ${schedules.length - maxShow} anime lainnya...*\n`
    }
    
    caption += `\n💕 *Rimuru:* ${['Selamat nonton darling~', 'Jangan lupa update episode ya!', 'Ayo tonton anime baru~'][Math.floor(Math.random() * 3)]} 🦋`
    
    return caption
}

async function handler(m, { sock }) {
    const args = m.args || []
    let dayFilter = null
    let seasonQuery = null
    
    // Parse argumen
    for (const arg of args) {
        const lowerArg = arg.toLowerCase()
        if (dayMap[lowerArg]) {
            dayFilter = dayMap[lowerArg]
        } else if (lowerArg.includes('-')) {
            seasonQuery = lowerArg
        } else if (seasonMap[lowerArg]) {
            const now = new Date()
            seasonQuery = `${seasonMap[lowerArg]}-${now.getFullYear()}`
        }
    }
    
    await m.react('⏳')
    
    try {
        await m.reply('🦋 *Rimuru:* Sedang mengambil jadwal anime terbaru, darling~ tunggu sebentar ya! 💕')
        
        // Ambil data dari API
        const result = await fetchScheduleFromAPI(seasonQuery)
        
        if (!result.success || !result.data || result.data.length === 0) {
            await m.react('❌')
            return m.reply(`❌ Gagal mengambil jadwal anime!\n\nCoba lagi nanti ya darling~ 🦋`)
        }
        
        let schedules = result.data
        let filteredSchedules = schedules
        
        if (dayFilter) {
            filteredSchedules = filterByDay(schedules, dayFilter)
            if (filteredSchedules.length === 0) {
                return m.reply(`📆 *Jadwal Anime Hari ${hariIndonesia[dayFilter]}*\n\nTidak ada anime yang rilis hari ${hariIndonesia[dayFilter]} di musim ${result.season.toUpperCase()}, darling~\n\n🦋 Coba cek musim lain atau hari lain ya~ 💕`)
            }
        }
        
        // Tampilkan source di caption
        let sourceName = 'API'
        if (result.source === 'anistation') sourceName = 'LiveChart (AniStation)'
        else if (result.source === 'jikan') sourceName = 'MyAnimeList (Jikan)'
        else if (result.source === 'fallback') sourceName = 'Database (Fallback)'
        if (result.isDefault) sourceName += ' (Default)'
        
        // Coba bikin gambar
        try {
            const imgBuffer = await renderSchedule(filteredSchedules, result.season, dayFilter, sourceName)
            await sock.sendMessage(m.chat, {
                image: imgBuffer,
                caption: formatCaption(filteredSchedules, result.season, dayFilter, sourceName)
            }, { quoted: m })
        } catch (imgErr) {
            console.error('[AniSchedule] Canvas error:', imgErr)
            await m.reply(formatCaption(filteredSchedules, result.season, dayFilter, sourceName))
        }
        
        await m.react('✅')
        
    } catch (err) {
        console.error('[AniSchedule] Error:', err)
        await m.react('❌')
        await m.reply(`❌ *Error:* ${err.message}\n\nCoba lagi nanti ya darling~ 🦋`)
    }
}

export { pluginConfig as config, handler };
