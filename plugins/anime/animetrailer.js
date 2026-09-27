/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import yts from 'yt-search';
import { createCanvas, loadImage } from '@napi-rs/canvas';
const pluginConfig = {
    name: 'animetrailer',
    alias: ['traileranime', 'animepv', 'animepromo'],
    category: 'anime',
    description: 'Cari dan share trailer / PV anime terbaru dari YouTube',
    usage: '.animetrailer <judul anime>',
    example: '.animetrailer jujutsu kaisen\n.animetrailer chainsaw man\n.animetrailer one piece',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 8,
    energi: 1,
    isEnabled: true
}

const THEME = {
    bg: '#0a050f',           // dark purple background
    bgGradient2: '#1a0b2e',  // ungu tua
    bgGradient3: '#0f0a1a',  // deep purple
    primary: '#ff2a6d',      // hot pink (Rimuru signature)
    secondary: '#ff69b4',    // pink
    tertiary: '#b9266b',     // dark pink
    blue: '#3b82f6',         // biru cerah
    lightBlue: '#60a5fa',    // biru muda
    cyan: '#06b6d4',         // cyan
    green: '#10b981',        // hijau neon
    purple: '#a855f7',       // ungu
    magenta: '#ec4899',      // magenta
    white: '#ffffff',
    gray: '#c084fc',         // ungu muda
    glow: '#ff2a6d',
    cardBg: '#1e1028',       // card background unggu gelap
    yellow: '#fbbf24'        // kuning buat aksen
}

// API Jikan buat cari info anime
const JIKAN_API = "https://api.jikan.moe/v4"

// Cache
const cache = new Map()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 jam

async function searchAnime(query) {
    const cacheKey = `anime_${query.toLowerCase()}`
    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey)
        if (Date.now() - cached.timestamp < CACHE_DURATION) return cached.data
        cache.delete(cacheKey)
    }

    try {
        const searchRes = await axios.get(`${JIKAN_API}/anime`, {
            params: { q: query, limit: 1, sfw: true },
            timeout: 10000,
            headers: { 'User-Agent': 'Rimuru-Bot/1.0' }
        })

        if (!searchRes.data.data || searchRes.data.data.length === 0) {
            return { success: false, error: 'Anime tidak ditemukan' }
        }

        const anime = searchRes.data.data[0]
        const result = {
            success: true,
            data: {
                id: anime.mal_id,
                title: anime.title,
                titleEnglish: anime.title_english,
                titleJapanese: anime.title_japanese,
                synopsis: anime.synopsis?.substring(0, 200) || '',
                type: anime.type,
                episodes: anime.episodes || '?',
                status: anime.status,
                year: anime.year,
                score: anime.score || 'N/A',
                trailer: anime.trailer?.url || anime.trailer?.embed_url,
                image: anime.images?.jpg?.image_url
            }
        }
        cache.set(cacheKey, { data: result, timestamp: Date.now() })
        return result
    } catch (err) {
        console.error('[AnimeTrailer] Error:', err.message)
        return { success: false, error: err.message }
    }
}

