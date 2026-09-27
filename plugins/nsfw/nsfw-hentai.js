// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Hentai Search & Download — port dari pain-bot hentai.js (gratis, scrape veohentai.com, no key)
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import { JSDOM } from 'jsdom'
import { elainaSay, elainaReact } from '../../lib/elainaVoice.js'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) {
        return m.reply(elainaSay('noargs', `mau cari hentai apa nih~?\nContoh: ${usedPrefix}hentai <judul>\nAtau langsung: ${usedPrefix}hentai <url veohentai>`))
    }

    if (m.isGroup && !global.db.data.chats[m.chat]?.cmd18) {
        return m.reply(elainaSay('gagal', 'perintah +18 belum diaktifkan di grup ini... admin bisa aktifkan dengan *.cmd18 on* ya~'))
    }

    const isUrl = text.includes('veohentai.com/ver/')
    await conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } }).catch(() => {})

    try {
        if (isUrl) {
            const videoInfo = await getInfo(text)
            if (!videoInfo) throw 'nggak bisa ambil videonya... mungkin link-nya salah?'
            const cap = `🔞 *HENTAI DOWNLOAD*\n\n> *Judul:* ${videoInfo.title}\n> *Views:* ${videoInfo.views}\n> *Likes:* ${videoInfo.likes}\n> *Link:* ${text}`
            await conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } }).catch(() => {})
            return await conn.sendMessage(m.chat, { video: { url: videoInfo.videoUrl }, caption: cap }, { quoted: m })
        }

        const results = await searchHentai(text)
        if (!results.length) throw 'nggak ketemu hasilnya... coba kata kunci lain ya~'

        const lista = results.slice(0, 10).map((r, i) =>
            `*${i + 1}.*\n> *Judul:* ${r.titulo}\n> *Link:* ${r.url}`
        ).join('\n\n')

        const leyenda = `🔞 *HASIL PENCARIAN*\n> *Cari:* ${text}\n> *Hasil:* ${results.length}\n\n${lista}\n\n> *Balas pesan ini dengan angka (1-10) buat download~*`

        const { key } = await conn.sendMessage(m.chat, { text: leyenda }, { quoted: m })
        conn.hentai = conn.hentai || {}
        conn.hentai[m.sender] = {
            result: results.slice(0, 10),
            key,
            timeout: setTimeout(() => delete conn.hentai[m.sender], 120_000)
        }
        await conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } }).catch(() => {})
    } catch (e) {
        await conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } }).catch(() => {})
        m.reply(elainaSay('gagal', typeof e === 'string' ? e : 'ada sedikit masalah... coba lagi ya~'))
    }
}

handler.before = async (m, { conn }) => {
    conn.hentai = conn.hentai || {}
    const session = conn.hentai[m.sender]
    if (!session) return
    if (!m.quoted || m.quoted.id !== session.key.id) return

    const n = parseInt(m.text.trim())
    if (isNaN(n) || n < 1 || n > session.result.length) return

    clearTimeout(session.timeout)
    delete conn.hentai[m.sender]
    m.commandExecuted = true

    try {
        const link = session.result[n - 1].url
        const videoInfo = await getInfo(link)
        if (!videoInfo) throw 'nggak bisa ambil videonya...'
        const cap = `🔞 *HENTAI DOWNLOAD*\n> *Judul:* ${videoInfo.title}\n> *Views:* ${videoInfo.views}\n> *Likes:* ${videoInfo.likes}\n> *Link:* ${link}`
        await conn.sendMessage(m.chat, { video: { url: videoInfo.videoUrl }, caption: cap }, { quoted: m })
    } catch (e) {
        m.reply(elainaSay('gagal', 'nggak bisa download videonya... coba lagi ya~'))
    }
}

handler.command = ['hentai', 'hent', 'hentaisearch']
handler.tags = ['nsfw']
handler.nsfw = true
handler.premium = true
handler.help = ['hentai <judul | url>']
handler.limit = 1

export default handler

async function searchHentai(text) {
    try {
        const res = await fetch(`https://veohentai.com/?s=${encodeURIComponent(text)}`, { headers: { 'User-Agent': UA } })
        const html = await res.text()
        const $ = cheerio.load(html)
        const results = []
        $('.grid a').each((_, el) => {
            const url = $(el).attr('href')
            const titulo = $(el).find('h2').text().trim()
            if (url && titulo) results.push({ titulo, url })
        })
        return results
    } catch {
        return []
    }
}

async function getInfo(url) {
    try {
        const html = await (await fetch(url, { headers: { 'User-Agent': UA } })).text()
        const dom = new JSDOM(html)
        const doc = dom.window.document
        const iframe = doc.querySelector('iframe')
        if (!iframe) return null
        const iframeHtml = await (await fetch(iframe.src, { headers: { 'User-Agent': UA } })).text()
        const match = iframeHtml.match(/u=([^&"]+)/)
        if (!match) return null
        return {
            videoUrl: Buffer.from(match[1], 'base64').toString(),
            title: doc.querySelector('h1')?.textContent.trim() || 'Tanpa judul',
            views: doc.querySelector('h4')?.textContent.trim() || 'N/A',
            likes: doc.querySelector('#num-like')?.textContent.trim() || '0',
            dislikes: doc.querySelector('#num-dislike')?.textContent.trim() || '0'
        }
    } catch {
        return null
    }
}
