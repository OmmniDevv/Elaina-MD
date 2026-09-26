// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import axios from 'axios'

// ─── Chord / Kunci Gitar ─────────────────────────────────────
// ponytail: neoxr chord dibuang. Gaada API no-key hidup (chordindonesia mati, mychords perlu scraper HTML). Handler dihapus; tambah lagi kalau nemu sumber hidup atau bikin scraper sendiri.

// ─── Apple Music Search ──────────────────────────────────────
let handlerAppleMusic = async (m, { conn, text }) => {
    if (!text) throw `🍎 *ᴀᴘᴘʟᴇ ᴍᴜsɪᴄ*\n\n> Contoh: \`${m.prefix}applemusic Best Friend\``
    conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
    const res = await axios.get(`https://api.nexray.web.id/search/applemusic?q=${encodeURIComponent(text)}`, { timeout: 20000 }).catch(() => null)
    if (!res?.data?.result?.length) throw `❌ Tidak ditemukan hasil untuk: ${text}`
    const tracks = res.data.result.slice(0, 5)
    let txt = `🍎 *ᴀᴘᴘʟᴇ ᴍᴜsɪᴄ sᴇᴀʀᴄʜ*\n\n> Query: *${text}*\n\n`
    tracks.forEach((t, i) => {
        txt += `*${i + 1}.* \`\`\`${t.title}\`\`\`\n   ├ 📀 \`${t.subtitle || 'Unknown'}\`\n   └ 🔗 \`${t.link}\`\n\n`
    })
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    await m.reply(txt.trim())
}
handlerAppleMusic.help = ['applemusic <query>']
handlerAppleMusic.tags = ['search']
handlerAppleMusic.command = /^(applemusic|amusic)$/i
export { handlerAppleMusic }

// ─── Pixiv Search ────────────────────────────────────────────
// ponytail: neoxr pixiv-search dibuang. public-api.pixiv.net butuh auth token sketch/danbooru blocked dari box ini. Handler dihapus; tambah lagi kalau nemu sumber hidup.

// ─── TikTok Search ───────────────────────────────────────────
import { tiktokSearchVideo } from '../../lib/scraper/tiktoksearch.js'

let handlerTTSearch = async (m, { conn, text }) => {
    if (!text) throw `🎵 *ᴛɪᴋᴛᴏᴋ sᴇᴀʀᴄʜ*\n\n> Contoh: \`${m.prefix}ttsearch anime\``
    conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
    const videos = await tiktokSearchVideo(text).catch(() => null)
    if (!videos?.length) throw `❌ Tidak ditemukan video untuk: ${text}`
    let txt = `🎵 *ᴛɪᴋᴛᴏᴋ sᴇᴀʀᴄʜ*\n\n> Query: *${text}*\n\n`
    videos.slice(0, 5).forEach((v, i) => {
        txt += `*${i + 1}.* ${v.title || '-'}\n   👤 ${v.author?.nickname || '-'}\n   👀 ${v.stats?.plays || 0} views\n   🔗 ${v.link}\n\n`
    })
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    await m.reply(txt.trim())
}
handlerTTSearch.help = ['ttsearch <query>']
handlerTTSearch.tags = ['search']
handlerTTSearch.command = /^(ttsearch|tiktoksearch|searchtiktok)$/i
export { handlerTTSearch }

export default handlerAppleMusic
