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
    name: 'character',
    alias: ['karakter', 'animechar', 'char'],
    category: 'anime',
    description: 'Cari profil karakter anime dari MyAnimeList',
    usage: '.character <nama karakter>',
    example: '.character zero two\n.character gojo\n.character luffy',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 5,
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

// API Jikan (MyAnimeList)
const JIKAN_API = "https://api.jikan.moe/v4"

// Cache
const cache = new Map()
const CACHE_DURATION = 60 * 60 * 1000 // 1 jam

async function searchCharacter(query) {
    const cacheKey = query.toLowerCase()
    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey)
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data
        }
        cache.delete(cacheKey)
    }

    try {
        // Search karakter
        const searchRes = await axios.get(`${JIKAN_API}/characters`, {
            params: { q: query, limit: 1, order_by: 'favorites', sort: 'desc' },
            timeout: 10000,
            headers: { 'User-Agent': 'Rimuru-Bot/1.0' }
        })

        if (!searchRes.data.data || searchRes.data.data.length === 0) {
            return { success: false, error: 'Karakter tidak ditemukan' }
        }

        const char = searchRes.data.data[0]
        const charId = char.mal_id

        // Ambil detail lengkap
        const detailRes = await axios.get(`${JIKAN_API}/characters/${charId}/full`, {
            timeout: 10000,
            headers: { 'User-Agent': 'Rimuru-Bot/1.0' }
        })

        const data = detailRes.data.data

        // Ambil anime tempat karakter muncul
        const animeList = data.anime?.slice(0, 3).map(a => a.anime?.title) || []
        
        // Ambil voice actor (pengisi suara)
        const voiceActors = data.voices?.filter(v => v.language === 'Japanese').slice(0, 2) || []
        const seiyuu = voiceActors.map(v => v.person?.name).join(', ') || 'Tidak diketahui'

        const result = {
            success: true,
            data: {
                id: data.mal_id,
                name: data.name,
                nameJapanese: data.name_kanji || null,
                nicknames: data.nicknames || [],
                about: data.about?.replace(/\[[^\]]+\]/g, '').substring(0, 800) || 'Tidak ada deskripsi',
                favorites: data.favorites || 0,
                image: data.images?.jpg?.image_url,
                animeAppear: animeList,
                seiyuu: seiyuu,
                url: data.url
            }
        }

        cache.set(cacheKey, { data: result, timestamp: Date.now() })
        return result

    } catch (err) {
        console.error('[Character] Error:', err.message)
        if (err.response?.status === 429) {
            return { success: false, error: 'Terlalu banyak request, coba lagi nanti darling~' }
        }
        return { success: false, error: err.message }
    }
}

// Format angka
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

// Render canvas
async function renderCharacterCard(char) {
    const w = 550
    const h = 650
    const canvas = createCanvas(w, h)
    const ctx = canvas.getContext('2d')

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h)
    grad.addColorStop(0, THEME.bg)
    grad.addColorStop(1, THEME.cardBg)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // Grid cyber
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

    // Border
    ctx.strokeStyle = THEME.primary
    ctx.lineWidth = 3
    ctx.strokeRect(12, 12, w - 24, h - 24)

    // Header
    ctx.fillStyle = THEME.primary
    ctx.font = 'bold 20px "Segoe UI"'
    ctx.textAlign = 'center'
    ctx.shadowColor = THEME.glow
    ctx.shadowBlur = 10
    ctx.fillText('🦋 RIMURU CHARACTER 🦋', w/2, 42)
    ctx.shadowBlur = 0

    // Image placeholder (karena download image berat, pake text aja)
    ctx.fillStyle = THEME.cardBg
    ctx.fillRect(25, 60, 120, 120)
    ctx.strokeStyle = THEME.secondary
    ctx.lineWidth = 2
    ctx.strokeRect(25, 60, 120, 120)
    
    ctx.font = '40px "Segoe UI"'
    ctx.fillStyle = THEME.secondary
    ctx.fillText('🎭', 85, 130)

    // Nama karakter
    ctx.font = 'bold 22px "Segoe UI"'
    ctx.fillStyle = THEME.white
    ctx.textAlign = 'left'
    let name = char.name.length > 30 ? char.name.substring(0, 27) + '...' : char.name
    ctx.fillText(name, 160, 95)

    if (char.nameJapanese) {
        ctx.font = '12px "Segoe UI"'
        ctx.fillStyle = THEME.gray
        ctx.fillText(char.nameJapanese, 160, 122)
    }

    // Favorites
    ctx.fillStyle = THEME.gold
    ctx.font = 'bold 13px "Segoe UI"'
    ctx.fillText(`❤️ ${formatNumber(char.favorites)} favorites`, 160, 150)

    // Box info
    ctx.fillStyle = '#00000040'
    ctx.beginPath()
    roundRect(ctx, 25, 195, w - 50, 90, 10)
    ctx.fill()

    ctx.fillStyle = THEME.primary
    ctx.font = 'bold 12px "Segoe UI"'
    ctx.fillText('🎙️ SEIYUU (JP)', 40, 220)

    ctx.fillStyle = THEME.white
    ctx.font = '12px "Segoe UI"'
    ctx.fillText(char.seiyuu.length > 35 ? char.seiyuu.substring(0, 32) + '...' : char.seiyuu, 40, 245)

    ctx.fillStyle = THEME.secondary
    ctx.font = 'bold 12px "Segoe UI"'
    ctx.fillText('📺 ANIME APPEAR', w/2 + 20, 220)

    let animeText = char.animeAppear.length > 0 ? char.animeAppear.slice(0, 2).join(', ') : 'Tidak diketahui'
    ctx.fillStyle = THEME.white
    ctx.font = '12px "Segoe UI"'
    ctx.fillText(animeText.length > 35 ? animeText.substring(0, 32) + '...' : animeText, w/2 + 20, 245)

    // About / Sinopsis
    ctx.fillStyle = '#00000040'
    ctx.beginPath()
    roundRect(ctx, 25, 300, w - 50, 270, 10)
    ctx.fill()

    ctx.fillStyle = THEME.primary
    ctx.font = 'bold 13px "Segoe UI"'
    ctx.fillText('📖 ABOUT', 40, 328)

    ctx.fillStyle = THEME.gray
    ctx.font = '11px "Segoe UI"'
    ctx.textAlign = 'left'
    
    // Word wrap untuk about
    const aboutText = char.about || 'Tidak ada deskripsi'
    const maxWidth = w - 70
    const words = aboutText.split(' ')
    let lines = []
    let currentLine = ''

    for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine)
            currentLine = word
        } else {
            currentLine = testLine
        }
    }
    lines.push(currentLine)

    let y = 355
    for (let i = 0; i < Math.min(lines.length, 12); i++) {
        ctx.fillText(lines[i], 40, y)
        y += 18
    }

    if (lines.length > 12) {
        ctx.fillText('...', 40, y)
    }

    // Footer
    ctx.fillStyle = `${THEME.primary}80`
    ctx.font = '9px "Segoe UI"'
    ctx.fillText('❥ Rimuru AI | Data from MyAnimeList (Jikan API)', w/2, h - 18)

    return canvas.toBuffer('image/png')
}

