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
    name: 'animeseason',
    alias: ['season', 'musimanime', 'animemusim'],
    category: 'anime',
    description: 'Info lengkap anime musim ini (Spring/Summer/Fall/Winter) + statistik',
    usage: '.animeseason [season]',
    example: '.animeseason\n.animeseason spring\n.animeseason summer\n.animeseason fall\n.animeseason winter\n.animeseason 2024',
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
    gold: '#ffd700',
    cyan: '#00ffff'
}

// API Jikan
const JIKAN_API = "https://api.jikan.moe/v4"

// Season mapping
const SEASONS = {
    winter: { id: 'winter', name: 'Winter', emoji: '❄️', bulan: 'Januari - Maret', color: '#00bfff' },
    spring: { id: 'spring', name: 'Spring', emoji: '🌸', bulan: 'April - Juni', color: '#ff69b4' },
    summer: { id: 'summer', name: 'Summer', emoji: '☀️', bulan: 'Juli - September', color: '#ffa500' },
    fall: { id: 'fall', name: 'Fall', emoji: '🍂', bulan: 'Oktober - Desember', color: '#cd853f' }
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
    const cacheKey = `season_${season}_${year}`
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

        const animes = response.data.data.map(anime => ({
            title: anime.title,
            score: anime.score || 'N/A',
            members: anime.members || 0,
            episodes: anime.episodes || '?',
            status: anime.status,
            year: anime.year,
            genres: anime.genres?.slice(0, 2).map(g => g.name) || [],
            image: anime.images?.jpg?.image_url
        }))

        // Hitung statistik
        const totalAnime = animes.length
        const avgScore = (animes.reduce((sum, a) => sum + (a.score !== 'N/A' ? a.score : 0), 0) / animes.filter(a => a.score !== 'N/A').length).toFixed(1)
        const topRated = [...animes].sort((a, b) => (b.score !== 'N/A' ? b.score : 0) - (a.score !== 'N/A' ? a.score : 0)).slice(0, 5)
        const mostPopular = [...animes].sort((a, b) => b.members - a.members).slice(0, 5)
        
        const result = { 
            success: true, 
            data: animes, 
            season, 
            year,
            stats: {
                total: totalAnime,
                avgScore: avgScore,
                topRated,
                mostPopular
            }
        }
        cache.set(cacheKey, { data: result, timestamp: Date.now() })
        return result
    } catch (err) {
        console.error('[AnimeSeason] Error:', err.message)
        if (err.response?.status === 429) {
            return { success: false, error: 'Terlalu banyak request, coba lagi nanti darling~' }
        }
        return { success: false, error: err.message }
    }
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

async function renderSeasonCard(seasonData, stats, season, year) {
    const w = 550
    let h = 480
    h = Math.min(h + (stats.topRated.length * 45), 850)
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
    ctx.font = 'bold 20px "Segoe UI"'
    ctx.textAlign = 'center'
    ctx.shadowColor = THEME.glow
    ctx.shadowBlur = 10
    ctx.fillText(`🍂 RIMURU SEASONAL ANIME 🍂`, w/2, 42)
    ctx.shadowBlur = 0

    const seasonColor = SEASONS[season]?.color || THEME.secondary
    ctx.fillStyle = seasonColor
    ctx.font = 'bold 16px "Segoe UI"'
    ctx.fillText(`${SEASONS[season]?.emoji} ${SEASONS[season]?.name} ${year} ${SEASONS[season]?.emoji}`, w/2, 70)

    // Stats box
    ctx.fillStyle = '#00000040'
    roundRect(ctx, 25, 95, w - 50, 85, 10)
    ctx.fill()

    ctx.fillStyle = THEME.primary
    ctx.font = 'bold 12px "Segoe UI"'
    ctx.fillText('📊 STATISTICS', 40, 120)

    ctx.fillStyle = THEME.white
    ctx.font = '11px "Segoe UI"'
    ctx.fillText(`🎬 Total Anime: ${stats.total}`, 40, 145)
    ctx.fillText(`⭐ Average Score: ${stats.avgScore}`, 40, 165)

    ctx.fillStyle = THEME.secondary
    ctx.fillText(`📅 ${SEASONS[season]?.bulan}`, w - 120, 145)

    // Top Rated
    let y = 200
    ctx.fillStyle = THEME.gold
    ctx.font = 'bold 13px "Segoe UI"'
    ctx.fillText('🏆 TOP RATED 🏆', 40, y)
    y += 20

    for (let i = 0; i < stats.topRated.length; i++) {
        const anime = stats.topRated[i]
        ctx.fillStyle = '#00000030'
        roundRect(ctx, 25, y - 8, w - 50, 35, 6)
        ctx.fill()

        ctx.fillStyle = THEME.gold
        ctx.font = 'bold 10px "Segoe UI"'
        ctx.fillText(`${i+1}.`, 35, y + 8)

        ctx.fillStyle = THEME.white
        ctx.font = '9px "Segoe UI"'
        let title = anime.title.length > 35 ? anime.title.substring(0, 32) + '...' : anime.title
        ctx.fillText(title, 50, y + 8)

        ctx.fillStyle = THEME.primary
        ctx.font = 'bold 9px "Segoe UI"'
        ctx.fillText(`⭐ ${anime.score}`, w - 50, y + 8)

        y += 32
    }

    ctx.fillStyle = `${THEME.primary}80`
    ctx.font = '9px "Segoe UI"'
    ctx.fillText('❥ Rimuru AI | Data from MyAnimeList (Jikan API)', w/2, h - 18)

    return canvas.toBuffer('image/png')
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
    return ctx
}

