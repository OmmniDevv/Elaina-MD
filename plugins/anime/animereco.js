/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import { createCanvas, loadImage } from '@napi-rs/canvas';
const pluginConfig = {
    name: 'animereco',
    alias: ['animekomen', 'rekomenanime', 'animerank', 'recoanime'],
    category: 'anime',
    description: 'Dapat rekomendasi anime berdasarkan genre atau top rating',
    usage: '.animereco [genre]',
    example: '.animereco\n.animereco action\n.animereco romance\n.animereco top',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 8,
    energi: 1,
    isEnabled: true
}

const COLORS = [
    '#ff2a6d', '#ff69b4', '#ff1493', '#ff4da6',
    '#ff6b9d', '#ff3f6c', '#ff85c1', '#ff1e56',
    '#ff5c8a', '#ff7aa2', '#fc4a8d', '#ff8fab'
]

const GLOW_COLORS = [
    '#ff2a6d', '#ff69b4', '#a855f7', '#ec4899',
    '#ff1493', '#ff4da6', '#f472b6', '#db2777'
]

const GENRE_SYMBOL = {
    action: '⚔️', adventure: '🗺️', comedy: '😂', drama: '🎭',
    romance: '💕', fantasy: '✨', horror: '👻', mystery: '🕵️',
    scifi: '🚀', thriller: '🔪', seinen: '📖', shounen: '⚡',
    slice: '🌸', sports: '⚽', top: '🏆'
}

// API Jikan
const JIKAN_API = "https://api.jikan.moe/v4"

// Daftar genre
const GENRES = {
    action: 1, adventure: 2, comedy: 4, drama: 8, ecchi: 9,
    fantasy: 10, horror: 14, mystery: 7, romance: 22, scifi: 24,
    seinen: 42, shounen: 27, slice: 36, sports: 30, thriller: 41
}

// Cache
const cache = new Map()
const CACHE_DURATION = 6 * 60 * 60 * 1000

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
}

// Draw love/heart symbol (sama kaya totalfitur)
function drawLove(ctx, cx, cy, size, color, alpha = 1, blur = 0) {
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = color
    if (blur > 0) { 
        ctx.shadowColor = color
        ctx.shadowBlur = blur 
    }
    ctx.beginPath()
    const s = size
    ctx.moveTo(cx, cy - s * 0.8)
    ctx.bezierCurveTo(cx - s, cy - s * 0.8, cx - s, cy + s * 0.4, cx, cy + s)
    ctx.bezierCurveTo(cx + s, cy + s * 0.4, cx + s, cy - s * 0.8, cx, cy - s * 0.8)
    ctx.fill()
    ctx.restore()
}

// Draw glowing star
function drawGlowStar(ctx, cx, cy, r, color) {
    ctx.save()
    ctx.shadowColor = color
    ctx.shadowBlur = 15
    ctx.fillStyle = color
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i / 5) - Math.PI / 2
        const x1 = cx + r * Math.cos(angle)
        const y1 = cy + r * Math.sin(angle)
        const x2 = cx + (r * 0.4) * Math.cos(angle + Math.PI / 5)
        const y2 = cy + (r * 0.4) * Math.sin(angle + Math.PI / 5)
        if (i === 0) ctx.moveTo(x1, y1)
        else ctx.lineTo(x1, y1)
        ctx.lineTo(x2, y2)
    }
    ctx.closePath()
    ctx.fill()
    ctx.restore()
}

