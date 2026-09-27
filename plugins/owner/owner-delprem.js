// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m, { conn, usedPrefix, command, text }) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false
    else who = m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat

    if (!who) return m.reply(`Tag atau mention seseorang!\n\nContoh:\n*${usedPrefix + command} @${m.sender.split('@')[0]}*`)

    let user = global.db.data.users[who]
    if (!user) return m.reply(`User tidak ditemukan di database!`)

    user.premium = false
    user.premiumTime = 0
    await global.db.write().catch(() => {})
    m.reply(`✅ Berhasil menghapus status premium dari *${user.name || conn.getName(who)}*!`)
}
handler.help = ['delprem [@user]']
handler.tags = ['owner']
handler.command = /^(-|del)p(rem)?$/i

handler.group = true
handler.rowner = true

export default handler