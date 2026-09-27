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
    name: 'mangaread',
    alias: ['mread', 'readmanga', 'bacamanga'],
    category: 'search',
    description: 'Membaca manga dari Shinigami',
    usage: '.mangaread <url atau id>',
    example: '.mangaread https://g.shinigami.asia/chapter/0a338442-9b00-4c4a-b80e-93ce34cd0cd0',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 15,
    energi: 5,
    isEnabled: true
}

const BASE_URL = 'https://api.shngm.io'
const WEB_URL = 'https://g.shinigami.asia'
const TIMEOUT = 30000

function getUuid(input) {
    const text = String(input || '').trim()
    const uuid = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
    return uuid ? uuid[0] : null
}

function isChapterUrl(input) {
    return String(input || '').includes('/chapter/')
}

function makeChapterUrl(chapterId) {
    return chapterId ? `${WEB_URL}/chapter/${chapterId}` : null
}

function makeChapterTitle(data) {
    const number = data.chapter_number ?? null
    const title = String(data.chapter_title || '').trim()

    if (number && title) return `Chapter ${number} - ${title}`
    if (number) return `Chapter ${number}`
    if (title) return title
    return null
}

function formatNumber(num) {
    if (!num) return '0'
    return num.toLocaleString()
}

async function handler(m, { sock }) {
    const args = m.text?.trim().split(/\s+/)
    const input = args[0]

    if (!input) {
        return m.reply(
            `📖 *MANGA READ - RIMURU* 📖\n\n` +
            `💫 *"He~ mau baca manga apa darling?"* 💫\n\n` +
            `📌 *Cara pakai:*\n` +
            `> ${m.prefix}mangaread <url atau id>\n\n` +
            `📝 *Contoh:*\n` +
            `> ${m.prefix}mangaread https://g.shinigami.asia/chapter/0a338442-9b00-4c4a-b80e-93ce34cd0cd0\n` +
            `> ${m.prefix}mangaread 0a338442-9b00-4c4a-b80e-93ce34cd0cd0\n\n` +
            `🌸 *Yosh! Semangat!* 🌸`
        )
    }

    const chapterId = getUuid(input)

    if (!chapterId) {
        return m.reply(`❌ *Chapter ID tidak ditemukan!*\n\n> "He~ itu bukan link yang bener darling~ 🗿"`)
    }

    await m.reply(`⏳ *Mengambil chapter...*\n\n📖 *ID:* ${chapterId}\n\n> "Tunggu sebentar darling~ 🦋"`)

    try {
        const res = await axios.get(`${BASE_URL}/v1/chapter/detail/${chapterId}`, {
            timeout: TIMEOUT,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:151.0) Gecko/20100101 Firefox/151.0',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': `${WEB_URL}/`,
                'Origin': WEB_URL,
                'Content-Type': 'application/json'
            },
            validateStatus: () => true
        })

        const json = res.data

        if (!json || typeof json !== 'object' || json.retcode !== 0) {
            return m.reply(`❌ *Gagal mengambil chapter!*\n\n> "He~ ada masalah nih darling~ 🗿"`)
        }

        const data = json.data || {}
        const images = []

        const base = data.base_url || data.base_url_low || null
        const path = data.chapter?.path || ''
        const files = Array.isArray(data.chapter?.data) ? data.chapter.data : []

        if (base && path && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                images.push({
                    page: i + 1,
                    url: `${base}${path}${files[i]}`
                })
            }
        }

        const title = makeChapterTitle(data) || `Chapter ${data.chapter_number || 'N/A'}`
        const prevUrl = data.prev_chapter_id ? makeChapterUrl(data.prev_chapter_id) : null
        const nextUrl = data.next_chapter_id ? makeChapterUrl(data.next_chapter_id) : null

        let caption = `📖 *MANGA READER* 📖\n\n`
        caption += `┌─〔 📝 *INFORMASI* 〕─📖\n`
        caption += `│ 📛 *Title:* ${title}\n`
        caption += `│ 📊 *Chapter:* ${data.chapter_number || 'N/A'}\n`
        caption += `│ 👁️ *Views:* ${formatNumber(data.view_count)}\n`
        caption += `│ 📅 *Release:* ${data.release_date || 'N/A'}\n`
        caption += `│ 📄 *Total Pages:* ${images.length}\n`
        caption += `└─────────────────────────\n\n`

        if (prevUrl) {
            caption += `⬅️ *Prev Chapter:* ${prevUrl}\n`
        }
        if (nextUrl) {
            caption += `➡️ *Next Chapter:* ${nextUrl}\n`
        }

        caption += `\n💬 *Rimuru:* "Ini dia darling~ 🗿"\n`
        caption += `🌸 *Selamat membaca!* 🌸`

        // Kirim gambar pertama sebagai preview + info
        if (images.length > 0) {
            try {
                const imgRes = await axios.get(images[0].url, {
                    responseType: 'arraybuffer',
                    timeout: 15000
                })
                await sock.sendMessage(m.chat, {
                    image: Buffer.from(imgRes.data),
                    caption: caption
                }, { quoted: m })
            } catch {
                await m.reply(caption + `\n\n⚠️ *Preview gambar gagal dimuat, tapi link di bawah bisa dibuka.*`)
            }
        } else {
            await m.reply(caption + `\n\n⚠️ *Tidak ada gambar di chapter ini.*`)
        }

        // Kirim link ke semua halaman (opsional, terlalu banyak)
        if (images.length > 0 && images.length <= 10) {
            let pageLinks = `\n📸 *All Pages:*\n`
            for (const img of images) {
                pageLinks += `${img.page}. ${img.url}\n`
            }
            await m.reply(pageLinks)
        }

    } catch (err) {
        console.error('[MangaRead Error]', err)
        await m.reply(
            `❌ *Error!*\n\n` +
            `> "He~ ada yang salah nih darling~ 🗿"\n\n` +
            `📝 *Error:* ${err.message}\n\n` +
            `💬 Coba lagi nanti ya~ 🌸`
        )
    }
}

export { pluginConfig as config, handler };
