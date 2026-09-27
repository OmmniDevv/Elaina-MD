// © Elaina-MD — unified downloader, no paid API keys
// Order: nexray -> yt-dlp binary -> vreden -> btch. First non-empty wins.
import youtubedl from 'youtube-dl-exec'
import { ytmp4 as vredenVid, ytmp3 as vredenAudio } from '@vreden/youtube_scraper'
import btch from 'btch-downloader'
import axios from 'axios'
import { tmpdir } from 'os'
import { join } from 'path'
import { writeFileSync, readFileSync, unlinkSync } from 'fs'

import ssyoutube from './youtube.js'
import ytdlScraper from './ytdl.js'
import tiktokScraper from './tiktok.js'
import igScraper from './ig.js'
import { fbdown as fbScraper } from './fbdown.js'
import twitterScraper from './twitter.js'
import mediafireScraper from './mediafire.js'
import pindlScraper from './pindl.js'

const YTDLP_BIN = join(process.cwd(), 'node_modules/youtube-dl-exec/bin/yt-dlp')
const UA = { 'User-Agent': 'Mozilla/5.0' }

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function getJson(url, opts = {}, tries = 2) {
  for (let i = 0; i < tries; i++) {
    try {
      const { data } = await axios.get(url, { timeout: 30000, headers: UA, ...opts })
      return data
    } catch (e) {
      if (i === tries - 1) throw e
      await sleep(1500)
    }
  }
}

function pickVideoUrl(result) {
  if (!result) return null
  if (typeof result === 'string' && /^https?:/.test(result)) return result
  const url = result.url || result.link || result.dlUrl || result.download
  if (typeof url === 'string' && /^https?:/.test(url)) return url
  const arr = result.urls || result.links || (Array.isArray(result.result) ? result.result : null)
  if (Array.isArray(arr)) {
    const hit = arr.find(x => x && /^https?:/.test(x.url || x.link || x))
    if (hit) return hit.url || hit.link || hit
  }
  return null
}

async function nexray(kind, url) {
  const base = kind === 'audio'
    ? 'https://api.nexray.eu.cc/downloader/v1/ytmp3?url='
    : 'https://api.nexray.eu.cc/downloader/v1/ytmp4?url='
  const data = await getJson(base + encodeURIComponent(url))
  if (data?.status && data?.result?.url) {
    return { url: data.result.url, title: data.result.title, duration: data.result.duration, via: 'nexray' }
  }
  return null
}

async function ytdlpGrab(url, { audio = false } = {}) {
  const out = join(tmpdir(), `elaina_${Date.now()}_${Math.random().toString(36).slice(2)}${audio ? '.mp3' : '.mp4'}`)
  const bin = typeof youtubedl.create === 'function' ? youtubedl.create(YTDLP_BIN) : youtubedl
  try {
    await bin(url, {
      extractAudio: audio,
      audioFormat: 'mp3',
      format: audio ? 'bestaudio' : 'best[ext=mp4][height<=720]/best',
      output: out,
      noPlaylist: true,
      quiet: true,
      noWarnings: true,
      socketTimeout: 60,
    })
    const buf = readFileSync(out)
    unlinkSync(out)
    return { buffer: buf, title: undefined, via: 'ytdlp' }
  } catch (e) {
    try { unlinkSync(out) } catch {}
    return null
  }
}

async function ytdlpMeta(url) {
  const bin = typeof youtubedl.create === 'function' ? youtubedl.create(YTDLP_BIN) : youtubedl
  try {
    const r = await bin(url, { dumpSingleJson: true, skipDownload: true, noWarnings: true, socketTimeout: 60 })
    if (!r) return null
    const dl = r.requested_downloads?.[0] || r.requested_formats?.[0] || r
    const link = dl.url || r.url
    if (link) return { url: link, title: r.title, thumbnail: r.thumbnail, duration: r.duration, via: 'ytdlp' }
    const fmt = (r.formats || []).filter(f => f.url && f.protocol === 'https')
                 .find(f => f.vcodec !== 'none' && f.acodec !== 'none')
                 || (r.formats || []).find(f => f.url && f.protocol === 'https')
    return fmt?.url ? { url: fmt.url, title: r.title, thumbnail: r.thumbnail, duration: r.duration, via: 'ytdlp' } : null
  } catch {
    return null
  }
}

async function vredenGrab(url, { audio = false } = {}) {
  const fn = audio ? vredenAudio : vredenVid
  if (typeof fn !== 'function') return null
  const res = await fn(url)
  if (!res?.status) return null
  const link = res.link || res.url || res.dlUrl || res.result?.url
  if (!link) return null
  return { url: link, title: res.title || res.metadata?.title, via: 'vreden' }
}

async function btchYoutube(url, { audio = false } = {}) {
  const res = await btch.youtube(url)
  if (!res?.status) return null
  const meta = res.metadata || res.result?.metadata || {}
  const link = res.url || res.link || (audio ? res.mp3 || res.audio : res.mp4 || res.video)
  if (!link) return null
  return { url: link, title: meta.title, via: 'btch' }
}

