// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import axios from 'axios'
import fs from 'fs'
import path from 'path'

// ─── Fuck My Life / Candaan ──────────────────────────────────
let handlerFml = async (m, { conn }) => {
    conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
    // ponytail: meme-api joke primary, candaan-api Indo fallback. Upgrade when butuh sumber ke-3.
    let txt = null
    try {
      const jk = await axios.get('https://official-joke-api.appspot.com/random_joke', { timeout: 8000 })
      if (jk?.data?.setup && jk?.data?.punchline) txt = `${jk.data.setup}\n\n> ${jk.data.punchline}`
    } catch {}
    if (!txt) {
      const res = await axios.get('https://candaan-api.vercel.app/api/text/random', { timeout: 15000 }).catch(() => null)
      if (!res?.data?.data) throw '❌ Gagal mengambil candaan'
      txt = res.data.data
    }
    await m.reply(`😂 *CANDAAN RECEH*\n\n${txt}`)
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handlerFml.help = ['fuckmylife', 'fml', 'candaan']
handlerFml.tags = ['fun']
handlerFml.command = /^(fuckmylife|fml|candaan)$/i
export { handlerFml }

// ─── Jodoh ───────────────────────────────────────────────────
const loveQuotes = [
    'Cinta sejati tidak pernah mengenal jarak 💕',
    'Dua hati yang bersatu takkan terpisahkan 💗',
    'Kalian seperti puzzle yang sempurna 🧩',
    'Match made in heaven! ✨',
    'Chemistry-nya kuat banget! 🔥',
    'Couple goals banget sih kalian 💑',
    'Perfect match detected! 💘',
]

let handlerJodoh = async (m, { conn }) => {
    if (!m.isGroup) throw '❌ Perintah ini hanya bisa digunakan di grup!'
    const participants = m.groupMetadata?.participants || []
    const botId = conn.user?.jid || conn.user?.id
    const members = participants.map(p => p.jid || p.id).filter(j => j && j !== botId)
    if (members.length < 2) throw '❌ Minimal ada 2 member untuk dijodohkan!'

    const shuffled = [...members].sort(() => Math.random() - 0.5)
    const p1 = shuffled[0], p2 = shuffled[1]
    const compat = Math.floor(Math.random() * 100) + 1
    const bar = '█'.repeat(Math.floor(compat / 10)) + '░'.repeat(10 - Math.floor(compat / 10))
    const status = compat >= 90 ? 'JODOH SEJATI! 💍' : compat >= 70 ? 'Sangat Cocok! 💖' : compat >= 50 ? 'Lumayan Cocok 💗' : compat >= 30 ? 'Bisa Dicoba 💓' : 'Butuh Usaha Lebih 💔'
    const quote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)]

    await conn.sendMessage(m.chat, { react: { text: '💕', key: m.key } })
    await m.reply(
        `💘 *ᴊᴏᴅᴏʜ ʀᴀɴᴅᴏᴍ*\n\n` +
        `╭┈┈⬡「 💑 *ᴘᴀsᴀɴɢᴀɴ* 」\n` +
        `┃ 👤 @${p1.split('@')[0]}\n┃ ❤️\n┃ 👤 @${p2.split('@')[0]}\n` +
        `╰┈┈┈┈┈┈┈┈⬡\n\n` +
        `╭┈┈⬡「 📊 *ᴋᴇᴄᴏᴄᴏᴋᴀɴ* 」\n` +
        `┃ ${bar} *${compat}%*\n┃ Status: *${status}*\n` +
        `╰┈┈┈┈┈┈┈┈⬡\n\n> _"${quote}"_`,
        null, { mentions: [p1, p2] }
    )
}
handlerJodoh.help = ['jodoh']
handlerJodoh.tags = ['fun']
handlerJodoh.command = /^(jodoh|match|shipcouple|ship)$/i
handlerJodoh.group = true
export { handlerJodoh }

// ─── Sulap (kick dramatis) ────────────────────────────────────
if (!global.sulapSessions) global.sulapSessions = new Map()

const sulapLines = [
    '💨 *POOF!* Dan... dia menghilang!',
    '🌟 Sulap berhasil! Sampai jumpa lagi~',
    '✨ Absen dulu ya, ditunggu berikutnya!',
    '🎪 Pertunjukan selesai! 👏'
]

