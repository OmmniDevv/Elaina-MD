// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
import fetch from 'node-fetch'
let handler = async (m, { conn, text }) => {
if (!global.db?.data?.users) throw 'Database belum siap.'
let user = global.db.data.users[m.sender]
if (!user) return
user.afk = +new Date
user.afkReason = text || ''
 conn.sendButtonDoc(m.chat, `${conn.getName(m.sender)} is now AFK${text ? ': ' + text : ''}`, global.wm, 'ᴊᴀɴɢᴀɴ ᴅɪᴀɴɢᴜ ʏ ᴋᴀᴋ', 'Bilek', m)
}
handler.help = ['afk [alasan]']
handler.tags = ['main']
handler.command = /^afk$/i

export default handler
