// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import axios from 'axios'

// ─── Brat Vermeil ────────────────────────────────────────────
let handlerBratVermeil = async (m, { conn, text }) => {
    if (!text) throw `👿 *ʙʀᴀᴛ ᴠᴇʀᴍᴇɪʟ*\n\n> Contoh: \`${m.prefix}bratvermeil Jangan lupa makan\``
    conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } })
    // ponytail: cuki (401) dibuang → deline maker/brat no-key. Upgrade when butuh tema vermeil spesifik.
    const url = `https://api.deline.web.id/maker/brat?text=${encodeURIComponent(text)}`
    await conn.sendImageAsSticker(m.chat, url, m, { packname: global.stickpack || 'Elaina-MD', author: global.stickauth || 'OmniDevv' })
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handlerBratVermeil.help = ['bratvermeil <teks>']
handlerBratVermeil.tags = ['sticker']
handlerBratVermeil.command = /^(bratvermeil|bratv|bratnime)$/i
export { handlerBratVermeil }

// ─── Line Sticker Pack ───────────────────────────────────────
// ponytail: neoxr linesticker dibuang, gaada pengganti no-key stabil. Handler dihapus; tambah lagi kalau nemu sumber hidup.

// ─── Sticker Watermark (SWM) ─────────────────────────────────
import { addExifToWebp } from '../../src/lib/exif.js'

let handlerSWM = async (m, { conn, text }) => {
    if (!m.quoted) throw `🖼️ *sᴛɪᴄᴋᴇʀ ᴡᴀᴛᴇʀᴍᴀʀᴋ*\n\n> Reply sticker dengan:\n> \`${m.prefix}swm packname\`\n> \`${m.prefix}swm packname|author\``
    const isSticker = m.quoted.type === 'stickerMessage' || m.quoted.isSticker
    if (!isSticker) throw '❌ Reply pesan sticker!'
    if (!text) throw '❌ Masukkan packname!'
    const [packname, author = ''] = text.split('|').map(s => s.trim())
    conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
    const buffer = await m.quoted.download()
    const riff = buffer.slice(0, 4).toString('ascii')
    const webpSig = buffer.length >= 12 ? buffer.slice(8, 12).toString('ascii') : ''
    if (riff === 'RIFF' && webpSig === 'WEBP') {
        const result = await addExifToWebp(buffer, { packname, author, emojis: ['🤖'] })
        await conn.sendMessage(m.chat, { sticker: result }, { quoted: m })
    } else {
        await conn.sendImageAsSticker(m.chat, buffer, m, { packname, author })
    }
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handlerSWM.help = ['swm packname|author']
handlerSWM.tags = ['sticker']
handlerSWM.command = /^(swm|stickerwm|stickermark|colong)$/i
export { handlerSWM }

export default handlerBratVermeil
