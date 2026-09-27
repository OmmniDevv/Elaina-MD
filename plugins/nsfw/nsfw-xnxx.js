// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// XNXX Search & Download — port dari pain-bot xnxx.js (gratis, scrape langsung, no key)
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import { elainaSay, elainaReact } from '../../lib/elainaVoice.js'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) {
        return m.reply(elainaSay('noargs', `mau cari apa nih~?\nContoh: ${usedPrefix}xnxx anime\nAtau langsung: ${usedPrefix}xnxx <url xnxx>`))
    }

    if (m.isGroup && !global.db.data.chats[m.chat]?.cmd18) {
        return m.reply(elainaSay('gagal', 'perintah +18 belum diaktifkan di grup ini... admin bisa aktifkan dengan *.cmd18 on* ya~'))
    }

    conn.xnxx = conn.xnxx || {}
    const isUrl = text.includes('xnxx.com')
    await conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } }).catch(() => {})

    if (isUrl) {
        try {
            const res = await xnxxdl(text)
            const { dur, qual, views } = res.result.info
            const texto = `🔞 *VIDEO XNXX*\n\n> *Judul:* ${res.result.title}\n> *Durasi:* ${dur || 'Tidak diketahui'}\n> *Kualitas:* ${qual || 'Tidak diketahui'}\n> *Views:* ${views || 'Tidak diketahui'}\n`
            const dll = res.result.files.high || res.result.files.low
            if (!dll) throw new Error('nggak bisa ambil link downloadnya...')
            await conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } }).catch(() => {})
            await conn.sendMessage(m.chat, { video: { url: dll }, caption: texto }, { quoted: m })
        } catch (e) {
            await conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } }).catch(() => {})
            m.reply(elainaSay('gagal', 'nggak bisa download videonya... coba cek link-nya ya~'))
        }
        return
    }

    try {
        const res = await search(encodeURIComponent(text))
        if (!res.result?.length) throw 'nggak ketemu hasilnya... coba kata kunci lain ya~'

        const lista = res.result.slice(0, 10).map((v, i) =>
            `*${i + 1}.*\n> *Judul:* ${v.title}\n> *Info:* ${v.info || 'Tidak ada info'}\n> *Link:* ${v.link}`
        ).join('\n\n')

        const leyenda = `🔞 *HASIL PENCARIAN XNXX*\n\n> *Cari:* ${text}\n> *Hasil:* ${res.result.length}\n\n${lista}\n\n> *Balas pesan ini dengan angka (1-10) buat download~*`

        const { key } = await conn.sendMessage(m.chat, { text: leyenda }, { quoted: m })
        conn.xnxx[m.sender] = {
            result: res.result.slice(0, 10),
            key,
            downloads: 0,
            timeout: setTimeout(() => delete conn.xnxx[m.sender], 120_000),
        }
        await conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } }).catch(() => {})
    } catch (e) {
        await conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } }).catch(() => {})
        m.reply(elainaSay('gagal', typeof e === 'string' ? e : 'ada sedikit masalah... coba lagi ya~'))
    }
}

handler.before = async (m, { conn }) => {
    conn.xnxx = conn.xnxx || {}
    const session = conn.xnxx[m.sender]
    if (!session) return
    if (!m.quoted || m.quoted.id !== session.key.id) return

    const n = parseInt(m.text.trim())
    if (isNaN(n) || n < 1 || n > session.result.length) return

    clearTimeout(session.timeout)
    delete conn.xnxx[m.sender]
    m.commandExecuted = true

    try {
        const link = session.result[n - 1].link
        const res = await xnxxdl(link)
        const { dur, qual, views } = res.result.info
        const texto = `🔞 *VIDEO XNXX*\n\n> *Judul:* ${res.result.title}\n> *Durasi:* ${dur || 'Tidak diketahui'}\n> *Kualitas:* ${qual || 'Tidak diketahui'}\n> *Views:* ${views || 'Tidak diketahui'}\n`
        const dll = res.result.files.high || res.result.files.low
        if (!dll) throw new Error('nggak bisa ambil link downloadnya...')
        await conn.sendMessage(m.chat, { video: { url: dll }, caption: texto }, { quoted: m })
    } catch (e) {
        m.reply(elainaSay('gagal', 'nggak bisa download videonya... coba lagi ya~'))
    } finally {
        session.downloads++
    }
}