let handlerSulap = async (m, { conn }) => {
    if (!m.isGroup) throw '❌ Hanya bisa di grup!'
    await conn.sendMessage(m.chat, { react: { text: '🎩', key: m.key } })
    const sent = await m.reply(
        `🎩✨ *ᴘᴇʀᴛᴜɴᴊᴜᴋᴀɴ sᴜʟᴀᴘ*\n\nSiapa yang ingin dihilangkan?\n\n> Reply pesan ini + mention orangnya`
    )
    global.sulapSessions.set(sent.key?.id, { admin: m.sender, chat: m.chat, timestamp: Date.now() })
    setTimeout(() => global.sulapSessions.delete(sent.key?.id), 120000)
}
handlerSulap.help = ['sulap']
handlerSulap.tags = ['fun']
handlerSulap.command = /^(sulap|magic|magictrick)$/i
handlerSulap.group = true
handlerSulap.admin = true
handlerSulap.botAdmin = true
export { handlerSulap }

export let sulapAll = async function (m) {
    if (!m.quoted) return
    const quotedId = m.quoted?.id || m.quoted?.key?.id
    if (!quotedId) return
    const session = global.sulapSessions?.get(quotedId)
    if (!session || session.chat !== m.chat || session.admin !== m.sender) return
    const targetJid = m.mentionedJid?.[0]
    if (!targetJid) return this.sendMessage(m.chat, { text: '❌ Mention orangnya dong!' }, { quoted: m })
    global.sulapSessions.delete(quotedId)
    const botNum = this.user?.jid?.split(':')[0] || this.user?.id?.split(':')[0]
    if (targetJid.includes(botNum)) return this.sendMessage(m.chat, { text: '🎭 Bot tidak bisa menghilangkan dirinya sendiri!' })
    if (targetJid === m.sender) return this.sendMessage(m.chat, { text: '🎭 Tidak bisa menghilangkan diri sendiri!' })
    try {
        const groupMeta = m.groupMetadata
        const target = groupMeta.participants.find(p => (p.jid || p.id) === targetJid)
        if (!target) return this.sendMessage(m.chat, { text: '👻 Orang itu tidak ada di grup!' })
        if (['admin', 'superadmin'].includes(target.admin)) return this.sendMessage(m.chat, { text: '🛡️ Admin kebal terhadap sihir!' })
        await this.sendMessage(m.chat, { text: `🪄 *Bersiaplah @${targetJid.split('@')[0]}...* ✨`, mentions: [targetJid] })
        await new Promise(r => setTimeout(r, 2000))
        await this.groupParticipantsUpdate(m.chat, [targetJid], 'remove')
        const line = sulapLines[Math.floor(Math.random() * sulapLines.length)]
        await this.sendMessage(m.chat, {
            text: `${line}\n\n🎯 @${targetJid.split('@')[0]} telah menghilang!\n🎩 Pesulap: @${m.sender.split('@')[0]}\n\n> _Pertunjukan selesai~_ ✨`,
            mentions: [targetJid, m.sender]
        })
    } catch (e) {
        this.sendMessage(m.chat, { text: `😅 Sulapnya gagal...\n\n> ${e.message}` })
    }
}

// ─── NGL Spam ────────────────────────────────────────────────
let handlerNglSpam = async (m, { conn, text }) => {
    if (!text || !text.includes('|')) throw (
        `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n> \`${m.prefix}nglspam <username>|<pesan>|<jumlah>\`\n\n> Contoh: \`${m.prefix}nglspam Zann|Haii|33\``
    )
    const [username, pesan, jumlah] = text.split('|')
    if (!username || !pesan || !jumlah) throw '❌ Format salah! Gunakan: nglspam username|pesan|jumlah'
    conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
    const res = await axios.get(
        `https://api.nexray.web.id/tools/spamngl?url=${encodeURIComponent('https://ngl.link/' + username.trim())}&pesan=${encodeURIComponent(pesan.trim())}&jumlah=${encodeURIComponent(jumlah.trim())}`,
        { timeout: 30000 }
    ).catch(() => null)
    if (!res?.data?.status) throw '❌ Gagal spam NGL'
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    await m.reply('✅ Berhasil spam NGL!')
}
handlerNglSpam.help = ['nglspam username|pesan|jumlah']
handlerNglSpam.tags = ['tools']
handlerNglSpam.command = /^(nglspam|spamngl)$/i
export { handlerNglSpam }

export default handlerFml
