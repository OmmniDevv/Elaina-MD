// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// YouTube Downloader via Deline API — gratis, no key (tested 2026-09-26)
import fetch from 'node-fetch'

const DELINE = 'https://api.deline.web.id'

let handler = async (m, { conn, text, args, command }) => {
    const url = text || args[0]
    if (!url) throw `Masukkan URL YouTube!\n\nContoh: .ytdl https://youtu.be/xxxxx`

    conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    try {
        const res = await fetch(`${DILINE}/downloader/youtube?url=${encodeURIComponent(url)}`, { timeout: 30000 })
        const json = await res.json()

        if (!json.status || !json.result) throw json.message || 'Gagal download'

        const { title, duration, channel, views, thumbnail, audio, video } = json.result

        let txt = `🎬 *YOUTUBE DOWNLOADER*\n\n`
        txt += `📺 *Judul:* ${title}\n`
        txt += `⏱️ *Durasi:* ${duration}\n`
        txt += `📺 *Channel:* ${channel}\n`
        txt += `👀 *Views:* ${views}\n\n`
        txt += `Pilih format:\n`
        txt += `• .yta ${url} — Audio\n`
        txt += `• .ytv ${url} — Video`

        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        if (thumbnail) {
            await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: txt }, { quoted: m })
        } else {
            await m.reply(txt)
        }
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ Gagal: ${e.message}`
    }
}

handler.help = ['ytdl <url>', 'youtube <url>']
handler.tags = ['downloader']
handler.command = /^(ytdl|youtubedl|youtubedownload)$/i

export default handler

// Audio handler
export let handlerAudio = async (m, { conn, text }) => {
    const url = text
    if (!url) throw 'Masukkan URL YouTube!'

    conn.sendMessage(m.chat, { react: { text: '🎵', key: m.key } })

    try {
        const res = await fetch(`${DILINE}/downloader/youtube?url=${encodeURIComponent(url)}`, { timeout: 30000 })
        const json = await res.json()

        if (!json.status || !json.result?.audio?.length) throw 'Tidak ada audio'

        const audioUrl = json.result.audio[0].url
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await conn.sendFile(m.chat, audioUrl, 'audio.mp3', `🎵 ${json.result.title}`, m)
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ Gagal: ${e.message}`
    }
}
handlerAudio.help = ['yta <url>']
handlerAudio.tags = ['downloader']
handlerAudio.command = /^(yta|ytmp3|youtubeaudio)$/i

// Video handler
export let handlerVideo = async (m, { conn, text }) => {
    const url = text
    if (!url) throw 'Masukkan URL YouTube!'

    conn.sendMessage(m.chat, { react: { text: '🎬', key: m.key } })

    try {
        const res = await fetch(`${DILINE}/downloader/youtube?url=${encodeURIComponent(url)}`, { timeout: 30000 })
        const json = await res.json()

        if (!json.status || !json.result?.video?.length) throw 'Tidak ada video'

        const videoUrl = json.result.video[0].url
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await conn.sendFile(m.chat, videoUrl, 'video.mp4', `🎬 ${json.result.title}`, m)
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ Gagal: ${e.message}`
    }
}
handlerVideo.help = ['ytv <url>']
handlerVideo.tags = ['downloader']
handlerVideo.command = /^(ytv|ytmp4|youtubevideo)$/i
