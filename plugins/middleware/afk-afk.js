// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
import fetch from 'node-fetch'
let handler = async (m, { text }) => {
let name = m.pushName || conn.getName(m.sender)

let user = global.db.data.users[m.sender]

let thumb = global.thumbBuffer
user.afk = + new Date
user.afkReason = text
 conn.sendButtonDoc(m.chat, `${conn.getName(m.sender)} is now AFK${text ? ': ' + text : ''}`, wm, 'ᴊᴀɴɢᴀɴ ᴅɪɢᴀɴɢɢᴜ ʏᴀ ᴋᴀᴋ', 'Bilek', m)
            }
handler.help = ['afk [alasan]']
handler.tags = ['main']
handler.command = /^afk$/i

export default handler
