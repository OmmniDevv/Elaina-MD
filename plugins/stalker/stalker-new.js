// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import axios from 'axios'

// ─── Discord Stalk ────────────────────────────────────────────
// ponytail: neoxr dcstalk dibuang. Discord tak punya API publik no-key (butuh bot token). Handler dihapus; tambah lagi kalau nemu sumber hidup.

// ─── Pinterest Stalk ──────────────────────────────────────────
// MATI (2026-09-26): api.baguss.xyz timeout/DNS fail.
// Tidak ada alternatif gratis no-key untuk Pinterest user stalk.
// TODO: bikin scraper HTML sendiri kalau butuh.

// ─── Roblox Player Search ─────────────────────────────────────
let handlerRoblox = async (m, { conn, text }) => {
    if (!text) throw `🎮 *ʀᴏʙʟᴏx sᴇᴀʀᴄʜ*\n\n\`${m.prefix}robloxplayer linkmon\``
    conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
    // ponytail: neoxr roblox-search dibuang → users.roblox.com public search (no-key). Upgrade when butuh badge/avatar detail.
    let data
    try {
        const searchRes = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(text)}&limit=10`, {
            timeout: 15000, headers: { 'user-agent': 'Mozilla/5.0' }
        })
        data = r.data?.data
    } catch { data = null }
    if (!data?.length) throw `❌ Tidak ditemukan player: ${text}`
    const players = data.slice(0, 10)
    let txt = `🎮 *ʀᴏʙᴏx ᴘᴀʏʀ sᴇᴀʀᴄʜ*\n\n> Query: \`${text}\`\n> Ditemukan: *${players.length}* player\n\n`
    players.forEach((p, i) => {
        txt += `*${i + 1}.* ${p.displayName}\n   🆔 \`${p.id}\` | 👤 \`${p.name}\`${p.hasVerifiedBadge ? ' ✅' : ''}\n\n`
    })
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    await m.reply(txt.trim())
}
handlerRoblox.help = ['robloxplayer <username>']
handlerRoblox.tags = ['stalker']
handlerRoblox.command = /^(robloxplayer|robloxsearch|searchroblox)$/i
export { handlerRoblox }

export default handlerPinterestStalk
