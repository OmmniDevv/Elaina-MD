// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false
    else who = m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat

    if (!who) throw `Siapa yang mau di-unban? Tag, reply pesan, atau masukkan nomornya!\n\nContoh:\n*${usedPrefix + command} @${m.sender.split('@')[0]}*`

    let user = global.db.data.users[who]
    if (user) user.banned = false
    await global.db.write().catch(() => {})
    m.reply(`✅ Berhasil unban user *${conn.getName(who)}* (@${who.split('@')[0]})!`, null, { mentions: [who] })
}
handler.help = ['unban']
handler.tags = ['owner']
handler.command = /^unban(user)?$/i
handler.rowner = true

export default handler