function formatNumber(num) {
    if (!num) return 'N/A'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

async function getTopAnime(limit = 5) {
    const cacheKey = 'top_anime_reco'
    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey)
        if (Date.now() - cached.timestamp < CACHE_DURATION) return cached.data
        cache.delete(cacheKey)
    }

    try {
        const response = await axios.get(`${JIKAN_API}/top/anime`, {
            params: { limit, filter: 'bypopularity' },
            timeout: 15000,
            headers: { 'User-Agent': 'Rimuru-Bot/2.0' }
        })

        const animes = response.data.data.map(anime => ({
            title: anime.title,
            score: anime.score || 'N/A',
            episodes: anime.episodes || '?',
            genres: anime.genres?.slice(0, 2).map(g => g.name) || [],
            synopsis: anime.synopsis?.substring(0, 120) || '',
            image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
            url: anime.url,
            year: anime.year || '?',
            rank: anime.rank || 'N/A'
        }))

        const result = { success: true, data: animes, type: 'top' }
        cache.set(cacheKey, { data: result, timestamp: Date.now() })
        return result
    } catch (err) {
        console.error('[AnimeReco] Error:', err.message)
        return { success: false, error: err.message }
    }
}

async function getAnimeByGenre(genreName, limit = 5) {
    const genreId = GENRES[genreName.toLowerCase()]
    if (!genreId) return { success: false, error: `Genre "${genreName}" tidak ditemukan` }

    const cacheKey = `genre_reco_${genreName}`
    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey)
        if (Date.now() - cached.timestamp < CACHE_DURATION) return cached.data
        cache.delete(cacheKey)
    }

    try {
        const response = await axios.get(`${JIKAN_API}/anime`, {
            params: { genres: genreId, order_by: 'score', sort: 'desc', limit, sfw: true },
            timeout: 15000,
            headers: { 'User-Agent': 'Rimuru-Bot/2.0' }
        })

        const animes = response.data.data.map(anime => ({
            title: anime.title,
            score: anime.score || 'N/A',
            episodes: anime.episodes || '?',
            genres: anime.genres?.slice(0, 2).map(g => g.name) || [],
            synopsis: anime.synopsis?.substring(0, 120) || '',
            image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
            url: anime.url,
            year: anime.year || '?',
            rank: anime.rank || 'N/A'
        }))

        const result = { success: true, data: animes, type: 'genre', genre: genreName }
        cache.set(cacheKey, { data: result, timestamp: Date.now() })
        return result
    } catch (err) {
        console.error('[AnimeReco] Error:', err.message)
        return { success: false, error: err.message }
    }
}

