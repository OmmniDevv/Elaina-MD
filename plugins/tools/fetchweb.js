/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import axios from 'axios';
import config from '../../config.js';
const pluginConfig = {
    name: 'fetchweb',
    alias: ['webget', 'getweb', 'ambilweb', 'downloadweb'],
    category: 'tools',
    description: 'Fetch dan simpan halaman web',
    usage: '.fetchweb <url>',
    example: '.fetchweb https://ditzzx.my.id',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 5,
    isEnabled: true
}

const TIMEOUT = 60000
const OUTPUT_DIR = 'web-fetcher'

function safeName(input) {
    return String(input || '')
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
        .replace(/\s+/g, '_')
        .slice(0, 180)
}

function getSiteName(hostname) {
    const clean = hostname
        .replace(/^www\./, '')
        .replace(/:\d+$/, '')

    const parts = clean.split('.').filter(Boolean)

    if (parts.length >= 3 && parts.at(-2) === 'my' && parts.at(-1) === 'id') {
        return parts.at(-3)
    }

    if (parts.length >= 2) {
        return parts.at(-2)
    }

    return parts[0] || 'output'
}

function getExtFromContentType(contentType) {
    const type = String(contentType || '').split(';')[0].trim().toLowerCase()

    const map = {
        'text/html': '.html',
        'text/plain': '.txt',
        'text/css': '.css',
        'text/javascript': '.js',
        'application/javascript': '.js',
        'application/x-javascript': '.js',
        'application/json': '.json',
        'application/xml': '.xml',
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
        'image/gif': '.gif',
        'image/svg+xml': '.svg',
        'image/x-icon': '.ico',
        'font/woff': '.woff',
        'font/woff2': '.woff2',
        'font/ttf': '.ttf',
        'font/otf': '.otf',
        'video/mp4': '.mp4',
        'video/webm': '.webm',
        'audio/mpeg': '.mp3',
        'audio/mp4': '.m4a',
        'audio/wav': '.wav',
        'application/pdf': '.pdf',
        'application/zip': '.zip'
    }

    return map[type] || ''
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
}

function getFileName(url, contentType) {
    const parsed = new URL(url)
    const siteName = getSiteName(parsed.hostname)

    let pathname = decodeURIComponent(parsed.pathname || '')
    let base = path.basename(pathname)

    if (!base || base === '/' || base === '.') {
        const ext = getExtFromContentType(contentType) || '.html'
        return safeName(siteName + ext)
    }

    if (!path.extname(base)) {
        const ext = getExtFromContentType(contentType) || '.html'
        base += ext
    }

    return safeName(base)
}

