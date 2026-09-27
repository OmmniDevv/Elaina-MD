/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
const BASE_URL = 'https://winbu.net'
const DATA_DIR = path.join(process.cwd(), 'src', 'data')
const SENT_FILE = path.join(DATA_DIR, 'autoanime_winbu_sent.json')
const STATE_FILE = path.join(DATA_DIR, 'autoanime_winbu_state.json')

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': BASE_URL
}

function loadSent() {
    try {
        if (!fs.existsSync(SENT_FILE)) return new Set()
        return new Set(JSON.parse(fs.readFileSync(SENT_FILE, 'utf8')))
    } catch {
        return new Set()
    }
}

function saveSent(set) {
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
        fs.writeFileSync(SENT_FILE, JSON.stringify([...set]))
    } catch {}
}

function loadState() {
    try {
        if (!fs.existsSync(STATE_FILE)) return { enabled: false, groups: [], interval: 5 }
        return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
    } catch {
        return { enabled: false, groups: [], interval: 5 }
    }
}

function saveState(state) {
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
    } catch {}
}

async function fetchPage(url) {
    const res = await axios.get(url, { headers: HEADERS, timeout: 30000 })
    return String(res.data)
}

async function getOngoingAnimeList() {
    const html = await fetchPage(`${BASE_URL}/`)
    const $ = cheerio.load(html)
    const list = []

    $('.movies-list-wrap').each((_, section) => {
        const sectionTitle = $(section).find('.list-title h2').attr('title') || ''
        if (sectionTitle.includes('Anime Terbaru') || sectionTitle.includes('Populer')) {
            $(section).find('.ml-item').each((__, item) => {
                const a = $(item).find('a.ml-mask')
                const href = a.attr('href') || ''
                const title = a.attr('title')?.trim() || ''
                if (!href || !title) return

                const imgEl = $(item).find('img')
                const cover = imgEl.attr('data-original') || imgEl.attr('data-src') || imgEl.attr('src') || ''

                const normalUrl = new URL(href, BASE_URL).href
                list.push({
                    title,
                    url: normalUrl,
                    slug: href.split('/anime/')[1]?.replace(/\//g, '') || '',
                    cover: cover ? new URL(cover, BASE_URL).href : ''
                })
            })
        }
    })

    return list
}

async function getLatestEpisodeLink(animeUrl) {
    const html = await fetchPage(animeUrl)
    const $ = cheerio.load(html)
    const episodeLink = $('a[href*="episode"]').first()
    if (!episodeLink.length) return null

    let href = episodeLink.attr('href') || ''
    const text = episodeLink.text().trim() || ''
    if (!href) return null

    let fullUrl = href
    if (!href.startsWith('http')) fullUrl = new URL(href, BASE_URL).href

    const epMatch = fullUrl.match(/episode[_-]?(\d+)/i) || fullUrl.match(/ep[_-]?(\d+)/i)
    const epNum = epMatch ? epMatch[1] : 'Latest'

    return {
        number: epNum,
        text: text || `Episode ${epNum}`,
        url: fullUrl
    }
}

async function getEpisodeTime(episodeUrl) {
    try {
        const html = await fetchPage(episodeUrl)
        const $ = cheerio.load(html)

        const metaTime = $('meta[property="article:published_time"]').attr('content')
        if (metaTime) return metaTime

        const timeEl = $('time')
        if (timeEl.length) {
            const dt = timeEl.attr('datetime')
            if (dt) return dt
            const txt = timeEl.text().trim()
            if (txt) return txt
        }

        const dateText = ($('.post-date').text() || $('.entry-date').text() || $('.published').text()).trim()
        if (dateText) return dateText

        const bodyText = $('body').text()
        const match = bodyText.match(/(\d+)\s+(hours?|days?|minutes?|seconds?)\s+ago/i)
        if (match) return match[0]

        return null
    } catch {
        return null
    }
}

function parseRelativeTimeToHours(timeStr) {
    if (!timeStr) return null

    if (timeStr.match(/^\d{4}-\d{2}-\d{2}T/)) {
        const pubDate = new Date(timeStr)
        if (!isNaN(pubDate)) return (Date.now() - pubDate) / (1000 * 60 * 60)
    }

    const regex = /(\d+)\s+(hour|day|minute|second)s?\s+ago/i
    const match = timeStr.match(regex)
    if (match) {
        const value = parseInt(match[1])
        const unit = match[2].toLowerCase()
        switch (unit) {
            case 'hour': return value
            case 'day': return value * 24
            case 'minute': return value / 60
            case 'second': return value / 3600
        }
    }

    const timestamp = Date.parse(timeStr)
    if (!isNaN(timestamp)) return (Date.now() - timestamp) / (1000 * 60 * 60)

    return null
}

async function getDownloadLink(episodeUrl) {
    const { data } = await axios.get(episodeUrl, { headers: HEADERS, timeout: 30000 })
    const $ = cheerio.load(data)
    const downloadLinks = []

    $('.download-eps ul li').each((_, el) => {
        const quality = $(el).find('strong').text().trim()
        if (!quality) return
        const links = []
        $(el).find('span a').each((__, linkEl) => {
            const provider = $(linkEl).text().trim()
            const href = $(linkEl).attr('href')
            if (provider && href) links.push({ provider, url: href })
        })
        if (links.length > 0) downloadLinks.push({ quality, links })
    })

    if (downloadLinks.length === 0) return null

    const qualityPriority = ['720p', '1080p', '480p', '360p']
    downloadLinks.sort((a, b) => {
        const getPriority = (q) => {
            const match = q.match(/(\d{3,4}p)/i)
            if (!match) return 999
            const idx = qualityPriority.indexOf(match[1].toLowerCase())
            return idx === -1 ? 999 : idx
        }
        return getPriority(a.quality) - getPriority(b.quality)
    })

    let selectedLink = null
    let selectedQuality = null

    for (const item of downloadLinks) {
        const pixeldrain = item.links.find(l =>
            l.provider.toLowerCase().includes('pixeldrain') || l.url.includes('pixeldrain')
        )
        if (pixeldrain) {
            selectedLink = pixeldrain.url
            selectedQuality = item.quality
            break
        }
    }

    if (!selectedLink) return null

    const qualityMatch = selectedQuality.match(/(\d{3,4}p)/i)
    return {
        host: 'Pixeldrain',
        url: selectedLink,
        quality: qualityMatch ? qualityMatch[1] : 'Unknown'
    }
}

function resolvePixeldrainPageUrl(rawUrl) {
    const id = (rawUrl.match(/pixeldrain\.(?:com|net)\/(?:u|d|api\/file)\/([a-zA-Z0-9]+)/i) || [])[1]
    if (id) return `https://pixeldrain.com/u/${id}`
    return rawUrl
}

async function formatSize(b) {
    if (!b) return '0 B'
    const i = Math.floor(Math.log(b) / Math.log(1024))
    return (b / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i]
}

async function notifyAndSend(sock, groupIds, linkObj, meta) {
    const pageUrl = resolvePixeldrainPageUrl(linkObj.url)

    let coverBuffer = null
    if (meta.cover) {
        try {
            const res = await axios.get(meta.cover, {
                responseType: 'arraybuffer',
                timeout: 15000,
                headers: HEADERS
            })
            coverBuffer = Buffer.from(res.data)
        } catch (e) {
            console.log(`[AutoAnime-Winbu] ⚠️ Cover gagal: ${e.message}`)
        }
    }

    const caption =
        `*ANIME UPDATE! ✨*\n\n` +
        `📺 Judul: *${meta.title}*\n` +
        `🎞️ Episode: ${meta.episode}\n` +
        `📊 Kualitas: *${linkObj.quality}*`

    for (const gid of groupIds) {
        try {
            const msgPayload = coverBuffer
                ? { image: coverBuffer, caption, footer: 'Klik tombol di bawah untuk download video 👇' }
                : { text: caption, footer: 'Klik tombol di bawah untuk download video 👇' }

            await sock.sendMessage(gid, {
                ...msgPayload,
                interactiveButtons: [
                    {
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: `Download ${linkObj.quality}`,
                            url: pageUrl
                        })
                    }
                ]
            })
            console.log(`[AutoAnime-Winbu] ✅ Notified ${gid}: ${meta.title} ${meta.episode}`)
            await new Promise(r => setTimeout(r, 3000))
        } catch (e) {
            console.error(`[AutoAnime-Winbu] ❌ Send error ${gid}:`, e.message)
        }
    }
}