async function renderRecommendationCard(animes, type, genre = null) {
    const W = 920
    const H = 680
    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext('2d')

    // 🌌 BACKGROUND GRADIENT (SAME AS TOTALFITUR)
    const bg = ctx.createLinearGradient(0, 0, W, H)
    bg.addColorStop(0, '#0a050f')
    bg.addColorStop(0.5, '#1a0b2e')
    bg.addColorStop(1, '#0a050f')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // GLOW BACKGROUND
    const glow1 = ctx.createRadialGradient(W * 0.3, H * 0.2, 0, W * 0.3, H * 0.2, 350)
    glow1.addColorStop(0, '#ff2a6d20')
    glow1.addColorStop(1, 'transparent')
    ctx.fillStyle = glow1
    ctx.fillRect(0, 0, W, H)

    const glow2 = ctx.createRadialGradient(W * 0.8, H * 0.7, 0, W * 0.8, H * 0.7, 400)
    glow2.addColorStop(0, '#a855f720')
    glow2.addColorStop(1, 'transparent')
    ctx.fillStyle = glow2
    ctx.fillRect(0, 0, W, H)

    // DECORATIVE GRID
    ctx.globalAlpha = 0.08
    for (let i = 0; i < W; i += 45) {
        ctx.strokeStyle = '#ff2a6d'
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, H)
        ctx.stroke()
    }
    for (let i = 0; i < H; i += 45) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(W, i)
        ctx.stroke()
    }
    ctx.globalAlpha = 1

    // SCATTERED LOVES
    ctx.globalAlpha = 0.1
    const lovePositions = [
        [50, 80, 8], [W-50, 80, 8], [W/2, 50, 6],
        [80, H-50, 7], [W-80, H-50, 7], [W-30, H/2, 5],
        [30, H/2, 5], [W*0.7, 100, 4], [W*0.3, H-100, 4]
    ]
    lovePositions.forEach(([x, y, s]) => {
        drawLove(ctx, x, y, s, '#ff69b4', 0.3, 10)
    })
    ctx.globalAlpha = 1

    // TITLE SECTION
    ctx.shadowColor = '#ff2a6d'
    ctx.shadowBlur = 25
    ctx.fillStyle = '#ff2a6d'
    ctx.font = 'bold 30px "Segoe UI"'
    ctx.textAlign = 'left'
    ctx.fillText('♡ RIMURU', 30, 48)
    
    ctx.fillStyle = '#ff69b4'
    ctx.font = 'bold 30px "Segoe UI"'
    ctx.fillText(' RECOMMENDATION', 30 + ctx.measureText('♡ RIMURU').width, 48)
    ctx.shadowBlur = 0

    ctx.fillStyle = '#c084fc'
    ctx.font = 'italic 11px "Segoe UI"'
    ctx.fillText('♡ anime recommendation • based on myanimelist', 35, 72)

    // SUBTITLE CARD
    let subtitle = ''
    let subtitleColor = '#ff2a6d'
    if (type === 'top') {
        subtitle = '🏆 TOP ANIME BY POPULARITY 🏆'
        subtitleColor = '#ffd700'
    } else if (genre) {
        const symbol = GENRE_SYMBOL[genre] || '🎭'
        subtitle = `${symbol} ${genre.toUpperCase()} ANIME ${symbol}`
        subtitleColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    }
    
    ctx.save()
    roundRect(ctx, W - 280, 22, 250, 50, 12)
    ctx.fillStyle = `${subtitleColor}20`
    ctx.fill()
    ctx.strokeStyle = subtitleColor
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = subtitleColor
    ctx.font = 'bold 11px "Segoe UI"'
    ctx.textAlign = 'center'
    ctx.fillText(subtitle, W - 155, 52)
    ctx.restore()

    // SEPARATOR LINE
    ctx.strokeStyle = '#ff2a6d'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(25, 90)
    ctx.lineTo(W - 25, 90)
    ctx.stroke()

    // SECTION HEADER
    ctx.fillStyle = '#ffc1e3'
    ctx.font = 'bold 14px "Segoe UI"'
    ctx.textAlign = 'left'
    ctx.fillText('★ RECOMMENDATION LIST', 35, 122)

    // RECOMMENDATION CARDS
    let y = 148
    for (let i = 0; i < animes.length; i++) {
        const anime = animes[i]
        const color = COLORS[i % COLORS.length]
        
        // Card background
        ctx.fillStyle = '#1a0b1a'
        roundRect(ctx, 35, y - 2, W - 70, 85, 12)
        ctx.fill()
        
        // Glowing border
        ctx.strokeStyle = color
        ctx.lineWidth = 1.5
        roundRect(ctx, 35, y - 2, W - 70, 85, 12)
        ctx.stroke()

        // Ranking number dengan efek glow
        ctx.shadowColor = color
        ctx.shadowBlur = 12
        ctx.fillStyle = color
        ctx.font = 'bold 24px "Segoe UI"'
        ctx.fillText(`${i+1}`, 55, y + 42)
        ctx.shadowBlur = 0

        // COVER ANIME (thumbnail)
        try {
            if (anime.image) {
                const response = await axios.get(anime.image, { responseType: 'arraybuffer', timeout: 8000 })
                const imgBuffer = Buffer.from(response.data)
                const cover = await loadImage(imgBuffer)
                ctx.save()
                roundRect(ctx, 85, y + 5, 55, 70, 8)
                ctx.clip()
                ctx.drawImage(cover, 85, y + 5, 55, 70)
                ctx.restore()
            } else {
                ctx.fillStyle = '#1e1028'
                roundRect(ctx, 85, y + 5, 55, 70, 8)
                ctx.fill()
                ctx.fillStyle = color
                ctx.font = '24px "Segoe UI"'
                ctx.fillText('📘', 110, y + 48)
            }
        } catch (err) {
            ctx.fillStyle = '#1e1028'
            roundRect(ctx, 85, y + 5, 55, 70, 8)
            ctx.fill()
            ctx.fillStyle = color
            ctx.font = '24px "Segoe UI"'
            ctx.fillText('📘', 110, y + 48)
        }

        // Anime title
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 14px "Segoe UI"'
        let title = anime.title.length > 38 ? anime.title.substring(0, 35) + '...' : anime.title
        ctx.fillText(title, 155, y + 22)

        // Score dengan star
        ctx.fillStyle = '#ffd700'
        ctx.font = 'bold 11px "Segoe UI"'
        ctx.fillText(`★ ${anime.score}`, 155, y + 42)
        
        // Info badges
        ctx.fillStyle = '#06b6d4'
        ctx.font = '9px "Segoe UI"'
        ctx.fillText(`📺 ${anime.episodes} eps`, 230, y + 42)
        
        ctx.fillStyle = '#fbbf24'
        ctx.fillText(`📅 ${anime.year}`, 320, y + 42)

        // Genres
        if (anime.genres.length) {
            ctx.fillStyle = '#c084fc'
            ctx.font = '8px "Segoe UI"'
            let genreText = anime.genres.join(' ◆ ')
            ctx.fillText(genreText, 155, y + 62)
        }

        // Synopsis (single line)
        ctx.fillStyle = '#c084fc'
        ctx.font = '8px "Segoe UI"'
        let synopsis = anime.synopsis.length > 65 ? anime.synopsis.substring(0, 62) + '...' : anime.synopsis
        ctx.fillText(synopsis, 155, y + 78)

        y += 92
    }

    // BOTTOM STATS CARD (SAME AS TOTALFITUR)
    const bottomY = H - 85
    const activePercent = (animes.length / 10) * 100

    ctx.save()
    roundRect(ctx, 30, bottomY, W - 60, 70, 15)
    ctx.fillStyle = '#1a0b1a'
    ctx.fill()
    ctx.strokeStyle = '#ff2a6d'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Mini donut chart
    const miniCx = 70
    const miniCy = bottomY + 35
    const miniR = 25
    
    const activeAngle = (animes.length / 10) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(miniCx, miniCy, miniR, 0, Math.PI * 2)
    ctx.fillStyle = '#2a152b'
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(miniCx, miniCy, miniR, -Math.PI / 2, -Math.PI / 2 + activeAngle)
    ctx.fillStyle = '#10b981'
    ctx.shadowColor = '#10b981'
    ctx.shadowBlur = 10
    ctx.fill()
    ctx.shadowBlur = 0

    // Stats text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px "Segoe UI"'
    ctx.fillText('SHOWING', 110, bottomY + 25)
    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 24px "Segoe UI"'
    ctx.fillText(`${animes.length} / 5`, 110, bottomY + 52)
    
    ctx.fillStyle = '#c084fc'
    ctx.font = '10px "Segoe UI"'
    ctx.fillText(`${type === 'top' ? 'Top Anime' : genre ? genre.toUpperCase() : 'Random'} Recommendation`, 250, bottomY + 45)

    // Rimuru message
    ctx.fillStyle = '#ff69b4'
    ctx.font = 'italic 10px "Segoe UI"'
    ctx.textAlign = 'right'
    ctx.fillText(`♡ ${type === 'top' ? 'Top rated anime darling~' : `Enjoy your ${genre || 'random'} anime!`} ♡`, W - 45, bottomY + 45)
    ctx.textAlign = 'left'

    // FOOTER WATERMARK
    ctx.fillStyle = '#ff2a6d'
    ctx.font = 'bold 10px "Segoe UI"'
    ctx.textAlign = 'center'
    ctx.fillText('♡ RIMURU AI | ANIME RECOMMENDATION ♡', W / 2, H - 12)
    
    return canvas.toBuffer('image/png')
}