function formatCaption(stats, season, year) {
    const seasonData = SEASONS[season]
    let caption = `🍂 *RIMURU SEASONAL ANIME* 🍂\n\n`
    caption += `${seasonData.emoji} *${seasonData.name} ${year}* ${seasonData.emoji}\n`
    caption += `📅 ${seasonData.bulan}\n`
    caption += `━━━━━━━━━━━━━━━━━━━━\n\n`
    
    caption += `📊 *STATISTICS*\n`
    caption += `• Total Anime: ${stats.total}\n`
    caption += `• Rata-rata Score: ⭐ ${stats.avgScore}\n\n`
    
    caption += `🏆 *TOP 5 RATING* 🏆\n`
    for (let i = 0; i < stats.topRated.length; i++) {
        const anime = stats.topRated[i]
        caption += `${i+1}. *${anime.title}* — ⭐ ${anime.score}\n`
    }
    
    caption += `\n🔥 *MOST POPULAR* 🔥\n`
    for (let i = 0; i < stats.mostPopular.length; i++) {
        const anime = stats.mostPopular[i]
        caption += `${i+1}. *${anime.title}* — 👁️ ${formatNumber(anime.members)}\n`
    }
    
    caption += `\n💕 *Rimuru:* ${seasonData.emoji} Musim ${seasonData.name} penuh anime keren nih darling~ jangan sampai ketinggalan! 🦋`
    
    return caption
}

async function handler(m, { sock }) {
    let seasonQuery = m.text?.trim()?.toLowerCase() || ''
    let year = new Date().getFullYear()
    let season = null
    
    // Parse tahun kalo ada
    const yearMatch = seasonQuery.match(/\d{4}/)
    if (yearMatch) {
        year = parseInt(yearMatch[0])
        seasonQuery = seasonQuery.replace(yearMatch[0], '').trim()
    }
    
    // Parse season
    if (seasonQuery && SEASONS[seasonQuery]) {
        season = seasonQuery
    } else {
        season = getCurrentSeason()
    }
    
    await m.react('🍂')
    
    try {
        await m.reply(`🦋 *Rimuru:* Lagi ambil info anime ${SEASONS[season].emoji} ${SEASONS[season].name} ${year}... tunggu sebentar ya~ 🍂`)
        
        const result = await getSeasonalAnime(season, year)
        
        if (!result.success) {
            await m.react('❌')
            return m.reply(`❌ *Gagal mengambil data!*\n\n${result.error}\n\nCoba musim atau tahun lain ya darling~ 🦋`)
        }
        
        try {
            const imgBuffer = await renderSeasonCard(result.data, result.stats, season, year)
            await sock.sendMessage(m.chat, {
                image: imgBuffer,
                caption: formatCaption(result.stats, season, year)
            }, { quoted: m })
        } catch (imgErr) {
            console.error('[AnimeSeason] Canvas error:', imgErr)
            await m.reply(formatCaption(result.stats, season, year))
        }
        
        await m.react('✅')
        
    } catch (err) {
        console.error('[AnimeSeason] Error:', err)
        await m.react('❌')
        await m.reply(`❌ *Error:* ${err.message}\n\nCoba lagi nanti ya darling~ 🦋`)
    }
}

export { pluginConfig as config, handler };