async function searchTrailerOnYoutube(animeTitle) {
    const searchQueries = [
        `${animeTitle} trailer`,
        `${animeTitle} pv`,
        `${animeTitle} promo`,
        `${animeTitle} official trailer`
    ]
    
    for (const query of searchQueries) {
        const searchResult = await yts(query)
        if (searchResult.videos.length > 0) {
            for (const video of searchResult.videos) {
                const title = video.title.toLowerCase()
                if (title.includes('trailer') || title.includes('pv') || title.includes('promo')) {
                    return {
                        success: true,
                        data: {
                            title: video.title,
                            url: video.url,
                            duration: video.timestamp,
                            views: video.views,
                            author: video.author.name,
                            thumbnail: video.thumbnail
                        }
                    }
                }
            }
            const video = searchResult.videos[0]
            return {
                success: true,
                data: {
                    title: video.title,
                    url: video.url,
                    duration: video.timestamp,
                    views: video.views,
                    author: video.author.name,
                    thumbnail: video.thumbnail
                }
            }
        }
    }
    
    return { success: false, error: 'Trailer tidak ditemukan di YouTube' }
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

async function renderTrailerCard(anime, trailer) {
    const w = 550
    const h = 520
    const canvas = createCanvas(w, h)
    const ctx = canvas.getContext('2d')

    // Gradient background 3 warna
    const grad = ctx.createLinearGradient(0, 0, w, h)
    grad.addColorStop(0, THEME.bg)
    grad.addColorStop(0.5, THEME.bgGradient2)
    grad.addColorStop(1, THEME.bgGradient3)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // Dekorasi garis warna-warni
    ctx.globalAlpha = 0.1
    const colors = [THEME.primary, THEME.blue, THEME.green, THEME.purple, THEME.yellow]
    for (let i = 0; i < w; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, h)
        ctx.strokeStyle = colors[i % colors.length]
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(w, i)
        ctx.stroke()
    }
    ctx.globalAlpha = 1

    // Border gradient warna-warni
    const borderGrad = ctx.createLinearGradient(0, 0, w, 0)
    borderGrad.addColorStop(0, THEME.primary)
    borderGrad.addColorStop(0.25, THEME.magenta)
    borderGrad.addColorStop(0.5, THEME.blue)
    borderGrad.addColorStop(0.75, THEME.green)
    borderGrad.addColorStop(1, THEME.purple)
    ctx.strokeStyle = borderGrad
    ctx.lineWidth = 3
    ctx.strokeRect(12, 12, w - 24, h - 24)

    ctx.strokeStyle = THEME.secondary
    ctx.lineWidth = 1
    ctx.strokeRect(16, 16, w - 32, h - 32)

    // Header
    ctx.fillStyle = THEME.primary
    ctx.font = 'bold 20px "Segoe UI"'
    ctx.textAlign = 'center'
    ctx.shadowColor = THEME.glow
    ctx.shadowBlur = 15
    ctx.fillText('≫ RIMURU ANIME TRAILER ≪', w/2, 42)
    ctx.shadowBlur = 0

    // Garis dekorasi
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
        ctx.moveTo(w/2 - 100 + (i * 50), 52)
        ctx.lineTo(w/2 - 90 + (i * 50) + 20, 52)
        ctx.strokeStyle = colors[i]
        ctx.lineWidth = 2
        ctx.stroke()
    }

    // COVER ANIME (nempel beneran)
    try {
        if (anime.image) {
            const response = await axios.get(anime.image, { responseType: 'arraybuffer' })
            const coverBuffer = Buffer.from(response.data)
            const coverImage = await loadImage(coverBuffer)
            
            // Bikin rounded corner buat cover
            ctx.save()
            roundRect(ctx, 25, 70, 100, 130, 10)
            ctx.clip()
            ctx.drawImage(coverImage, 25, 70, 100, 130)
            ctx.restore()
        } else {
            throw new Error('No image')
        }
    } catch (err) {
        // Fallback kalo gagal load cover
        ctx.fillStyle = THEME.cardBg
        ctx.fillRect(25, 70, 100, 130)
        ctx.fillStyle = THEME.primary
        ctx.font = 'bold 14px "Segoe UI"'
        ctx.textAlign = 'center'
        ctx.fillText('NO COVER', 75, 135)
    }
    
    // Border warna-warni buat cover
    const borderColors = [THEME.primary, THEME.blue, THEME.green, THEME.purple]
    for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = borderColors[i]
        ctx.lineWidth = 1.5
        ctx.strokeRect(25 - i, 70 - i, 100 + (i*2), 130 + (i*2))
    }

    // Anime title
    ctx.font = 'bold 18px "Segoe UI"'
    const titleGrad = ctx.createLinearGradient(140, 95, 400, 95)
    titleGrad.addColorStop(0, THEME.primary)
    titleGrad.addColorStop(1, THEME.blue)
    ctx.fillStyle = titleGrad
    ctx.textAlign = 'left'
    let title = anime.title.length > 30 ? anime.title.substring(0, 27) + '...' : anime.title
    ctx.fillText(title, 140, 100)

    if (anime.titleEnglish && anime.titleEnglish !== anime.title) {
        ctx.font = '11px "Segoe UI"'
        ctx.fillStyle = THEME.gray
        let engTitle = anime.titleEnglish.length > 35 ? anime.titleEnglish.substring(0, 32) + '...' : anime.titleEnglish
        ctx.fillText(engTitle, 140, 122)
    }

    // Anime info
    ctx.fillStyle = THEME.secondary
    ctx.font = 'bold 11px "Segoe UI"'
    ctx.fillText(`${anime.type || 'TV'} ◆ ${anime.episodes} eps`, 140, 148)
    
    ctx.fillStyle = THEME.cyan
    ctx.font = '10px "Segoe UI"'
    ctx.fillText(`★ ${anime.score}`, 140, 168)
    ctx.fillStyle = THEME.yellow
    ctx.fillText(` ◆ ${anime.year || '?'}`, 140 + ctx.measureText(`★ ${anime.score}`).width, 168)
    ctx.fillStyle = THEME.green
    ctx.fillText(` ◆ ${anime.status || 'Unknown'}`, 140 + ctx.measureText(`★ ${anime.score} ◆ ${anime.year || '?'}`).width, 168)

    // Trailer info box
    const gradBox = ctx.createLinearGradient(25, 215, w - 25, 215)
    gradBox.addColorStop(0, '#ff2a6d40')
    gradBox.addColorStop(0.5, '#3b82f640')
    gradBox.addColorStop(1, '#a855f740')
    ctx.fillStyle = gradBox
    roundRect(ctx, 25, 215, w - 50, 110, 10)
    ctx.fill()

    ctx.fillStyle = THEME.magenta
    ctx.font = 'bold 12px "Segoe UI"'
    ctx.fillText('▶ TRAILER', 40, 242)

    ctx.fillStyle = THEME.white
    ctx.font = '11px "Segoe UI"'
    let trailerTitle = trailer.title.length > 50 ? trailer.title.substring(0, 47) + '...' : trailer.title
    ctx.fillText(trailerTitle, 40, 265)

    ctx.font = '9px "Segoe UI"'
    ctx.fillStyle = THEME.cyan
    ctx.fillText(`◎ ${trailer.author}`, 40, 288)
    ctx.fillStyle = THEME.yellow
    ctx.fillText(` ◆ ${trailer.duration}`, 40 + ctx.measureText(`◎ ${trailer.author}`).width, 288)
    ctx.fillStyle = THEME.green
    ctx.fillText(` ◆ ${formatNumber(trailer.views)} views`, 40 + ctx.measureText(`◎ ${trailer.author} ◆ ${trailer.duration}`).width, 288)

    // Cara nonton box
    const gradBox2 = ctx.createLinearGradient(25, 340, w - 25, 340)
    gradBox2.addColorStop(0, '#ec489940')
    gradBox2.addColorStop(1, '#3b82f640')
    ctx.fillStyle = gradBox2
    roundRect(ctx, 25, 340, w - 50, 105, 10)
    ctx.fill()

    ctx.fillStyle = THEME.purple
    ctx.font = 'bold 11px "Segoe UI"'
    ctx.fillText('▸ HOW TO WATCH', 40, 365)

    ctx.fillStyle = THEME.white
    ctx.font = '10px "Segoe UI"'
    ctx.fillText('1. Klik link YouTube di bawah', 40, 388)
    ctx.fillStyle = THEME.blue
    ctx.fillText('2. Buka di browser / WhatsApp Web', 40, 406)
    ctx.fillStyle = THEME.green
    ctx.fillText('3. Klik play untuk nonton trailer', 40, 424)

    // Link trailer
    ctx.fillStyle = THEME.cyan
    ctx.font = '8px "Segoe UI"'
    let shortUrl = trailer.url.length > 70 ? trailer.url.substring(0, 67) + '...' : trailer.url
    ctx.fillText(`⌕ ${shortUrl}`, 40, 452)

    // Footer
    ctx.fillStyle = THEME.magenta
    ctx.font = 'bold 8px "Segoe UI"'
    ctx.textAlign = 'center'
    ctx.fillText('∼ RIMURU AI | ANIME TRAILER ∼', w/2, 500)
    
    ctx.fillStyle = THEME.blue
    ctx.font = '7px "Segoe UI"'
    ctx.fillText('♥ ♦ ♣ ♠', w/2, 512)

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