function formatCaption(animes, type, genre = null) {
    let caption = `💕 *RIMURU RECOMMENDATION* 💕\n\n`
    
    if (type === 'top') {
        caption += `🏆 *TOP ANIME BY POPULARITY* 🏆\n\n`
    } else if (genre) {
        const symbol = GENRE_SYMBOL[genre] || '🎭'
        caption += `${symbol} *${genre.toUpperCase()} ANIME* ${symbol}\n\n`
    }
    
    for (let i = 0; i < animes.length; i++) {
        const anime = animes[i]
        caption += `${i+1}. *${anime.title}*\n`
        caption += `   ★ Score: ${anime.score} ◆ 📺 ${anime.episodes} eps ◆ 📅 ${anime.year}\n`
        if (anime.genres.length) caption += `   🎭 Genre: ${anime.genres.join(', ')}\n`
        caption += `   📖 ${anime.synopsis.substring(0, 100)}${anime.synopsis.length > 100 ? '...' : ''}\n\n`
    }
    
    caption += `💕 *Rimuru:* ${type === 'top' ? 'Ini anime favorit banyak orang darling~' : `Wah suka anime ${genre}? Rekomendasi ini buat kamu darling~`} 🦋`
    
    return caption
}

async function handler(m, { sock }) {
    const query = m.text?.trim()?.toLowerCase() || ''
    
    await m.react('💕')
    
    try {
        let result
        
        if (query === 'top' || query === 'popular') {
            await m.reply(`🦋 *Rimuru:* Lagi ambil daftar top anime... tunggu sebentar ya darling~ ⭐`)
            result = await getTopAnime(5)
        } else if (query && GENRES[query]) {
            const symbol = GENRE_SYMBOL[query] || '🎭'
            await m.reply(`🦋 *Rimuru:* Lagi cari rekomendasi anime *${query}*... tunggu sebentar ya darling~ ${symbol}`)
            result = await getAnimeByGenre(query, 5)
        } else if (query) {
            const genreList = Object.keys(GENRES).join(', ')
            return m.reply(
                `🎭 *RIMURU ANIME RECOMMENDATION* 🎭\n\n` +
                `📌 *Genre yang tersedia:*\n${genreList}\n\n` +
                `📌 *Contoh:*\n` +
                `• ${m.prefix}animereco action\n` +
                `• ${m.prefix}animereco romance\n` +
                `• ${m.prefix}animereco top\n` +
                `• ${m.prefix}animereco (tanpa genre = random)\n\n` +
                `💕 *Rimuru:* Mau rekomendasi anime genre apa darling~? 🦋`
            )
        } else {
            const genreKeys = Object.keys(GENRES)
            const randomGenre = genreKeys[Math.floor(Math.random() * genreKeys.length)]
            await m.reply(`🦋 *Rimuru:* Lagi cari rekomendasi anime random... tunggu sebentar ya darling~ 🎲`)
            result = await getAnimeByGenre(randomGenre, 5)
        }
        
        if (!result.success) {
            await m.react('💔')
            return m.reply(`💔 *Gagal mengambil rekomendasi!*\n\n${result.error}\n\nCoba lagi nanti ya darling~ 🦋`)
        }
        
        try {
            const imgBuffer = await renderRecommendationCard(result.data, result.type, result.genre)
            await sock.sendMessage(m.chat, {
                image: imgBuffer,
                caption: formatCaption(result.data, result.type, result.genre)
            }, { quoted: m })
        } catch (imgErr) {
            console.error('[AnimeReco] Canvas error:', imgErr)
            await m.reply(formatCaption(result.data, result.type, result.genre))
        }
        
        await m.react('💕')
        
    } catch (err) {
        console.error('[AnimeReco] Error:', err)
        await m.react('💔')
        await m.reply(`💔 *Error Darling!*\n\n> ${err.message}\n\nCoba lagi nanti ya~ ♡`)
    }
}

export { pluginConfig as config, handler };
