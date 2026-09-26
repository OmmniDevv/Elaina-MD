// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// MLBB Stalk — jerexd API (free key, tested 2026-09-26)
// Butuh User ID + Zone ID yang valid
import fetch from 'node-fetch'

const JEREXD = 'https://api.jerexd.my.id'
const APIKEY = 'DS6BiowttbswsryD'

let handler = async (m, { conn, text, usedPrefix }) => {
    const input = (text || '').trim()
    const parts = input.split(/[\s|/]+/).filter(Boolean)

    if (parts.length < 2) {
        return m.reply(`🎮 *MLBB USER STALKER*\n\nFormat: ${usedPrefix}mlstalk <UserID> <ZoneID>\nContoh: ${usedPrefix}mlstalk 12345678 2324`)
    }

    const userId = parts[0].replace(/[^0-9]/g, '')
    const zoneId = parts[1].replace(/[^0-9]/g, '')

    if (!userId || !zoneId) return m.reply('❌ User ID dan Zone ID harus angka!')

    conn.sendMessage(m.chat, { react: { text: '🎮', key: m.key } })
    try {
        const res = await fetch(`${JEREXD}/api/mlbb/stalk?apikey=${APIKEY}&id=${userId}&zone=${zoneId}`, { timeout: 20000 })
        const json = await res.json()

        if (!json.status || !json.result) throw json.error || 'Akun MLBB tidak ditemukan'

        const r = json.result
        let txt = `╭━━━〔 🎮 *MLBB USER PROFILE* 〕━━━\n`
        txt += `┃ 👤 *Nickname:* ${r.nickname || '-'}\n`
        txt += `┃ 🆔 *User ID:* ${r.id || userId}\n`
        txt += `┃ 🌐 *Zone:* ${r.zone || zoneId}\n`
        txt += `┃ 🗺️ *Region:* ${r.region || 'Indonesia'}\n`
        txt += `┃ 💎 *Status:* ${r.account_status || 'Aktif'}\n`
        txt += `╰━━━━━━━━━━━━━━━━━━━━━━━`

        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await m.reply(txt)
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ Gagal stalk MLBB: ${e.message}`
    }
}

handler.help = ['mlstalk <id> <zone>']
handler.tags = ['stalker']
handler.command = /^(mlstalk|mlbbstalk|stalkml|ceknickml)$/i

export default handler
