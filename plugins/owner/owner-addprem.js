// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false
    else who = m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat

    if (!who) throw `Tag atau mention seseorang!\n\nContoh:\n*${usedPrefix + command} @${m.sender.split('@')[0]} 7*`

    let user = global.db.data.users[who]
    if (!user) {
        global.db.data.users[who] = {
            name: conn.getName(who),
            premium: false,
            premiumTime: 0
        }
        user = global.db.data.users[who]
    }

    let txt = text.replace('@' + who.split('@')[0], '').trim()
    if (!txt) throw `Masukkan jumlah hari!\n\nContoh:\n*${usedPrefix + command} @${m.sender.split('@')[0]} 7*`
    if (isNaN(txt)) return m.reply(`Hanya angka!\n\nContoh:\n*${usedPrefix + command} @${m.sender.split('@')[0]} 7*`)

    let jumlahHari = 86400000 * parseInt(txt)
    let now = Date.now()
    if (now < user.premiumTime) user.premiumTime += jumlahHari
    else user.premiumTime = now + jumlahHari
    user.premium = true

    await global.db.write().catch(() => {})
    m.reply(`✅ *BERHASIL MENAMBAH PREMIUM!*\n\n📛 *Name:* ${user.name || conn.getName(who)}\n📆 *Durasi:* ${txt} hari\n⏳ *Sisa Waktu:* ${Math.ceil((user.premiumTime - now) / 86400000)} hari lagi`)
}
handler.help = ['addprem [@user] <days>']
handler.tags = ['owner']
handler.command = /^(add|tambah|\+)p(rem)?$/i

handler.group = true
handler.rowner = true

export default handler