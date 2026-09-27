/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/*
  Fitur tambahan hasil audit FURINA V17 → Rimuru MD.
  Weather card menggunakan asset Poppins + background cache lokal.
*/

import axios from 'axios'
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const pluginConfig = {
    name: 'weather',
    alias: ['cuaca'],
    category: 'tools',
    description: 'Cek cuaca kota dan buat weather card',
    usage: '.weather <kota>',
    example: '.weather Surabaya',
    cooldown: 15,
    energi: 1,
    isEnabled: true
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../..')
const FONT_DIR = join(ROOT, 'assets', 'weather', 'fonts')
const BG_DIR = join(ROOT, 'assets', 'weather', 'backgrounds')

const BACKGROUNDS = {
    clear: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1600&q=80',
    clouds: 'https://images.unsplash.com/photo-1499956827185-0d63ee78a910?w=1600&q=80',
    rain: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1600&q=80',
    drizzle: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1600&q=80',
    thunderstorm: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1600&q=80',
    snow: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1600&q=80',
    mist: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1600&q=80',
    default: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1600&q=80'
}

const WEATHER_CODE = {
    0: ['Cerah', 'clear'],
    1: ['Sebagian cerah', 'clear'],
    2: ['Berawan sebagian', 'clouds'],
    3: ['Mendung', 'clouds'],
    45: ['Berkabut', 'mist'],
    48: ['Kabut tebal', 'mist'],
    51: ['Gerimis ringan', 'drizzle'],
    53: ['Gerimis', 'drizzle'],
    55: ['Gerimis lebat', 'drizzle'],
    61: ['Hujan ringan', 'rain'],
    63: ['Hujan', 'rain'],
    65: ['Hujan lebat', 'rain'],
    71: ['Salju ringan', 'snow'],
    73: ['Salju', 'snow'],
    75: ['Salju lebat', 'snow'],
    80: ['Hujan singkat', 'rain'],
    81: ['Hujan singkat', 'rain'],
    82: ['Hujan deras', 'rain'],
    95: ['Badai petir', 'thunderstorm'],
    96: ['Badai petir + hujan es', 'thunderstorm'],
    99: ['Badai petir + hujan es', 'thunderstorm']
}

function registerFonts() {
    try {
        const regular = join(FONT_DIR, 'Poppins-Regular.ttf')
        const semibold = join(FONT_DIR, 'Poppins-SemiBold.ttf')
        if (existsSync(regular)) GlobalFonts.registerFromPath(regular, 'Poppins')
        if (existsSync(semibold)) GlobalFonts.registerFromPath(semibold, 'Poppins')
    } catch {}
}

function weatherKeyFromOpenWeather(condition = '') {
    const c = String(condition).toLowerCase()
    if (c.includes('clear')) return 'clear'
    if (c.includes('cloud')) return 'clouds'
    if (c.includes('drizzle')) return 'drizzle'
    if (c.includes('rain')) return 'rain'
    if (c.includes('thunder')) return 'thunderstorm'
    if (c.includes('snow')) return 'snow'
    if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return 'mist'
    return 'default'
}

async function getBackground(key) {
    await mkdir(BG_DIR, { recursive: true })
    const file = join(BG_DIR, `${key}.jpg`)
    if (existsSync(file)) return loadImage(file)
    try {
        const { data } = await axios.get(BACKGROUNDS[key] || BACKGROUNDS.default, {
            responseType: 'arraybuffer',
            timeout: 15000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        })
        await writeFile(file, Buffer.from(data))
        return loadImage(file)
    } catch {
        return null
    }
}

function drawRoundedRect(ctx, x, y, w, h, radius) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + w - radius, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
    ctx.lineTo(x + w, y + h - radius)
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
    ctx.lineTo(x + radius, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
}

function drawCover(ctx, image, x, y, w, h) {
    const ir = image.width / image.height
    const cr = w / h
    let sx, sy, sw, sh
    if (ir > cr) {
        sh = image.height
        sw = sh * cr
        sx = (image.width - sw) / 2
        sy = 0
    } else {
        sw = image.width
        sh = sw / cr
        sx = 0
        sy = (image.height - sh) / 2
    }
    ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h)
}

function fitFont(ctx, text, maxWidth, start, min = 18) {
    let size = start
    while (size > min) {
        ctx.font = `600 ${size}px Poppins`
        if (ctx.measureText(text).width <= maxWidth) break
        size -= 2
    }
    return size
}

function row(ctx, label, value, x, y, width) {
    ctx.font = '400 22px Poppins'
    ctx.fillStyle = 'rgba(255,255,255,.72)'
    ctx.fillText(label, x, y)
    ctx.font = '600 24px Poppins'
    ctx.fillStyle = '#fff'
    const w = ctx.measureText(value).width
    ctx.fillText(value, x + width - w, y)
}

