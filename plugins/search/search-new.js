// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import axios from 'axios'

// ─── Chord / Kunci Gitar ─────────────────────────────────────
// ponytail: neoxr chord dibuang. Gaada API no-key hidup (chordindonesia mati, mychords perlu scraper HTML). Handler dihapus; tambah lagi kalau nemu sumber hidup atau bikin scraper sendiri.

// ─── Apple Music Search ──────────────────────────────────────
// FIX (2026-09-26): nexray.web.id mati → ganti ke iTunes Search API (gratis, no key, tested ✅)
let handlerAppleMusic = async (m, { conn, text }) => {
    if (!text) throw `🍎 *ᴀᴘᴘʟᴇ ᴍᴜsɪᴄ*\n\n> Contoh: \`${m.prefix}applemusic Best Friend\``
    conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
    try {
        const res = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(text)}&media=music&limit=8`, { timeout: 20000 })
        const tracks = res.data?.results
        if (!tracks?.length) throw `❌ Tidak ditemukan hasil untuk: ${text}`
        let txt = `🍎 *ᴀᴘᴘʟᴇ ᴍᴜsɪᴄ sᴇᴀʀᴄʜ*\n\n> Query: *${text}*\n\n`
        tracks.forEach((t, i) => {
            txt += `*${i + 1}.* \`\`\`${t.trackName}\`\`\`\n   ├ 📀 \`${t.artistName}\`\n   ├ 💿 \`${t.collectionName || 'Single'}\`\n   └ 🔗 \`${t.trackViewUrl}\`\n\n`
        })
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await m.reply(txt.trim())
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ Gagal mencari: ${e.message}`
    }
}
handlerAppleMusic.help = ['applemusic <query>']
handlerAppleMusic.tags = ['search']
handlerAppleMusic.command = /^(applemusic|amusic)$/i
export { handlerAppleMusic }

// ─── Pixiv Search ────────────────────────────────────────────
// ponytail: neoxr pixiv-search dibuang. public-api.pixiv.net butuh auth token sketch/danbooru blocked dari box ini. Handler dihapus; tambah lagi kalau nemu sumber hidup.

// ─── TikTok Search ───────────────────────────────────────────
// MATI (2026-09-26): azbry.com 500, tikwm kena Cloudflare, tobyg74 Search() error.
// Gaada sumber TikTok search gratis no-key yang hidup saat ini.
// Handler dihapus; tambah lagi kalau nemu sumber hidup.
// (lib/scraper/tiktoksearch.js dibiarkan sebagai referensi kalau API azbry hidup lagi)

export default handlerAppleMusic
