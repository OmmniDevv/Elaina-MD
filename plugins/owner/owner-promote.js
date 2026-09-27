// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import { areJidsSameUser } from '@rexxhayanasi/elaina-baileys'
let handler = async (m, { conn, participants }) => {
    let rawUsers = m.mentionedJid && m.mentionedJid.length ? m.mentionedJid : (m.quoted ? [m.quoted.sender] : [])
    let users = rawUsers.filter(u => !areJidsSameUser(u, conn.user.id))
    if (!users.length) throw 'Tag atau reply pesan user yang ingin di-promote!'
    let promoteUser = []
    for (let user of users) {
        const participantInfo = participants.find(v => areJidsSameUser(v.id, user))
        if (participantInfo && !participantInfo.admin) {
            const res = await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
            if (res) promoteUser.push(user)
            await delay(1000)
        }
    }
    if (promoteUser.length) {
        m.reply(`✅ Berhasil promote ${promoteUser.map(v => '@' + v.split('@')[0]).join(', ')}`, null, { mentions: promoteUser })
    } else {
        m.reply(`❌ Tidak dapat mempromosikan target (mungkin sudah menjadi admin atau bot bukan admin).`)
    }
}
handler.help = ['opromote @tag']
handler.tags = ['owner']
handler.command = /^(opromote)$/i

handler.owner = true
handler.group = true
handler.botAdmin = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))