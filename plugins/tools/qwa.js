/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import { uploadImage } from '../../src/lib/elaina-uploader.js'
import te from '../../src/lib/elaina-error.js'
import { serialize } from '../../src/lib/elaina-serialize.js'
import { parsePhoneNumber } from 'awesome-phonenumber'

const pluginConfig = {
    name: 'qwa',
    alias: ['quotewa', 'fakeqwa'],
    category: 'tools',
    description: 'Membuat gambar quote WhatsApp',
    usage: '.qwa [teks]',
    example: '.qwa Halo Dunia',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true
}

async function getPp(sock, jid) {
    try {
        const url = await sock.profilePictureUrl(jid, 'image')
        return url
    } catch {
        return 'https://files.catbox.moe/ios0gb.jfif'
    }
}

async function handler(m, { sock }) {
    try {
        let mainMsg = m
        let quoteMsg = null
        let textToQuote = m.args.join(' ')

        if (m.quoted && !textToQuote) {
            mainMsg = m.quoted
            textToQuote = mainMsg.body || ''
            
            if (sock.store && sock.store.loadMessage && mainMsg.id) {
                const originalMainMsg = await sock.store.loadMessage(m.chat, mainMsg.id)
                if (originalMainMsg) {
                    const serializedOriginal = await serialize(sock, originalMainMsg)
                    if (serializedOriginal && serializedOriginal.quoted) {
                        quoteMsg = serializedOriginal.quoted
                    }
                }
            }
        } else if (m.quoted && textToQuote) {
            mainMsg = m
            quoteMsg = m.quoted
        }

        if (!textToQuote && !mainMsg.isMedia) {
            return m.reply(`❌ *FORMAT SALAH*\n\nKirim perintah \`.qwa <teks>\` atau reply pesan orang lain dengan \`.qwa\`.`)
        }
        await m.react('🕕')
        const msgTime = mainMsg.messageTimestamp ? new Date(mainMsg.messageTimestamp * 1000) : new Date()
        const timeStr = `${String(msgTime.getHours()).padStart(2, '0')}.${String(msgTime.getMinutes()).padStart(2, '0')}`
        let mainImage = null
        if (mainMsg.isMedia) {
            try {
                const buffer = await mainMsg.download()
                if (buffer) {
                    mainImage = await uploadImage(buffer)
                }
            } catch (err) {
                console.error("Gagal download/upload media utama:", err)
            }
        }

        let quotedImage = null
        if (quoteMsg && quoteMsg.isMedia) {
            try {
                const buffer = await quoteMsg.download()
                if (buffer) {
                    quotedImage = await uploadImage(buffer)
                }
            } catch (err) {
                console.error("Gagal download/upload media quoted:", err)
            }
        }

        const formatNumber = (numStr) => {
            try {
                const cleanNum = numStr.split('@')[0]
                const pn = parsePhoneNumber("+" + cleanNum)
                if (pn && pn.valid && pn.number && pn.number.international) {
                    return pn.number.international.replace(/-/g, ' ')
                }
            } catch (e) {}
            return "+" + numStr.split('@')[0]
        }

        const payload = {
            sender_name:  `~ ${mainMsg.pushName}` || "~ User",
            sender_number: formatNumber(mainMsg.sender),
            sender_avatar: await getPp(sock, mainMsg.sender),
            message: textToQuote,
            time: timeStr,
            background: false
        }

        if (mainImage) payload.sender_image = mainImage

        if (quoteMsg) {
            payload.quoted = {
                name: `~ ${quoteMsg.pushName}` || "~ User",
                number: formatNumber(quoteMsg.sender),
                message: quoteMsg.body || ""
            }
            if (quotedImage) payload.quoted.image = quotedImage
        }
        const res = await axios.post('https://qwa.eeq.my.id/api/generate', payload, {
            headers: { 'Content-Type': 'application/json' },
            responseType: 'arraybuffer'
        })
        await sock.sendMessage(m.chat, {
            image: Buffer.from(res.data),
            caption: `✅ Berhasil membuat quote WhatsApp!`
        }, { quoted: m })

        await m.react('✅')
    } catch (error) {
        console.error("Error QWA:", error)
        await m.react('❌')
        m.reply(`❌ *GAGAL MEMBUAT QUOTE*\n\n> Terjadi kesalahan atau API sedang bermasalah.`)
    }
}

export { pluginConfig as config, handler }