function getReferer(url) {
    const parsed = new URL(url)
    return parsed.origin + '/'
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

async function handler(m, { sock }) {
    const args = m.text?.trim().split(/\s+/)
    const targetUrl = args[0]

    if (!targetUrl) {
        return m.reply(
            `🌐 *FETCH WEB - RIMURU* 🌐\n\n` +
            `💫 *"He~ mau ambil website apa darling?"* 💫\n\n` +
            `📌 *Cara pakai:*\n` +
            `> ${m.prefix}fetchweb <url>\n\n` +
            `📝 *Contoh:*\n` +
            `> ${m.prefix}fetchweb https://ditzzx.my.id\n\n` +
            `🌸 *Yosh! Semangat!* 🌸`
        )
    }

    // Validasi URL
    let validUrl
    try {
        validUrl = new URL(targetUrl)
    } catch {
        return m.reply(`❌ *URL tidak valid!*\n\n> "He~ itu bukan link yang bener darling~ 🗿"`)
    }

    await m.reply(`⏳ *Fetching...*\n\n🌐 ${targetUrl}\n\n> "Tunggu sebentar darling~ 🦋"`)

    try {
        const parsed = new URL(targetUrl)
        const baseUrl = parsed.origin
        const referer = getReferer(targetUrl)
        const siteName = getSiteName(parsed.hostname)

        const folder = path.join(process.cwd(), OUTPUT_DIR, siteName)
        ensureDir(folder)

        const res = await axios.get(targetUrl, {
            responseType: 'arraybuffer',
            timeout: TIMEOUT,
            maxRedirects: 5,
            validateStatus: () => true,
            headers: {
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36',
                'accept': '*/*',
                'referer': referer
            }
        })

        const contentType = res.headers['content-type'] || ''

        if (res.status < 200 || res.status >= 300) {
            return m.reply(
                `❌ *Gagal fetch!*\n\n` +
                `📊 *Status:* ${res.status}\n` +
                `🌐 *URL:* ${targetUrl}\n\n` +
                `> "He~ ada masalah nih darling~ 🗿"`
            )
        }

        const buffer = Buffer.from(res.data)
        let filename = getFileName(targetUrl, contentType)
        let filePath = path.join(folder, filename)

        if (fs.existsSync(filePath)) {
            const ext = path.extname(filename)
            const name = path.basename(filename, ext)
            const hash = crypto.createHash('md5').update(targetUrl).digest('hex').slice(0, 8)
            filename = name + '_' + hash + ext
            filePath = path.join(folder, filename)
        }

        fs.writeFileSync(filePath, buffer)

        const fileSize = formatFileSize(buffer.length)
        const fileExt = path.extname(filename) || 'unknown'

        let caption = `✅ *BERHASIL FETCH!* ✅\n\n`
        caption += `🦋 *Rimuru:* "Selesai darling~! 🎉"\n\n`
        caption += `┌─〔 📝 *DETAIL* 〕─🦋\n`
        caption += `│ 🌐 *URL:* ${targetUrl}\n`
        caption += `│ 📊 *Status:* ${res.status}\n`
        caption += `│ 📄 *File:* ${filename}\n`
        caption += `│ 📁 *Folder:* ${folder}\n`
        caption += `│ 💾 *Size:* ${fileSize}\n`
        caption += `│ 🔖 *Type:* ${contentType || 'unknown'}\n`
        caption += `└─────────────────────────🦋\n\n`
        caption += `💬 *Rimuru:* "File sudah tersimpan darling~ 🗿"\n`
        caption += `🌸 *Yosh! Semangat!* 🌸`

        // Kirim file kalau ukuran wajar (max 50MB)
        if (buffer.length < 50 * 1024 * 1024) {
            const mimeType = contentType || 'application/octet-stream'
            
            if (fileExt === '.jpg' || fileExt === '.jpeg' || fileExt === '.png' || fileExt === '.webp' || fileExt === '.gif') {
                await sock.sendMessage(m.chat, {
                    image: buffer,
                    caption: caption
                }, { quoted: m })
            } else if (fileExt === '.mp4' || fileExt === '.webm') {
                await sock.sendMessage(m.chat, {
                    video: buffer,
                    caption: caption
                }, { quoted: m })
            } else if (fileExt === '.mp3' || fileExt === '.m4a' || fileExt === '.wav') {
                await sock.sendMessage(m.chat, {
                    audio: buffer,
                    mimetype: mimeType,
                    ptt: false
                }, { quoted: m })
            } else if (fileExt === '.pdf') {
                await sock.sendMessage(m.chat, {
                    document: buffer,
                    mimetype: 'application/pdf',
                    fileName: filename,
                    caption: caption
                }, { quoted: m })
            } else {
                await sock.sendMessage(m.chat, {
                    document: buffer,
                    mimetype: mimeType,
                    fileName: filename,
                    caption: caption
                }, { quoted: m })
            }
        } else {
            await m.reply(caption + `\n\n⚠️ *File terlalu besar untuk dikirim via WhatsApp!*`)
        }

    } catch (err) {
        console.error('[FetchWeb Error]', err)
        await m.reply(
            `❌ *Error!*\n\n` +
            `> "He~ ada yang salah nih darling~ 🗿"\n\n` +
            `📝 *Error:* ${err.message}\n\n` +
            `💬 Coba lagi nanti ya~ 🌸`
        )
    }
}

export { pluginConfig as config, handler };