let autoInterval = null
let isRunning = false
let globalSock = null

async function runCheck() {
    const state = loadState()
    const groups = state.groups || []
    if (groups.length === 0) {
        console.log('[AutoAnime-Winbu] ⚠️ No target groups configured')
        return
    }

    const sent = loadSent()
    console.log(`[AutoAnime-Winbu] 🔍 Check: ${new Date().toLocaleString('id-ID')}`)

    let animeList
    try {
        animeList = await getOngoingAnimeList()
    } catch (e) {
        console.error('[AutoAnime-Winbu] ❌ Error:', e.message)
        return
    }

    if (animeList.length === 0) {
        console.log('[AutoAnime-Winbu] Tidak ada anime')
        return
    }

    for (const anime of animeList) {
        try {
            const episodeData = await getLatestEpisodeLink(anime.url)
            if (!episodeData) continue

            const episodeKey = `${anime.slug}-${episodeData.number}`
            if (sent.has(episodeKey)) continue

            const timeStr = await getEpisodeTime(episodeData.url)
            if (timeStr) {
                const hours = parseRelativeTimeToHours(timeStr)
                if (hours !== null && hours >= 24) {
                    sent.add(episodeKey)
                    saveSent(sent)
                    continue
                }
            }

            const linkObj = await getDownloadLink(episodeData.url)
            if (!linkObj) continue

            await notifyAndSend(globalSock, groups, linkObj, {
                title: anime.title,
                episode: episodeData.text,
                cover: anime.cover || ''
            })

            sent.add(episodeKey)
            saveSent(sent)
            await new Promise(r => setTimeout(r, 5000))
        } catch (e) {
            console.error(`[AutoAnime-Winbu] ❌ Error ${anime.title}:`, e.message)
        }
    }

    console.log('[AutoAnime-Winbu] ✅ Check complete')
}

function startAutoCheck(sock, intervalMinutes = 5) {
    if (autoInterval) clearInterval(autoInterval)
    globalSock = sock
    isRunning = true

    const ms = intervalMinutes * 60 * 1000
    runCheck().catch(e => console.error('[AutoAnime-Winbu]', e.message))
    autoInterval = setInterval(() => {
        runCheck().catch(e => console.error('[AutoAnime-Winbu]', e.message))
    }, ms)

    if (autoInterval.unref) autoInterval.unref()
}

function stopAutoCheck() {
    if (autoInterval) clearInterval(autoInterval)
    autoInterval = null
    isRunning = false
}

function initAutoStart(sock) {
    const state = loadState()
    if (!state.enabled) return
    console.log('[AutoAnime-Winbu] 🔄 Auto-restore enabled')
    startAutoCheck(sock, state.interval || 5)
}

export { loadSent, saveSent, loadState, saveState, getOngoingAnimeList, getLatestEpisodeLink, getDownloadLink, notifyAndSend, startAutoCheck, stopAutoCheck, initAutoStart, runCheck, isRunning, formatSize }