async function renderCard(data) {
    registerFonts()
    const W = 1280
    const H = 800
    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext('2d')
    const key = data.kind || 'default'
    const bg = await getBackground(key)

    if (bg) {
        ctx.save()
        ctx.filter = 'brightness(1.05) saturate(1.08)'
        drawCover(ctx, bg, 0, 0, W, H)
        ctx.restore()
    } else {
        const fallback = ctx.createLinearGradient(0, 0, 0, H)
        fallback.addColorStop(0, '#1f3b63')
        fallback.addColorStop(1, '#0e1726')
        ctx.fillStyle = fallback
        ctx.fillRect(0, 0, W, H)
    }

    const shade = ctx.createLinearGradient(0, 0, 0, H)
    shade.addColorStop(0, 'rgba(0,0,0,.18)')
    shade.addColorStop(1, 'rgba(0,0,0,.58)')
    ctx.fillStyle = shade
    ctx.fillRect(0, 0, W, H)

    const cardW = 1000
    const cardH = 560
    const cardX = (W - cardW) / 2
    const cardY = (H - cardH) / 2
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 28)
    ctx.fillStyle = 'rgba(10,15,24,.55)'
    ctx.fill()
    ctx.save()
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 28)
    ctx.clip()
    ctx.fillStyle = 'rgba(255,255,255,.06)'
    ctx.fillRect(cardX, cardY, cardW, cardH)
    ctx.restore()

    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#fff'
    ctx.font = '600 58px Poppins'
    ctx.fillText(data.city, cardX + 48, cardY + 80)
    ctx.fillStyle = 'rgba(255,255,255,.78)'
    ctx.font = '400 24px Poppins'
    ctx.fillText(data.description, cardX + 48, cardY + 118)

    ctx.textAlign = 'center'
    ctx.font = '600 114px Poppins'
    ctx.fillStyle = '#fff'
    ctx.fillText(`${Math.round(data.temperature)}°C`, cardX + cardW / 2, cardY + 250)
    ctx.font = '400 30px Poppins'
    ctx.fillStyle = 'rgba(255,255,255,.8)'
    ctx.fillText(`Terasa ${Math.round(data.feelsLike)}°C`, cardX + cardW / 2, cardY + 294)

    ctx.textAlign = 'left'
    const leftX = cardX + 48
    const rightX = cardX + cardW / 2 + 20
    const rowY = cardY + 382
    const colW = 410
    row(ctx, 'Kelembapan', `${Math.round(data.humidity)}%`, leftX, rowY, colW)
    row(ctx, 'Angin', `${Math.round(data.wind)} km/j`, rightX, rowY, colW)
    row(ctx, 'Tekanan', `${data.pressure ?? '-'} hPa`, leftX, rowY + 48, colW)
    row(ctx, 'Visibilitas', `${data.visibility ?? '-'} km`, rightX, rowY + 48, colW)

    ctx.fillStyle = 'rgba(255,255,255,.62)'
    ctx.font = '400 18px Poppins'
    ctx.fillText(`🌤️ Rimuru Weather • ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`, leftX, cardY + cardH - 36)

    return canvas.encode('png')
}

async function fromOpenMeteo(city) {
    const geo = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: { name: city, count: 1, language: 'id', format: 'json' },
        timeout: 10000
    })
    const place = geo.data?.results?.[0]
    if (!place) throw new Error('Kota tidak ditemukan')

    const forecast = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
            latitude: place.latitude,
            longitude: place.longitude,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure',
            timezone: 'auto'
        },
        timeout: 10000
    })
    const c = forecast.data?.current
    if (!c) throw new Error('Data cuaca kosong')
    const [description, kind] = WEATHER_CODE[c.weather_code] || ['Tidak diketahui', 'default']
    return {
        city: [place.name, place.admin1, place.country].filter(Boolean).join(', '),
        temperature: c.temperature_2m,
        feelsLike: c.apparent_temperature,
        humidity: c.relative_humidity_2m,
        wind: c.wind_speed_10m,
        pressure: Math.round(c.surface_pressure),
        visibility: '-',
        description,
        kind,
        source: 'Open-Meteo'
    }
}

async function fetchWeather(city) {
    const key = process.env.OPENWEATHER_API_KEY || globalThis.OPENWEATHER_API_KEY || ''
    if (key) {
        try {
            const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: { q: city, appid: key, units: 'metric' },
                timeout: 10000
            })
            return {
                city: data.name,
                temperature: data.main?.temp ?? 0,
                feelsLike: data.main?.feels_like ?? data.main?.temp ?? 0,
                humidity: data.main?.humidity ?? 0,
                wind: (data.wind?.speed ?? 0) * 3.6,
                pressure: data.main?.pressure ?? '-',
                visibility: data.visibility ? (data.visibility / 1000).toFixed(1) : '-',
                description: data.weather?.[0]?.description || data.weather?.[0]?.main || 'Tidak diketahui',
                kind: weatherKeyFromOpenWeather(data.weather?.[0]?.main),
                source: 'OpenWeather'
            }
        } catch {}
    }
    return fromOpenMeteo(city)
}

async function handler(m) {
    const city = m.text?.trim()
    if (!city) return m.reply(`Contoh: ${m.prefix}weather Surabaya`)
    try {
        m.react('🕒')
        const data = await fetchWeather(city)
        const buffer = await renderCard(data)
        const caption = [
            `🌤️ *Cuaca di ${data.city}*`,
            '',
            `🌡️ Suhu: *${Math.round(data.temperature)}°C*`,
            `🥵 Terasa: *${Math.round(data.feelsLike)}°C*`,
            `☁️ Kondisi: *${data.description}*`,
            `💧 Kelembapan: *${Math.round(data.humidity)}%*`,
            `💨 Angin: *${Math.round(data.wind)} km/j*`,
            `📡 Sumber: *${data.source}*`
        ].join('\n')
        await m.reply({ image: buffer, caption })
        m.react('✅')
    } catch (error) {
        console.error('[weather]', error)
        m.react('❌')
        return m.reply('❌ Kota tidak ditemukan atau API cuaca sedang bermasalah.')
    }
}

export { pluginConfig as config, handler }
