/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import crypto from 'crypto'
import { generateWAMessage, generateWAMessageFromContent, jidNormalizedUser } from '@rexxhayanasi/elaina-baileys'
import config from '../../config.js'
import te from '../../src/lib/elaina-error.js'

const pluginConfig = {
    name: 'tiktokfoto',
    alias: ['ttfoto', 'ttphotosearch', 'searchtiktokfoto'],
    category: 'search',
    description: 'Cari foto TikTok dan kirim album gambar',
    usage: '.tiktokfoto <query>',
    example: '.tiktokfoto cosplay',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

const CUKI_APIKEY = config.APIkey?.cuki || 'cuki-x'

function formatNumber(n) {
    const value = Number(n) || 0
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M'
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K'
    return value.toString()
}

function trimText(text, max = 180) {
    const value = (text || '').replace(/\s+/g, ' ').trim()
    if (!value) return '-'
    if (value.length <= max) return value
    return value.slice(0, max) + '...'
}

async function fetchTiktokFoto(query) {
    const { data } = await axios.get(`https://api.cuki.biz.id/api/search/tiktokfoto?apikey=${encodeURIComponent(CUKI_APIKEY)}&query=${encodeURIComponent(query)}`, {
        timeout: 30000,
        headers: {
            'x-api-key': CUKI_APIKEY,
            'user-agent': 'Mozilla/5.0'
        }
    })

    if (!data?.success || !data?.data?.results?.length) {
        throw new Error(data?.message || 'Foto TikTok tidak ditemukan')
    }

    return data.data
}

async function handler(m, { sock }) {
    const query = m.text?.trim()

    if (!query) {
        return m.reply(`📸 *TIKTOK FOTO SEARCH*\n\n> Contoh:\n\`${m.prefix}tiktokfoto cosplay\``)
    }

    m.react('🔍')

    try {
        const result = await fetchTiktokFoto(query)
        const post = result.results[0]
        const images = Array.isArray(post?.images) ? post.images.slice(0, 10) : []

        if (!post || images.length === 0) {
            m.react('❌')
            return m.reply(`❌ Tidak ditemukan foto TikTok untuk: ${query}`)
        }

        let caption = '📸 *TIKTOK FOTO SEARCH*\n\n'
        caption += `🔎 *Query:* ${result.query || query}\n`
        caption += `📌 *Judul:* ${trimText(post.title || post.description)}\n`
        caption += `👤 *Author:* ${post.author?.nickname || '-'}\n`
        caption += `🌍 *Region:* ${post.region || '-'}\n`
        caption += `🖼️ *Foto:* ${post.image_count || images.length}\n`
        caption += `❤️ *Like:* ${formatNumber(post.stats?.like)}\n`
        caption += `💬 *Comment:* ${formatNumber(post.stats?.comment)}\n`
        caption += `🔁 *Share:* ${formatNumber(post.stats?.share)}\n`
        caption += `🆔 *ID:* ${post.id || '-'}\n\n`
        caption += `📝 ${trimText(post.description || post.title, 220)}`

        await m.reply(caption)

        const mediaList = []
        for (const url of images) {
            try {
                const imageRes = await axios.get(url, {
                    responseType: 'arraybuffer',
                    timeout: 20000,
                    headers: {
                        'user-agent': 'Mozilla/5.0'
                    }
                })
                const buffer = Buffer.from(imageRes.data)
                if (buffer.length > 1000) {
                    mediaList.push({ image: buffer })
                }
            } catch {}
        }

        if (mediaList.length === 0) {
            m.react('❌')
            return m.reply('❌ Gagal memuat foto TikTok')
        }

        try {
            const opener = generateWAMessageFromContent(
                m.chat,
                {
                    messageContextInfo: { messageSecret: crypto.randomBytes(32) },
                    albumMessage: {
                        expectedImageCount: mediaList.length,
                        expectedVideoCount: 0
                    }
                },
                {
                    userJid: jidNormalizedUser(sock.user.id),
                    quoted: m,
                    upload: sock.waUploadToServer
                }
            )

            await sock.relayMessage(opener.key.remoteJid, opener.message, {
                messageId: opener.key.id
            })

            for (const content of mediaList) {
                const msg = await generateWAMessage(opener.key.remoteJid, content, {
                    upload: sock.waUploadToServer
                })

                msg.message.messageContextInfo = {
                    messageSecret: crypto.randomBytes(32),
                    messageAssociation: {
                        associationType: 1,
                        parentMessageKey: opener.key
                    }
                }

                await sock.relayMessage(msg.key.remoteJid, msg.message, {
                    messageId: msg.key.id
                })
            }
        } catch {
            for (const content of mediaList) {
                await sock.sendMessage(m.chat, content, { quoted: m })
            }
        }

        m.react('✅')
    } catch (error) {
        console.log(error)
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }
