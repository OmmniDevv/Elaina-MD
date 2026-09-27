/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { pinterest } from 'btch-downloader';
import { generateWAMessageFromContent, proto, prepareWAMessageMedia } from '@rexxhayanasi/elaina-baileys';
import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";
const pluginConfig = {
    name: 'pins2',
    alias: ['pinsearch2', 'pinterestsearch2'],
    category: 'search',
    description: 'Cari gambar di Pinterest (Carousel/Swipe)',
    usage: '.pins <query>',
    example: '.pins Zhao Lusi',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock, config: botConfig }) {
    const query = m.text?.trim()
    if (!query) {
        return m.reply(
            `╭━━━〔 🔍 PINTEREST CAROUSEL 〕━━━⬣
┃
┃ ✨ *Cari gambar dengan swipe!*
┃
┃ 📝 *Contoh:*
┃ \`${m.prefix}pins Zhao Lusi\`
┃
┃ 💕 *Geser kiri/kanan* untuk lihat semua
╰━━━━━━━━━━━━━━━━⬣`
        )
    }

    m.react('🔍')

    try {
        const data = await pinterest(query)

        const results = data?.result?.result?.result || data?.result || []
        if (!results || results.length === 0) {
            m.react('❌')
            return m.reply(`❌ Tidak ditemukan hasil untuk: *${query}*`)
        }

        // Prepare carousel cards (semua hasil, tanpa batas)
        const carouselCards = []
        
        for (let i = 0; i < results.length; i++) {
            const item = results[i]
            const imageUrl = item.image_url ||
                item.images?.orig?.url ||
                item.images?.['736x']?.url ||
                item.url ||
                item.thumbnail

            if (!imageUrl) continue

            try {
                // Download & resize image untuk carousel
                const imgResponse = await axios.get(imageUrl, {
                    responseType: 'arraybuffer',
                    timeout: 15000
                })
                
                let imageBuffer = Buffer.from(imgResponse.data)
                
                // Resize ke 300x300 biar rapi
                imageBuffer = await sharp(imageBuffer)
                    .resize(300, 300, { fit: 'cover' })
                    .jpeg({ quality: 80 })
                    .toBuffer()
                
                const cardMedia = await prepareWAMessageMedia({
                    image: imageBuffer
                }, { upload: sock.waUploadToServer })
                
                const title = item.title || 'Pinterest Image'
                const author = item.uploader?.full_name || item.author || 'Unknown'
                const followers = item.uploader?.follower_count || item.followers || '-'
                
                const cardBody = 
`╭─〔 📌 PINTEREST ] 
│ 📝 *Title:* ${title.substring(0, 40)}${title.length > 40 ? '...' : ''}
│ 👤 *Author:* ${author}
│ 📊 *Followers:* ${followers}
│ 🖼️ *Gambar ${i+1}/${results.length}*
╰──────────────

💕 *Geser untuk gambar selanjutnya, Darling~*`

                const cardMessage = {
                    header: proto.Message.InteractiveMessage.Header.fromObject({
                        title: `📌 ${query.toUpperCase()} - ${i+1}/${results.length}`,
                        hasMediaAttachment: true,
                        ...cardMedia
                    }),
                    body: proto.Message.InteractiveMessage.Body.fromObject({
                        text: cardBody
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: `✨ Rimuru Pinterest • Swipe kiri/kanan untuk lihat semua ✨`
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                        buttons: [{
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({
                                display_text: `💾 Simpan Gambar ${i+1}`,
                                id: `${m.prefix}saveimg ${imageUrl}`
                            })
                        }]
                    })
                }
                
                carouselCards.push(cardMessage)
                
            } catch (err) {
                console.log(`[Pins] Gambar ${i+1} error:`, err.message)
                continue
            }
        }
        
        if (carouselCards.length === 0) {
            m.react('❌')
            return m.reply(`❌ Gagal memuat gambar untuk: *${query}*`)
        }
        
        const headerText = 
`╭━━━〔 💗 RIMURU PINTEREST CAROUSEL 💗 〕━━━⬣
┃
┃ 🔎 *Query:* ${query}
┃ 🖼️ *Total:* ${carouselCards.length} gambar
┃
┃ ✨ *Geser ke samping (swipe left/right)* ✨
┃ 💕 Untuk melihat semua gambar, Darling~
┃
┃ 📌 *Tap tombol* untuk menyimpan gambar
╰━━━━━━━━━━━━━━━━⬣`

        const msg = await generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({
                            text: headerText
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({
                            text: `✨ Rimuru Pinterest | “Nikmati gambarnya, Darling~” ✨`
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: carouselCards
                        })
                    })
                }
            }
        }, {
            userJid: m.sender
        })
        
        await sock.relayMessage(m.chat, msg.message, {
            messageId: msg.key.id
        })
        
        m.react('💗')

    } catch (err) {
        console.error('[Pins] Error:', err.message)
        m.react('❌')
        m.reply(
`╭━━━〔 ❌ RIMURU ERROR ❌ 〕━━━⬣
┃
┃ *Error:* ${err.message}
┃
┃ Coba lagi nanti ya, Darling~
╰━━━━━━━━━━━━━━━━⬣`
        )
    }
}

export { pluginConfig as config, handler };
