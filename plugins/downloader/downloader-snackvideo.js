// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// SnackVideo Downloader via Deline API — gratis, no key
import fetch from 'node-fetch'
import { elainaSay, elainaReact } from '../../lib/elainaVoice.js'

const DELINE = 'https://api.deline.web.id'

let handler = async (m, { conn, text }) => {
    if (!text) throw elainaSay('noargs', 'Masukkan URL SnackVideo!\nContoh: .snackdl https://snackvideo.com/video/xxxxx')

    if (!text.includes('snackvideo') && !text.includes('sck')) {
        throw elainaSay('gagal', 'Itu bukan link SnackVideo~')
    }

    conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } })

    try {
        const res = await fetch(`${DLINE}/downloader/snackvideo?url=${encodeURIComponent(text)}`, { timeout: 30000 })
        const json = await res.json()

        if (!json.status) throw elainaSay('gagal', json.error || json.message || 'Gagal download dari SnackVideo')

        const r = json.result || json.data
        const videoUrl = r.video || r.url || r.media
        const title = r.title || r.caption || 'SnackVideo'

        if (!videoUrl) throw elainaSay('notfound', 'video SnackVideo-nya')

        await conn.sendFile(m.chat, videoUrl, 'snackvideo.mp4', `🎬 *SnackVideo*\n\n${title}`, m)

        conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } })
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } })
        throw elainaSay('gagal', e.message)
    }
}

handler.help = ['snackdl <url>', 'snackvideo <url>']
handler.tags = ['downloader']
handler.command = /^(snackdl|snackvideo|snackvideodl)$/i

export default handler
