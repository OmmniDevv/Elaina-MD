/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import { RIMURU_CORE_CONFIG } from "../../config.js";
import config from '../../config.js';
const pluginConfig = {
    name: 'tenor',
    alias: ['gif', 'gifsearch'],
    category: 'search',
    description: 'Cari GIF dari Tenor',
    usage: '.tenor <query>',
    example: '.tenor kucing lucu',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

function extractTenorTokenFromMediaUrl(u = '') {
    const s = String(u || '')
    const m = s.match(/tenor\.com\/m\/([^/]+)/i)
    return m?.[1] || ''
}

function toTrueGifUrlFromToken(token = '') {
    return token ? `https://c.tenor.com/${token}/tenor.gif` : ''
}

function pickPlayableFromMediaFormats(mf = {}) {
    const gif = mf?.gif?.url || mf?.originalgif?.url || ''
    const token = extractTenorTokenFromMediaUrl(gif)
    const trueGif = toTrueGifUrlFromToken(token)
    const mp4 = mf?.mp4?.url || mf?.tinymp4?.url || ''
    const webm = mf?.webm?.url || ''
    return trueGif || gif || mp4 || webm || ''
}

function pickDimsDurationSize(mf = {}) {
    const order = ['gif', 'originalgif', 'mp4', 'tinymp4', 'webm', 'mediumgif', 'tinygif', 'webp', 'tinywebp']
    for (const k of order) {
        const v = mf?.[k]
        if (!v?.url) continue
        return {
            type: k,
            dims: Array.isArray(v.dims) ? v.dims : null,
            duration: typeof v.duration === 'number' ? v.duration : null,
            size: typeof v.size === 'number' ? v.size : null,
            preview: v.preview || ''
        }
    }
    return { type: '', dims: null, duration: null, size: null, preview: '' }
}

function normalizeResult(r = {}) {
    const mf = r.media_formats || {}
    const playable_url = pickPlayableFromMediaFormats(mf)
    const meta = pickDimsDurationSize(mf)
    return {
        id: String(r.id || ''),
        title: r.title || r.h1_title || r.long_title || '',
        author: r.user || null,
        page_url: r.url || r.itemurl || '',
        tags: Array.isArray(r.tags) ? r.tags : [],
        content_rating: r.content_rating || '',
        hasaudio: Boolean(r.hasaudio),
        created: r.created || null,
        playable_url,
        media: {
            type: meta.type,
            duration: meta.duration,
            size: meta.size
        }
    }
}

async function searchTenor(query) {
    const params = {
        appversion: 'browser-r20251209-1',
        prettyPrint: 'false',
        key: 'AIzaSyC-P6_qz3FzCoXGLk6tgitZo4jEJ5mLzD8',
        client_key: 'tenor_web',
        locale: 'es_US',
        anon_id: 'AAZHDntgcvcI5Qq9XzSEuQ',
        q: query,
        limit: '50',
        contentfilter: 'low',
        media_filter: 'gif,gif_transparent,mediumgif,tinygif,tinygif_transparent,webp,webp_transparent,tinywebp,tinywebp_transparent,tinymp4,mp4,webm,originalgif,gifpreview',
        fields: [
            'next',
            'results.id',
            'results.media_formats',
            'results.title',
            'results.h1_title',
            'results.long_title',
            'results.itemurl',
            'results.url',
            'results.created',
            'results.user',
            'results.tags',
            'results.content_rating',
            'results.hasaudio'
        ].join(','),
        component: 'web_mobile'
    }
    
    const res = await axios.get('https://tenor.googleapis.com/v2/search', {
        params,
        timeout: 30000,
        headers: {
            accept: 'application/json, text/plain, */*',
            'user-agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
            'cache-control': 'no-store'
        },
        validateStatus: (s) => s >= 200 && s < 300
    })
    
    const data = res.data || {}
    return Array.isArray(data.results) ? data.results.map(normalizeResult) : []
}

async function handler(m, { sock }) {
    const query = m.text?.trim()
    
    if (!query) {
        return m.reply(
            `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
            `> \`${m.prefix}tenor <query>\`\n\n` +
            `> Contoh:\n` +
            `> \`${m.prefix}tenor kucing lucu\``
        )
    }
    
    m.react('🔍')
    
    try {
        const data = await searchTenor(query)
        
        if (!data.length) {
            return m.reply(`❌ Tidak ditemukan GIF untuk: ${query}`)
        }
        
        const rand = data[Math.floor(Math.random() * data.length)]
        
        const saluranId = RIMURU_CORE_CONFIG.saluran?.id || config.saluran?.id
        const saluranName = RIMURU_CORE_CONFIG.saluran?.name || RIMURU_CORE_CONFIG.bot?.name || 'rimuru-AI'
        
        await sock.sendMessage(m.chat, {
            video: { url: rand.playable_url },
            gifPlayback: true,
            caption: `🎬 *${rand.title || 'Tenor GIF'}*\n\n` +
                `> Query: \`${query}\`\n` +
                `> Source: Tenor`,
            contextInfo: {
                forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: saluranId,
                    newsletterName: saluranName,
                    serverMessageId: 127
                }
            }
        }, { quoted: m })
        
        m.react('✅')
        
    } catch (err) {
        m.react('❌')
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> ${err.message}`)
    }
}

export { pluginConfig as config, handler };
