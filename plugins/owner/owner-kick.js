// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import { areJidsSameUser } from '@rexxhayanasi/elaina-baileys'
let handler = async (m, { conn, participants }) => {
    let rawUsers = m.mentionedJid && m.mentionedJid.length ? m.mentionedJid : (m.quoted ? [m.quoted.sender] : [])
    let users = rawUsers.filter(u => !areJidsSameUser(u, conn.user.id))
    if (!users.length) throw 'Tag atau reply pesan user yang ingin di-kick!'
    let kickedUser = []
    for (let user of users) {
        const participantInfo = participants.find(v => areJidsSameUser(v.id, user))
        if (participantInfo && !participantInfo.admin) {
            const res = await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
            if (res) kickedUser.push(user)
            await delay(1000)
        }
    }
    if (kickedUser.length) {
        m.reply(`✅ Berhasil kick ${kickedUser.map(v => '@' + v.split('@')[0]).join(', ')}`, null, { mentions: kickedUser })
    } else {
        m.reply(`❌ Tidak dapat mengeluarkan target (target mungkin admin grup atau bot bukan admin).`)
    }
}
handler.help = ['kick', '-'].map(v => 'o' + v + ' @user')
handler.tags = ['owner']
handler.command = /^(okick|o-)$/i

handler.owner = true
handler.group = true
handler.botAdmin = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
