// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import { areJidsSameUser } from '@rexxhayanasi/elaina-baileys'
let handler = async (m, { conn, participants }) => {
    let user = (m.mentionedJid && m.mentionedJid[0]) || (m.quoted ? m.quoted.sender : false)
    if (!user) throw 'Tag atau reply pesan user yang ingin di-demote!'
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
    m.reply(`✅ Berhasil demote @${user.split('@')[0]}`, null, { mentions: [user] })
}
handler.help = ['odemote @tag']
handler.tags = ['owner']
handler.command = /^(odemote)$/i

handler.owner = true
handler.group = true
handler.botAdmin = true

export default handler