// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// NSFW Delirius — port dari pain-bot waifu-nsfw.js + tambahan endpoint
// API: https://api.delirius.online (gratis, no key, tested 2026-09-26)
// Endpoints: /nsfw/girls, /nsfw/boobs, /nsfw/corean, /nsfw/tiktok

import fetch from 'node-fetch'

const DELIRIUS_BASE = 'https://api.delirius.online'

const NSFW_MAP = {
    'waifu18': '/nsfw/girls',
    'neko18': '/nsfw/girls',
    'boobs': '/nsfw/boobs',
    'corean': '/nsfw/corean',
    'tik18': '/nsfw/tiktok',
}

let handler = async (m, { conn, command }) => {
    // Cek cmd18 toggle
    if (m.isGroup) {
        const chat = global.db.data.chats[m.chat]
        if (!chat?.cmd18) {
            return m.reply('🔞 Perintah +18 belum diaktifkan di grup ini.\nAdmin bisa aktifkan dengan: .cmd18 on')
        }
    }

    const endpoint = NSFW_MAP[command.toLowerCase()] || '/nsfw/girls'

    conn.sendMessage(m.chat, { react: { text: '🔞', key: m.key } })

    try {
        const res = await fetch(`${DELIRIUS_BASE}${endpoint}`, {
            headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'image/*,application/json' }
        })

        if (!res.ok) throw `HTTP ${res.status}`

        const ct = res.headers.get('content-type') || ''
        let imageBuffer

        if (ct.includes('image/')) {
            imageBuffer = Buffer.from(await res.arrayBuffer())
        } else {
            const data = await res.json()
            const url = data?.data?.url || data?.data?.image || data?.url || data?.image
            if (!url) throw 'No image URL in response'
            const imgRes = await fetch(url)
            if (!imgRes.ok) throw 'Failed to fetch image'
            imageBuffer = Buffer.from(await imgRes.arrayBuffer())
        }

        if (!imageBuffer?.length) throw 'Empty image'

        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await conn.sendMessage(m.chat, { image: imageBuffer }, { quoted: m })
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ Gagal ambil gambar: ${e.message}`
    }
}

handler.help = ['waifu18', 'neko18', 'boobs', 'corean', 'tik18']
handler.tags = ['nsfw']
handler.command = /^(waifu18|neko18|boobs|corean|tik18)$/i
handler.premium = false
handler.nsfw = true

export default handler