function formatCaption(anime, trailer) {
    let caption = `🎬 *RIMURU ANIME TRAILER* 🎬\n\n`
    caption += `📺 *${anime.title}*\n`
    if (anime.titleEnglish && anime.titleEnglish !== anime.title) caption += `📖 *English:* ${anime.titleEnglish}\n`
    caption += `\n`
    caption += `⭐ *Score:* ${anime.score}\n`
    caption += `📺 *Type:* ${anime.type || 'TV'} (${anime.episodes} eps)\n`
    caption += `📌 *Status:* ${anime.status}\n`
    caption += `📅 *Year:* ${anime.year || '?'}\n`
    caption += `\n`
    caption += `🎬 *Trailer:*\n`
    caption += `📌 *Judul:* ${trailer.title}\n`
    caption += `👤 *Channel:* ${trailer.author}\n`
    caption += `⏱️ *Durasi:* ${trailer.duration}\n`
    caption += `👁️ *Views:* ${formatNumber(trailer.views)}\n`
    caption += `\n`
    caption += `🔗 *Link:* ${trailer.url}\n`
    caption += `\n`
    caption += `💕 *Rimuru:* ${['Ayo nonton trailernya darling~', 'Keren banget PV-nya!', 'Anime ini seru nih~', 'Darling mau nonton anime ini?', 'Rimuru sayang banget sama kamu~'][Math.floor(Math.random() * 5)]} 🦋`
    return caption
}

