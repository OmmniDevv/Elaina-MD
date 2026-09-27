// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// XVideos Search & Download — port dari pain-bot xvideos.js (gratis, scrape langsung, no key)
import fetch from 'node-fetch'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { elainaSay, elainaReact } from '../../lib/elainaVoice.js'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) {
        return m.reply(elainaSay('noargs', `mau cari apa nih~?\nContoh: ${usedPrefix}xvideos amateur\nAtau langsung: ${usedPrefix}xvideos <url xvideos>`))
    }

    if (m.isGroup && !global.db.data.chats[m.chat]?.cmd18) {
        return m.reply(elainaSay('gagal', 'perintah +18 belum diaktifkan di grup ini... admin bisa aktifkan dengan *.cmd18 on* ya~'))
    }

    conn.xvideos = conn.xvideos || {}
    const isUrl = text.includes('xvideos.com')
    await conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } }).catch(() => {})

    if (isUrl) {
        try {
            const videoInfo = await xvideosdl(text)
            if (!videoInfo || !videoInfo.result) throw new Error('nggak ketemu info videonya... coba cek link-nya ya~')
            const videoUrl = videoInfo.result.url
            const cap = `🔞 *VIDEO XVIDEOS*\n\n> *Judul:* ${videoInfo.result.title}\n> *Views:* ${videoInfo.result.views}\n> *Likes:* ${videoInfo.result.likes}\n> *Dislikes:* ${videoInfo.result.deslikes}\n> *Link:* ${text}\n`
            await conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } }).catch(() => {})
            await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption: cap }, { quoted: m })
        } catch (e) {
            await conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } }).catch(() => {})
            m.reply(elainaSay('gagal', 'nggak bisa download videonya... coba cek link-nya ya~'))
        }
        return
    }

    try {
        const results = await searchXvideos(text)
        if (!results || results.length === 0) throw 'nggak ketemu hasilnya... coba kata kunci lain ya~'

        const lista = results.slice(0, 10).map((res, i) =>
            `*${i + 1}.*\n> *Judul:* ${res.title}\n> *Link:* ${res.url}`
        ).join('\n\n')

        const leyenda = `🔞 *HASIL PENCARIAN XVIDEOS*\n\n> *Cari:* ${text}\n> *Hasil:* ${results.length}\n\n${lista}\n\n> *Balas pesan ini dengan angka (1-10) buat download~*`

        const { key } = await conn.sendMessage(m.chat, { text: leyenda }, { quoted: m })
        conn.xvideos[m.sender] = {
            result: results.slice(0, 10),
            key,
            downloads: 0,
            timeout: setTimeout(() => delete conn.xvideos[m.sender], 120_000),
        }
        await conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } }).catch(() => {})
    } catch (e) {
        await conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } }).catch(() => {})
        m.reply(elainaSay('gagal', typeof e === 'string' ? e : 'ada sedikit masalah... coba lagi ya~'))
    }
}

handler.before = async (m, { conn }) => {
    conn.xvideos = conn.xvideos || {}
    const session = conn.xvideos[m.sender]
    if (!session) return
    if (!m.quoted || m.quoted.id !== session.key.id) return

    const n = parseInt(m.text.trim())
    if (isNaN(n) || n < 1 || n > session.result.length) return

    clearTimeout(session.timeout)
    delete conn.xvideos[m.sender]
    m.commandExecuted = true

    try {
        const link = session.result[n - 1].url
        const videoInfo = await xvideosdl(link)
        if (!videoInfo || !videoInfo.result) throw new Error('nggak ketemu info videonya...')
        const videoUrl = videoInfo.result.url
        const cap = `🔞 *VIDEO XVIDEOS*\n\n> *Judul:* ${videoInfo.result.title}\n> *Views:* ${videoInfo.result.views}\n> *Likes:* ${videoInfo.result.likes}\n> *Dislikes:* ${videoInfo.result.deslikes}\n> *Link:* ${link}\n`
        await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption: cap }, { quoted: m })
    } catch (e) {
        m.reply(elainaSay('gagal', 'nggak bisa download videonya... coba lagi ya~'))
    } finally {
        session.downloads++
    }
}

handler.command = ['xvideos', 'xvsearch', 'xvideosdl', 'xvid']
handler.tags = ['nsfw']
handler.help = ['xvideos <kata kunci | url>']
handler.nsfw = true
handler.premium = true
handler.limit = 1

export default handler

async function searchXvideos(query) {
    try {
        const url = `https://www.xvideos.com/?k=${encodeURIComponent(query)}`
        const response = await axios.get(url, { headers: { 'User-Agent': UA } })
        const $ = cheerio.load(response.data)
        const results = []
        $('div.mozaique > div').each((indice, element) => {
            const title = $(element).find('p.title a').attr('title')
            const href = $(element).find('p.title a').attr('href')
            const videoUrl = href ? 'https://www.xvideos.com' + href : null
            const duration = $(element).find('span.duration').text().trim()
            const quality = $(element).find('span.video-hd-mark').text().trim()
            if (title && videoUrl) {
                results.push({ title, url: videoUrl, duration, quality })
            }
        })
        return results
    } catch (e) {
        console.error('Error pencarian XVideos:', e.message)
        return []
    }
}

async function xvideosdl(url) {
    return new Promise((resolve, reject) => {
        fetch(`${url}`, { method: 'get', headers: { 'User-Agent': UA } })
            .then(res => res.text())
            .then(res => {
                const $ = cheerio.load(res, { xmlMode: false })
                const title = $("meta[property='og:title']").attr('content') || 'Tanpa judul'
                const keyword = $("meta[name='keywords']").attr('content') || ''
                const viewsText = $('div#video-tabs > div > div > div > div > strong.mobile-hide').text()
                const views = viewsText ? viewsText + ' views' : 'Tidak diketahui'
                const vote = $('div.rate-infos > span.rating-total-txt').text() || '0'
                const likes = $('span.rating-good-nbr').text() || '0'
                const deslikes = $('span.rating-bad-nbr').text() || '0'
                const thumb = $("meta[property='og:image']").attr('content') || ''
                const videoUrl = $('#html5video > #html5video_base > div > a').attr('href')
                if (!videoUrl) {
                    reject(new Error('nggak bisa ambil URL videonya...'))
                    return
                }
                resolve({ status: 200, result: { title, url: videoUrl, keyword, views, vote, likes, deslikes, thumb } })
            })
            .catch(err => reject(err))
    })
}