handler.command = ['xnxxsearch', 'xnxxdl', 'xnxx']
handler.tags = ['nsfw']
handler.help = ['xnxx <kata kunci | url>']
handler.nsfw = true
handler.premium = true
handler.limit = 1

export default handler

function parseInfo(infoStr = '') {
    const lines = infoStr.split('\n').map(v => v.trim()).filter(Boolean)
    const [line1, line2] = lines
    let dur = '', qual = '', views = ''
    if (line1) {
        const durMatch = line1.match(/(\d+\s?min)/i)
        dur = durMatch ? durMatch[1] : ''
    }
    if (line2) {
        const parts = line2.split('-').map(v => v.trim()).filter(Boolean)
        if (parts.length >= 2) {
            qual = parts[0]
            views = parts[1]
        } else if (parts.length === 1) {
            qual = parts[0]
        }
    }
    return { dur, qual, views }
}

async function xnxxdl(URL) {
    return new Promise((resolve, reject) => {
        fetch(`${URL}`, { method: 'get', headers: { 'User-Agent': UA } }).then((res) => res.text()).then((res) => {
            const $ = cheerio.load(res, { xmlMode: false })
            const title = $('meta[property="og:title"]').attr('content')
            const duration = $('meta[property="og:duration"]').attr('content')
            const image = $('meta[property="og:image"]').attr('content')
            const videoType = $('meta[property="og:video:type"]').attr('content')
            const videoWidth = $('meta[property="og:video:width"]').attr('content')
            const videoHeight = $('meta[property="og:video:height"]').attr('content')
            const info = $('span.metadata').text()
            const videoScript = $('#video-player-bg > script:nth-child(6)').html()
            const files = {
                low: (videoScript.match("html5player.setVideoUrlLow\\('(.*?)'\\);") || [])[1],
                high: (videoScript.match("html5player.setVideoUrlHigh\\('(.*?)'\\);") || [])[1],
                HLS: (videoScript.match("html5player.setVideoHLS\\('(.*?)'\\);") || [])[1],
                thumb: (videoScript.match("html5player.setThumbUrl\\('(.*?)'\\);") || [])[1],
                thumb69: (videoScript.match("html5player.setThumbUrl169\\('(.*?)'\\);") || [])[1],
                thumbSlide: (videoScript.match("html5player.setThumbSlide\\('(.*?)'\\);") || [])[1],
                thumbSlideBig: (videoScript.match("html5player.setThumbSlideBig\\('(.*?)'\\);") || [])[1]
            }
            resolve({ status: 200, result: { title, URL, duration, image, videoType, videoWidth, videoHeight, info: parseInfo(info), files } })
        }).catch((err) => reject({ code: 503, status: false, result: err }))
    })
}

async function search(query) {
    return new Promise((resolve, reject) => {
        const baseurl = 'https://www.xnxx.com'
        fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, { method: 'get', headers: { 'User-Agent': UA } })
            .then((res) => res.text())
            .then((res) => {
                const $ = cheerio.load(res, { xmlMode: false })
                const title = []
                const url = []
                const desc = []
                const results = []
                $('div.mozaique').each(function (a, b) {
                    $(b).find('div.thumb').each(function (c, d) {
                        url.push(baseurl + $(d).find('a').attr('href').replace('/THUMBNUM/', '/'))
                    })
                })
                $('div.mozaique').each(function (a, b) {
                    $(b).find('div.thumb-under').each(function (c, d) {
                        desc.push($(d).find('p.metadata').text())
                        $(d).find('a').each(function (error, f) {
                            title.push($(f).attr('title'))
                        })
                    })
                })
                for (let i = 0; i < title.length; i++) {
                    results.push({ title: title[i], info: desc[i], link: url[i] })
                }
                resolve({ code: 200, status: true, result: results })
            })
            .catch((err) => reject({ code: 503, status: false, result: err }))
    })
}