// Helper roundRect
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

// Format caption (fallback)
function formatCaption(char) {
    let caption = `🦋 *RIMURU CHARACTER* 🦋\n\n`
    caption += `*${char.name}*\n`
    if (char.nameJapanese) caption += `*${char.nameJapanese}*\n`
    caption += `\n`
    caption += `❤️ *Favorites:* ${formatNumber(char.favorites)}\n`
    caption += `🎙️ *Seiyuu (JP):* ${char.seiyuu}\n`
    caption += `📺 *Anime:* ${char.animeAppear.slice(0, 3).join(', ') || 'Tidak diketahui'}\n`
    caption += `\n`
    caption += `📖 *About:*\n${char.about.substring(0, 400)}${char.about.length > 400 ? '...' : ''}\n\n`
    caption += `💕 *Rimuru:* ${['Karakter favoritmu?', 'Keren banget nih karakter~', 'Seiyuu-nya siapa ya?'][Math.floor(Math.random() * 3)]} 🦋`
    return caption
}

async function handler(m, { sock }) {
    const query = m.text?.trim()
    
    if (!query) {
        return m.reply(
            `🦋 *RIMURU CHARACTER SEARCH* 🦋\n\n` +
            `📌 *Cara pakai:*\n` +
            `• ${m.prefix}character <nama karakter>\n\n` +
            `📌 *Contoh:*\n` +
            `• ${m.prefix}character zero two\n` +
            `• ${m.prefix}character gojo satoru\n` +
            `• ${m.prefix}character luffy\n\n` +
            `💕 *Rimuru:* Cari karakter anime siapa nih darling~? 🦋`
        )
    }
    
    await m.react('⏳')
    
    try {
        await m.reply(`🦋 *Rimuru:* Lagi nyari karakter *${query}*... tunggu sebentar ya~ 💕`)
        
        const result = await searchCharacter(query)
        
        if (!result.success) {
            await m.react('❌')
            return m.reply(`❌ *Karakter tidak ditemukan!*\n\n*${query}* gak ketemu di database.\n\nCoba cek ejaannya atau pake nama lain ya darling~ 🦋`)
        }
        
        const char = result.data
        
        try {
            const imgBuffer = await renderCharacterCard(char)
            await sock.sendMessage(m.chat, {
                image: imgBuffer,
                caption: formatCaption(char)
            }, { quoted: m })
        } catch (imgErr) {
            console.error('[Character] Canvas error:', imgErr)
            await m.reply(formatCaption(char))
        }
        
        await m.react('✅')
        
    } catch (err) {
        console.error('[Character] Error:', err)
        await m.react('❌')
        await m.reply(`❌ *Error:* ${err.message}\n\nCoba lagi nanti ya darling~ 🦋`)
    }
}

export { pluginConfig as config, handler };
