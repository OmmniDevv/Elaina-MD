// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// YouTube Downloader via Deline API — gratis, no key (tested 2026-09-26)
// Response asli: result.medias[] = { formatId, label ("mp4 (360p)"/"m4a (audio)"), ext, url }
import fetch from 'node-fetch'
import { elainaSay, elainaReact } from '../../lib/elainaVoice.js'

const DELINE = 'https://api.deline.web.id'

function fmtDuration(sec) {
    sec = Number(sec) || 0
    const m = Math.floor(sec / 60), s = sec % 60
    return `${m}:${String(s).padStart(2, '0')}`
}

// Parse "mp4 (360p)" / "webm (1080p)" → angka resolusi; audio → 0
function resolutionOf(media) {
    const m = String(media.label || '').match(/(\d{3,4})p/)
    return m ? parseInt(m[1]) : (/audio|m4a|mp3/i.test(media.label || '') ? 0 : -1)
}

async function getYtInfo(url) {
    const res = await fetch(`${Deline}/downloader/youtube?url=${encodeURIComponent(url)}`, { timeout: 40000 })
    const json = await res.json().catch(() => null)
    if (!json?.status || !json.result?.medias?.length) {
        throw json?.message || json?.error || 'Gagal ambil data YouTube'
    }
    return json.result
}

// ─── Info + pilihan format ─────────────────────────────────
let handler = async (m, { conn, text, args, usedPrefix }) => {
    const url = text || args[0]
    if (!url) throw elainaSay('noargs', `Masukkan URL YouTube!\nContoh: ${usedPrefix}ytdl https://youtu.be/xxxxx`)

    conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } })
    try {
        const r = await getYtInfo(url)

        let txt = `🎬 *YOUTUBE DOWNLOADER*\n\n`
        txt += `📺 *Judul:* ${r.title}\n`
        txt += `⏱️ *Durasi:* ${fmtDuration(r.duration)}\n`
        if (r.author) txt += `📺 *Channel:* ${r.author}\n`
        txt += `\n📥 *Pilih format:*\n`
        txt += `• ${usedPrefix}yta ${url} — Audio 🎵\n`
        txt += `• ${usedPrefix}ytv ${url} — Video (360p) 🎬\n`
        txt += `• ${usedPrefix}ytvhd ${url} — Video (720p+) ✨`

        conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } })
        if (r.thumbnail) {
            await conn.sendMessage(m.chat, { image: { url: r.thumbnail }, caption: txt }, { quoted: m })
        } else {
            await m.reply(txt)
        }
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } })
        throw elainaSay('gagal', e.message)
    }
}
handler.help = ['ytdl <url>', 'youtube <url>']
handler.tags = ['downloader']
handler.command = /^(ytdl|youtubedl|youtubedownload)$/i
export default handler

// ─── Audio ─────────────────────────────────────────────────
export let handlerAudio = async (m, { conn, text, usedPrefix }) => {
    const url = text
    if (!url) throw elainaSay('noargs', `Masukkan URL YouTube!\nContoh: ${usedPrefix}yta <url>`)

    conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } })
    try {
        const r = await getYtInfo(url)
        const audioMedia = r.medias.find(md => /audio|m4a|mp3/i.test(md.label || '') || ['m4a', 'mp3', 'opus'].includes(md.ext))
        if (!audioMedia?.url) throw 'Tidak ada stream audio tersedia'

        await conn.sendFile(m.chat, audioMedia.url, 'audio.mp3', `🎵 ${r.title}`, m)
        conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } })
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } })
        throw elainaSay('gagal', e.message)
    }
}
handlerAudio.help = ['yta <url>']
handlerAudio.tags = ['downloader']
handlerAudio.command = /^(yta|ytmp3|youtubeaudio)$/i

// ─── Video (360p — ringan buat WA) ─────────────────────────
export let handlerVideo = async (m, { conn, text, usedPrefix }) => {
    const url = text
    if (!url) throw elainaSay('noargs', `Masukkan URL YouTube!\nContoh: ${usedPrefix}ytv <url>`)

    conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } })
    try {
        const r = await getYtInfo(url)
        const mp4s = r.medias.filter(md => md.ext === 'mp4' && resolutionOf(md) > 0)
        // Pilih yang paling dekat ke 360p (prioritas ringan untuk ponsel)
        const pick = mp4s.find(md => resolutionOf(md) === 360)
            || mp4s.sort((a, b) => Math.abs(resolutionOf(a) - 360) - Math.abs(resolutionOf(b) - 360))[0]
        if (!pick?.url) throw 'Tidak ada stream video mp4 tersedia'

        await conn.sendFile(m.chat, pick.url, 'video.mp4', `🎬 ${r.title}`, m)
        conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } })
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } })
        throw elainaSay('gagal', e.message)
    }
}
handlerVideo.help = ['ytv <url>']
handlerVideo.tags = ['downloader']
handlerVideo.command = /^(ytv|ytmp4|youtubevideo)$/i

// ─── Video HD (720p+, mp4) ─────────────────────────────────
export let handlerVideoHD = async (m, { conn, text, usedPrefix }) => {
    const url = text
    if (!url) throw elainaSay('noargs', `Masukkan URL YouTube!\nContoh: ${usedPrefix}ytvhd <url>`)

    conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } })
    try {
        const r = await getYtInfo(url)
        const mp4s = r.medias.filter(md => md.ext === 'mp4' && resolutionOf(md) >= 720)
        if (!mp4s.length) throw 'Tidak ada kualitas 720p+. Coba .ytv biasa'
        const pick = mp4s.sort((a, b) => resolutionOf(b) - resolutionOf(a))[0]

        await conn.sendFile(m.chat, pick.url, 'video.mp4', `✨ ${r.title} (${pick.label})`, m)
        conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } })
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } })
        throw elainaSay('gagal', e.message)
    }
}
handlerVideoHD.help = ['ytvhd <url>']
handlerVideoHD.tags = ['downloader']
handlerVideoHD.command = /^(ytvhd|ytmp4hd)$/i
