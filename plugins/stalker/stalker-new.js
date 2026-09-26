// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import axios from 'axios'

// ─── Discord Stalk ────────────────────────────────────────────
// ponytail: neoxr dcstalk dibuang. Discord tak punya API publik no-key (butuh bot token). Handler dihapus; tambah lagi kalau nemu sumber hidup.

// ─── Pinterest Stalk ──────────────────────────────────────────
let handlerPinterestStalk = async (m, { conn, args }) => {
    const username = args?.[0]?.trim()
    if (!username) throw `📌 *ᴘɪɴᴛᴇʀᴇsᴛ sᴛᴀʟᴋ*\n\n> Masukkan username Pinterest\n\n\`Contoh: ${m.prefix}pintereststalk shiroko\``
    conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
    const res = await axios.get(`https://api.baguss.xyz/api/stalker/pinterest?username=${encodeURIComponent(username)}`, { timeout: 30000 }).catch(() => null)
    if (!res?.data?.status || !res?.data?.user) throw `❌ Username *${username}* tidak ditemukan`
    const u = res.data.user, s = u.stats
    const caption = `📌 *ᴘɪɴᴛᴇʀᴇsᴛ sᴛᴀʟᴋ*\n\n` +
        `👤 *Username:* ${u.username}\n📛 *Nama:* ${u.full_name}\n\n` +
        `📍 *Pins:* ${s.pins}\n👥 *Followers:* ${s.followers}\n` +
        `👤 *Following:* ${s.following}\n📋 *Boards:* ${s.boards}\n\n` +
        `📝 *Bio:*\n${u.bio || '-'}\n\n🔗 ${u.profile_url}`
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    const pic = u.image?.original || u.image?.large
    if (pic) await conn.sendMessage(m.chat, { image: { url: pic }, caption }, { quoted: m })
    else await m.reply(caption)
}
handlerPinterestStalk.help = ['pintereststalk <username>']
handlerPinterestStalk.tags = ['stalker']
handlerPinterestStalk.command = /^(pintereststalk|pinstalk|stalkpin)$/i
export { handlerPinterestStalk }

// ─── Roblox Player Search ─────────────────────────────────────
let handlerRoblox = async (m, { conn, text }) => {
    if (!text) throw `🎮 *ʀᴏʙʟᴏx sᴇᴀʀᴄʜ*\n\n\`${m.prefix}robloxplayer linkmon\``
    conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
    // ponytail: neoxr roblox-search dibuang → users.roblox.com public search (no-key). Upgrade when butuh badge/avatar detail.
    let data
    try {
        const r = await axios.get(`https://users.roblox.com/v1/users/search?q=${encodeURIComponent(text)}&limit=10`, {
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