async function handler(m, { sock }) {
    const query = m.text?.trim()
    
    if (!query) {
        return m.reply(
            `🎬 *RIMURU ANIME TRAILER* 🎬\n\n` +
            `📌 *Cara pakai:*\n• ${m.prefix}animetrailer <judul anime>\n\n` +
            `📌 *Contoh:*\n` +
            `• ${m.prefix}animetrailer jujutsu kaisen\n` +
            `• ${m.prefix}animetrailer chainsaw man\n` +
            `• ${m.prefix}animetrailer one piece\n\n` +
            `💕 *Rimuru:* Mau nonton trailer anime apa darling~? 🎥`
        )
    }

    await m.react('🎬')
    
    try {
        await m.reply(`🦋 *Rimuru:* Lagi nyari trailer *${query}*... tunggu sebentar ya darling~ 🎥`)
        
        const animeResult = await searchAnime(query)
        if (!animeResult.success) {
            await m.react('❌')
            return m.reply(`❌ *Anime tidak ditemukan!*\n\n*${query}* gak ketemu di database.\n\nCoba cek ejaannya atau pake judul lain ya darling~ 🦋`)
        }
        
        const trailerResult = await searchTrailerOnYoutube(animeResult.data.title)
        if (!trailerResult.success) {
            await m.react('❌')
            return m.reply(`❌ *Trailer tidak ditemukan!*\n\nTrailer untuk *${animeResult.data.title}* gak ketemu di YouTube.\n\nCoba cari manual di YouTube ya darling~ 🦋`)
        }
        
        try {
            const imgBuffer = await renderTrailerCard(animeResult.data, trailerResult.data)
            await sock.sendMessage(m.chat, {
                image: imgBuffer,
                caption: formatCaption(animeResult.data, trailerResult.data)
            }, { quoted: m })
        } catch (imgErr) {
            console.error('[AnimeTrailer] Canvas error:', imgErr)
            await m.reply(formatCaption(animeResult.data, trailerResult.data))
        }
        
        await m.react('✅')
        
    } catch (err) {
        console.error('[AnimeTrailer] Error:', err)
        await m.react('❌')
        await m.reply(`❌ *Error:* ${err.message}\n\nCoba lagi nanti ya darling~ 🦋`)
    }
}

export { pluginConfig as config, handler };