// ─── delirius (no-key, pola pain-bot) ─────────────────────────────
const DELIRIUS = () => (global.APIs?.delirius || 'https://api.delirius.online').replace(/\/$/, '')

async function deliriusYtSearch(query, limit = 8) {
  const data = await getJson(`${DELIRIUS()}/search/ytsearch?q=${encodeURIComponent(query)}`)
  const arr = Array.isArray(data?.data) ? data.data : []
  return arr.slice(0, limit).map(v => ({
    url: v.url || (v.videoId ? `https://youtu.be/${v.videoId}` : null),
    title: v.title,
    duration: v.duration,
    views: v.views,
    thumbnail: v.image || v.thumbnail,
    author: v.author?.name,
  })).filter(v => v.url)
}

async function deliriusYtmp3(url) {
  const data = await getJson(`${DELIRIUS()}/download/ytmp3?url=${encodeURIComponent(url)}`)
  const d = data?.data
  const link = d?.download && (typeof d.download === 'string' ? d.download : d.download.url)
  if (!link) return null
  return { url: link, title: d.title, duration: d.duration, thumbnail: d.image, via: 'delirius' }
}

async function deliriusSpotifySearch(query, limit = 8) {
  const data = await getJson(`${DELIRIUS()}/search/spotify?q=${encodeURIComponent(query)}&limit=${limit}`)
  const arr = Array.isArray(data?.data) ? data.data : []
  return arr.map(v => ({
    url: v.url,
    title: v.title,
    artist: v.artist,
    album: v.album,
    duration: v.duration,
    thumbnail: v.image,
  })).filter(v => v.url)
}

async function deliriusSpotifydl(url) {
  const data = await getJson(`${DELIRIUS()}/download/spotifydl?url=${encodeURIComponent(url)}`, { timeout: 60000 }, 1)
  const d = data?.data
  const link = d?.url || d?.download
  if (!link) return null
  return {
    url: typeof link === 'string' ? link : link.url,
    title: d.title, artist: d.author, thumbnail: d.image, via: 'delirius',
  }
}

// ─── Scraper Lokal Helper (Layer 1 Primary) ──────────────────────
async function localYoutubeGrab(url, { audio = false } = {}) {
  // 1. Coba ytdl (Ourin scraper)
  try {
    if (typeof ytdlScraper === 'function') {
      const res = await ytdlScraper(url, audio ? 'mp3' : 'mp4')
      if (res?.status && res?.dl) {
        return { url: res.dl, title: res.title, via: 'ourin-ytdl' }
      }
    }
  } catch {}

  // 2. Coba ssyoutube (Ourin scraper)
  try {
    if (typeof ssyoutube?.download === 'function') {
      const res = await ssyoutube.download(url)
      if (res?.downloads && Array.isArray(res.downloads)) {
        if (audio) {
          const a = res.downloads.find(d => d.audio === true || /mp3|m4a|opus/i.test(d.format))
          if (a?.url) return { url: a.url, title: res.meta?.title, duration: res.meta?.duration, via: 'ssyoutube' }
        } else {
          const v = res.downloads.find(d => d.audio === false && /mp4/i.test(d.format)) || res.downloads[0]
          if (v?.url) return { url: v.url, title: res.meta?.title, duration: res.meta?.duration, via: 'ssyoutube' }
        }
      }
    }
  } catch {}
  return null
}

// ─── public API ──────────────────────────────────────────────────

export async function youtubeVideo(url) {
  if (!/youtube\.com|youtu\.be/i.test(url)) throw new Error('URL harus YouTube')
  return (await localYoutubeGrab(url, { audio: false }))
    || (await nexray('video', url))
    || (await vredenGrab(url, { audio: false }))
    || (await ytdlpMeta(url))
    || (await btchYoutube(url, { audio: false }))
    || null
}

export async function youtubeAudio(url) {
  if (!/youtube\.com|youtu\.be/i.test(url)) throw new Error('URL harus YouTube')
  return (await localYoutubeGrab(url, { audio: true }))
    || (await deliriusYtmp3(url))
    || (await nexray('audio', url))
    || (await vredenGrab(url, { audio: true }))
    || (await ytdlpMeta(url))
    || (await btchYoutube(url, { audio: true }))
    || null
}

export async function ytSearch(query, limit) {
  return deliriusYtSearch(query, limit)
}

export async function spotifySearch(query, limit) {
  return deliriusSpotifySearch(query, limit)
}

export async function tiktok(url) {
  // 1. Scraper Lokal (Primary)
  try {
    const fn = typeof tiktokScraper === 'function' ? tiktokScraper : tiktokScraper?.default
    if (fn) {
      const r = await fn(url).catch(() => null)
      if (r?.downloads && Array.isArray(r.downloads) && r.downloads.length > 0) {
        const item = r.downloads[0]
        if (item?.url) return { url: item.url, title: r.title, via: 'scraper-lokal' }
      }
    }
  } catch {}

  // 2. REST API / btch (Fallback)
  const res = await btch.ttdl(url).catch(() => null)
  const vid = pickVideoUrl(res) || res?.video?.[0] || res?.result?.video?.[0]
  if (vid) return { url: typeof vid === 'string' ? vid : (vid.url || vid.link), title: res?.title, via: 'btch' }
  const au = res?.audio?.[0] || res?.result?.audio?.[0]
  if (au) return { url: typeof au === 'string' ? au : (au.url || au.link), title: res?.title, via: 'btch', audio: true }
  const y = await ytdlpMeta(url)
  return y || null
}

