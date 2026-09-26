// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Social Media Downloaders via Deline API — gratis, no key (tested 2026-09-26)
import fetch from 'node-fetch'

const DELINE = 'https://api.deline.web.id'

// TikTok
let handlerTiktok = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan URL TikTok!'
    conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    try {
        const res = await fetch(`${DILINE}/downloader/tiktok?url=${encodeURIComponent(text)}`, { timeout: 30000 })
        const json = await res.json()
        if (!json.status) throw json.message || 'Gagal'
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        const videoUrl = json.result?.video || json.result?.url
        if (videoUrl) await conn.sendFile(m.chat, videoUrl, 'tiktok.mp4', `🎵 TikTok\n${json.result?.title || ''}`, m)
        else throw 'No video URL'
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ ${e.message}`
    }
}
handlerTiktok.help = ['tiktokdl <url>', 'ttdl <url>']
handlerTiktok.tags = ['downloader']
handlerTiktok.command = /^(tiktokdl|ttdl|tiktokdownload)$/i
export { handlerTiktok }

// Instagram
let handlerIg = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan URL Instagram!'
    conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    try {
        const res = await fetch(`${DILINE}/downloader/instagram?url=${encodeURIComponent(text)}`, { timeout: 30000 })
        const json = await res.json()
        if (!json.status) throw json.message || 'Gagal'
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        const mediaUrl = json.result?.url || json.result?.video || json.result?.image
        if (mediaUrl) await conn.sendFile(m.chat, mediaUrl, 'ig.mp4', '📸 Instagram', m)
        else throw 'No media URL'
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ ${e.message}`
    }
}
handlerIg.help = ['igdl <url>', 'instagram <url>']
handlerIg.tags = ['downloader']
handlerIg.command = /^(igdl|instagram|igdownload)$/i
export { handlerIg }

// Facebook
let handlerFb = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan URL Facebook!'
    conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    try {
        const res = await fetch(`${DILINE}/downloader/facebook?url=${encodeURIComponent(text)}`, { timeout: 30000 })
        const json = await res.json()
        if (!json.status) throw json.message || 'Gagal'
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        const videoUrl = json.result?.url || json.result?.video
        if (videoUrl) await conn.sendFile(m.chat, videoUrl, 'fb.mp4', '📘 Facebook', m)
        else throw 'No video URL'
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ ${e.message}`
    }
}
handlerFb.help = ['fbdl <url>', 'facebook <url>']
handlerFb.tags = ['downloader']
handlerFb.command = /^(fbdl|facebook|fbdownload)$/i
export { handlerFb }

// Twitter/X
let handlerTw = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan URL Twitter/X!'
    conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    try {
        const res = await fetch(`${DILINE}/downloader/twitter?url=${encodeURIComponent(text)}`, { timeout: 30000 })
        const json = await res.json()
        if (!json.status) throw json.message || 'Gagal'
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        const videoUrl = json.result?.url || json.result?.video
        if (videoUrl) await conn.sendFile(m.chat, videoUrl, 'twitter.mp4', '🐦 Twitter', m)
        else throw 'No video URL'
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ ${e.message}`
    }
}
handlerTw.help = ['twdl <url>', 'twitterdl <url>']
handlerTw.tags = ['downloader']
handlerTw.command = /^(twdl|twitterdl|twitterdownload)$/i
export { handlerTw }

// CapCut
let handlerCapcut = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan URL CapCut!'
    conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    try {
        const res = await fetch(`${DILINE}/downloader/capcut?url=${encodeURIComponent(text)}`, { timeout: 30000 })
        const json = await res.json()
        if (!json.status) throw json.message || 'Gagal'
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        const videoUrl = json.result?.url || json.result?.video
        if (videoUrl) await conn.sendFile(m.chat, videoUrl, 'capcut.mp4', '🎬 CapCut', m)
        else throw 'No video URL'
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ ${e.message}`
    }
}
handlerCapcut.help = ['capcutdl <url>']
handlerCapcut.tags = ['downloader']
handlerCapcut.command = /^(capcutdl|capcutdownload)$/i
export { handlerCapcut }

export default handlerTiktok
