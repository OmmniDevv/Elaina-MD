/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage } from '@napi-rs/canvas';
import axios from 'axios';
import { RIMURU_CORE_CONFIG } from "../../config.js";
import config from '../../config.js';
const pluginConfig = {
    name: 'wa-canvas',
    alias: ['fakewaprofile', ],
    category: 'fun',
    description: 'Buat fake WhatsApp profile card',
    usage: '.wa-canvas <nama> | <nomor> | [status]',
    example: '.wa-canvas John Doe | 6281234567890 | Available',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 15,
    energi: 1,
    isEnabled: true
}

const BG_URL = 'https://files.cloudkuimages.guru/images/3W4zr6dp.jpg'
const FALLBACK_PP = 'https://telegra.ph/file/1ecdb5a0aee62ef17d7fc.jpg'

function formatNomor(nomor) {
    nomor = nomor.replace(/[^0-9]/g, '')
    if (nomor.startsWith('0')) nomor = '62' + nomor.slice(1)
    if (!nomor.startsWith('62')) nomor = '62' + nomor

    const kode = `+${nomor.slice(0, 2)}`
    const prefix = nomor.slice(2, 5)
    const tengah = nomor.slice(5, 9)
    const akhir = nomor.slice(9)
    return `${kode} ${prefix}-${tengah}-${akhir}`
}

async function handler(m, { sock }) {
    const text = m.text?.trim()

    if (!text || text.split('|').length < 2) {
        return m.reply(
            `📱 *ꜰᴀᴋᴇ ᴡᴀ ᴘʀᴏꜰɪʟᴇ*\n\n` +
            `> Buat fake WhatsApp profile card\n\n` +
            `╭┈┈⬡「 📋 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ* 」\n` +
            `┃ ${m.prefix}wa-canvas Nama | Nomor | Status\n` +
            `╰┈┈┈┈┈┈┈┈⬡\n\n` +
            `*ᴄᴏɴᴛᴏʜ:*\n` +
            `> ${m.prefix}wa-canvas John Doe | 6281234567890\n` +
            `> ${m.prefix}wa-canvas John | 081234567890 | Sibuk\n\n` +
            `> _Status bersifat opsional (default: Sibuk)_`
        )
    }

    const parts = text.split('|').map(v => v.trim())
    const nama = parts[0]
    const nomor = parts[1]
    const status = parts[2] || 'Sibuk'

    if (!nama || !nomor) {
        return m.reply(`❌ Nama dan nomor wajib diisi.`)
    }

    await m.react('⏳')

    try {
        let ppBuffer
        const quoted = m.quoted || m

        if (quoted && (m.isImage || (m.quoted && m.quoted.type === 'imageMessage'))) {
            ppBuffer = m.quoted ? await m.quoted.download() : await m.download()
        } else {
            try {
                const ppUrl = await sock.profilePictureUrl(m.sender, 'image')
                const res = await axios.get(ppUrl, { responseType: 'arraybuffer', timeout: 10000 })
                ppBuffer = Buffer.from(res.data)
            } catch {
                const res = await axios.get(FALLBACK_PP, { responseType: 'arraybuffer', timeout: 10000 })
                ppBuffer = Buffer.from(res.data)
            }
        }

        const [avatar, background] = await Promise.all([
            loadImage(ppBuffer),
            loadImage(BG_URL)
        ])

        const canvas = createCanvas(background.width, background.height)
        const ctx = canvas.getContext('2d')

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

        const avatarSize = 350
        const avatarX = (canvas.width - avatarSize) / 2
        const avatarY = 163

        ctx.save()
        ctx.beginPath()
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize)
        ctx.restore()

        const startY = 760
        const gapY = 150

        ctx.textAlign = 'left'
        ctx.font = '30px Arial'
        ctx.fillStyle = '#a7a4a4'

        ctx.fillText(nama, 165, startY + 25)
        ctx.fillText(status, 165, startY + gapY + 25)
        ctx.fillText(formatNomor(nomor), 165, startY + gapY * 2 + 25)

        ctx.fillStyle = '#25D366'
        ctx.fillText('Instagram', 165, startY + gapY * 3 + 26)

        const buffer = canvas.toBuffer('image/png')

        const saluranId = RIMURU_CORE_CONFIG.saluran?.id || config.saluran?.id
        const saluranName = RIMURU_CORE_CONFIG.saluran?.name || RIMURU_CORE_CONFIG.bot?.name || 'rimuru-AI'

        await sock.sendMessage(m.chat, {
            image: buffer,
            caption: `✅ *ꜰᴀᴋᴇ ᴡʜᴀᴛsᴀᴘᴘ ᴘʀᴏꜰɪʟᴇ*\n\n> 📱 ${nama}\n> 📞 ${formatNomor(nomor)}\n> 💬 ${status}`,
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

        await m.react('✅')
    } catch (err) {
        console.error('[WA-Canvas] Error:', err.message)
        await m.react('❌')
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> ${err.message}`)
    }
}

export { pluginConfig as config, handler };