export async function instagram(url) {
  // 1. Scraper Lokal
  try {
    const fn = typeof igScraper === 'function' ? igScraper : igScraper?.default
    if (fn) {
      const r = await fn(url).catch(() => null)
      const hit = Array.isArray(r) ? r[0] : (r?.url || r?.download || r?.result?.[0])
      const link = typeof hit === 'string' ? hit : (hit?.url || hit?.link)
      if (link) return { url: link, via: 'scraper-lokal' }
    }
  } catch {}

  // 2. REST API / btch (Fallback)
  const res = await btch.igdl(url).catch(() => null)
  const link = pickVideoUrl(res) || res?.result?.[0]
  if (link) return { url: typeof link === 'string' ? link : (link.url || link.link), via: 'btch' }
  return (await ytdlpGrab(url, { audio: false })) || null
}

export async function facebook(url) {
  // 1. Scraper Lokal
  try {
    const fn = typeof fbScraper === 'function' ? fbScraper : fbScraper?.default
    if (fn) {
      const r = await fn(url).catch(() => null)
      const link = r?.hd || r?.sd || (Array.isArray(r) ? r[0]?.url : r?.url)
      if (link) return { url: link, via: 'scraper-lokal' }
    }
  } catch {}

  // 2. Fallback
  const res = await btch.fbdown(url).catch(() => null)
  const link = pickVideoUrl(res)
  if (link) return { url: link, via: 'btch' }
  return (await ytdlpGrab(url, { audio: false })) || null
}

export async function twitter(url) {
  // 1. Scraper Lokal
  try {
    const fn = typeof twitterScraper === 'function' ? twitterScraper : twitterScraper?.default
    if (fn) {
      const r = await fn(url).catch(() => null)
      const link = pickVideoUrl(r)
      if (link) return { url: link, via: 'scraper-lokal' }
    }
  } catch {}

  // 2. Fallback
  const res = await btch.twitter(url).catch(() => null)
  const link = pickVideoUrl(res)
  if (link) return { url: link, via: 'btch' }
  return (await ytdlpGrab(url, { audio: false })) || null
}

export async function mediafire(url) {
  // 1. Scraper Lokal
  try {
    const fn = typeof mediafireScraper === 'function' ? mediafireScraper : mediafireScraper?.default
    if (fn) {
      const r = await fn(url).catch(() => null)
      const link = r?.url || r?.link || r?.download
      if (link) return { url: link, title: r?.title || r?.filename, via: 'scraper-lokal' }
    }
  } catch {}

  // 2. Fallback
  const res = await btch.mediafire(url).catch(() => null)
  const link = pickVideoUrl(res) || res?.link || res?.url
  if (link) return { url: link, title: res?.title || res?.filename, via: 'btch' }
  return null
}

export async function pinterest(url) {
  // 1. Scraper Lokal
  try {
    const fn = typeof pindlScraper === 'function' ? pindlScraper : pindlScraper?.default
    if (fn) {
      const r = await fn(url).catch(() => null)
      const link = pickVideoUrl(r) || (Array.isArray(r) ? r[0] : null)
      if (link) return { url: link, via: 'scraper-lokal' }
    }
  } catch {}

  // 2. Fallback
  const res = await btch.pinterest(url).catch(() => null)
  const link = pickVideoUrl(res)
  if (link) return { url: link, via: 'btch' }
  return (await ytdlpGrab(url, { audio: false })) || null
}

export async function spotify(url) {
  const d = await deliriusSpotifydl(url)
  if (d) return d
  const res = await btch.spotify(url).catch(() => null)
  const link = pickVideoUrl(res) || res?.audio
  if (link) return { url: link, title: res?.title, via: 'btch', audio: true }
  return null
}

export async function soundcloud(url) {
  // delirius soundcloud 404 (dites 2026-09-26); btch -> yt-dlp only
  const res = await btch.soundcloud(url).catch(() => null)
  const link = pickVideoUrl(res) || res?.result?.audio
  if (link) return { url: link, title: res?.result?.title, via: 'btch', audio: true }
  return (await ytdlpGrab(url, { audio: true })) || null
}

export async function generic(url) {
  // capcut, snackvideo, threads, douyin, kuaishou, cocofun, xiaohongshu, gdrive
  const link = await ytdlpGrab(url, { audio: false })
  return link || null
}

export default {
  youtubeVideo, youtubeAudio, tiktok, instagram, facebook, twitter,
  mediafire, pinterest, spotify, soundcloud, generic,
}
