/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import config from '../../config.js';
const pluginConfig = {
    name: 'animedl',
    alias: ['anime-download', 'animedownload', 'dlanime'],
    category: 'anime',
    description: 'Download anime batch/single episode dari Kusonime',
    usage: '.animedl <judul | eps>',
    example: '.animedl jujutsu kaisen season 2 | 1',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 15,
    energi: 2,
    isEnabled: true
}

async function searchAnime(query) {
    try {
        const response = await axios.get(`https://kusonime.com/?s=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        })
        const $ = cheerio.load(response.data)
        const results = []
        
        $('.venz > ul > .kover').each((i, el) => {
            const item = $(el)
            const title = item.find('.content h2 a').text().trim()
            const url = item.find('.content h2 a').attr('href')
            if (title && url) {
                results.push({ title, url })
            }
        })
        
        return results
    } catch (err) {
        console.error('[AnimeDL] Search error:', err.message)
        return []
    }
}

async function getAnimeDetail(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        })
        const $ = cheerio.load(response.data)
        
        const title = $('h1.jdlz').text().trim()
        const poster = $('.post-thumb img.wp-post-image').attr('src') || ''
        
        const info = {}
        $('.info p').each((i, el) => {
            const text = $(el).text().trim()
            if (text.includes(':')) {
                const [key, ...valueParts] = text.split(':')
                const cleanKey = key.trim().toLowerCase()
                const cleanValue = valueParts.join(':').trim()
                info[cleanKey] = cleanValue
            }
        })
        
        const downloads = []
        
        $('.smokeddlrh').each((i, batchEl) => {
            const $batch = $(batchEl)
            const batchTitle = $batch.find('.smokettlrh').text().trim()
            
            $batch.find('.smokeurlrh').each((j, resEl) => {
                const $res = $(resEl)
                const resolution = $res.find('strong').text().trim()
                
                const links = []
                $res.find('a').each((k, a) => {
                    const $a = $(a)
                    const provider = $a.text().trim()
                    const url = $a.attr('href')
                    if (url && url.startsWith('http')) {
                        links.push({ provider, url })
                    }
                })
                
                if (links.length > 0) {
                    downloads.push({
                        title: batchTitle,
                        resolution: resolution,
                        links: links
                    })
                }
            })
        })
        
        $('.smokedl .smokeurl').each((i, el) => {
            const $el = $(el)
            const resolution = $el.find('strong').text().trim()
            const links = []
            $el.find('a').each((j, a) => {
                const $a = $(a)
                const provider = $a.text().trim()
                const url = $a.attr('href')
                if (url && url.startsWith('http')) {
                    links.push({ provider, url })
                }
            })
            if (links.length > 0) {
                downloads.push({
                    title: 'Single Episode',
                    resolution: resolution || 'All',
                    links: links
                })
            }
        })
        
        return { title, poster, info, downloads }
    } catch (err) {
        console.error('[AnimeDL] Detail error:', err.message)
        return null
    }
}

function extractEpisodeFromDownloads(downloads, targetEpisode) {
    const results = []
    
    for (const item of downloads) {
        const title = item.title || ''
        const resolution = item.resolution || ''
        
        let episodeMatch = null
        const epRegex = /(?:Episode|Eps|EP|eps|episode)[\s]*(\d+)/i
        const match = title.match(epRegex)
        
        if (match) {
            episodeMatch = parseInt(match[1])
        }
        
        const titleLower = title.toLowerCase()
        if (titleLower.includes('batch') || titleLower.includes('season') || titleLower.includes('complete')) {
            if (targetEpisode === 'batch') {
                results.push({
                    type: 'Batch',
                    title: item.title,
                    resolution: resolution,
                    links: item.links
                })
            }
        } else if (episodeMatch) {
            if (targetEpisode === 'batch') {
                continue
            } else if (parseInt(targetEpisode) === episodeMatch) {
                results.push({
                    type: `Episode ${episodeMatch}`,
                    title: item.title,
                    resolution: resolution,
                    links: item.links
                })
            }
        }
    }
    
    return results
}

async function handler(m, { sock }) {
    const input = m.args.join(' ') || m.text?.trim() || ''
    
    if (!input) {
        return m.reply(
            `💕 *ᴀɴɪᴍᴇ ᴅᴏᴡɴʟᴏᴀᴅ* 💕\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✦ *Cara Pakai*\n` +
            `┃\n` +
            `┃   ${m.prefix}animedl <judul> | <eps/batch>\n` +
            `┃\n` +
            `┃ ✦ *Contoh*\n` +
            `┃\n` +
            `┃   ${m.prefix}animedl jujutsu kaisen | 1\n` +
            `┃   ${m.prefix}animedl jujutsu kaisen | batch\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Mau download anime apa darling~?\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
    }
    
    const parts = input.split('|').map(p => p.trim())
    const query = parts[0]
    let episode = parts[1] || '1'
    
    if (!query) {
        return m.reply(`❌ Masukkan judul anime darling~`)
    }
    
    episode = episode.toLowerCase()
    const isBatch = episode === 'batch'
    
    m.react('💕')
    await m.reply(`⏳ *ᴘʀᴏᴄᴇꜱꜱɪɴɢ...*\n\n💗 *Rimuru:* Lagi mencari anime ${query} darling~ tunggu sebentar yaa 🦋`)
    
    try {
        const searchResults = await searchAnime(query)
        
        if (!searchResults || searchResults.length === 0) {
            m.react('💔')
            return m.reply(`💔 *ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ*\n\n> Anime *${query}* tidak ditemukan darling~`)
        }
        
        const anime = searchResults[0]
        const detail = await getAnimeDetail(anime.url)
        
        if (!detail || !detail.downloads.length) {
            m.react('💔')
            return m.reply(`💔 *ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ*\n\n> Link download tidak ditemukan darling~`)
        }
        
        let matchedDownloads = []
        
        if (isBatch) {
            matchedDownloads = extractEpisodeFromDownloads(detail.downloads, 'batch')
        } else {
            const episodeNum = parseInt(episode)
            if (isNaN(episodeNum)) {
                m.react('💔')
                return m.reply(`💔 *ᴇʀʀᴏʀ*\n\n> Nomor episode tidak valid darling~`)
            }
            matchedDownloads = extractEpisodeFromDownloads(detail.downloads, episodeNum)
        }
        
        if (matchedDownloads.length === 0) {
            m.react('💔')
            return m.reply(
                `💔 *ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ*\n\n` +
                `> ${isBatch ? 'Batch download' : `Episode ${episode}`} tidak ditemukan darling~\n\n` +
                `> Coba judul lain atau episode yang berbeda 🥺`
            )
        }
        
        let txt = `💕 *ᴀɴɪᴍᴇ ᴅᴏᴡɴʟᴏᴀᴅ* 💕\n\n`
        txt += `╭━━━━━━━━━━━━━━━━━━━━━⬣\n`
        txt += `┃ 📺 *ᴛɪᴛʟᴇ*: ${detail.title}\n`
        if (detail.info.genre) txt += `┃ 🏷️ *ɢᴇɴʀᴇ*: ${detail.info.genre}\n`
        if (detail.info.status) txt += `┃ 📌 *ꜱᴛᴀᴛᴜꜱ*: ${detail.info.status}\n`
        if (detail.info.episode) txt += `┃ 📀 *ᴇᴘɪꜱᴏᴅᴇ*: ${detail.info.episode}\n`
        txt += `╰━━━━━━━━━━━━━━━━━━━━━⬣\n\n`
        
        for (const dl of matchedDownloads) {
            txt += `╭━━━〔 📦 ${dl.type} › ${dl.resolution} 〕━━━⬣\n`
            for (const link of dl.links) {
                txt += `┃    • ${link.provider}: ${link.url}\n`
            }
            txt += `╰━━━━━━━━━━━━━━━━━━━━━⬣\n\n`
        }
        
        txt += `💗 *Rimuru:* Klik link di atas buat download darling~ 🎬`
        
        await m.reply(txt)
        m.react('✅')
        
    } catch (err) {
        console.error('[AnimeDL] Error:', err)
        m.react('💔')
        return m.reply(
            `💔 *ᴇʀʀᴏʀ*\n\n` +
            `> ${err.message}\n\n` +
            `> Coba lagi ya darling~ 🥺`
        )
    }
}

export { pluginConfig as config, handler };
