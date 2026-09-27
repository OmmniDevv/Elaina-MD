// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix: _p, args, command }) => {
	let fdoc = {
  key : {
  remoteJid: 'status@broadcast',
  participant : '0@s.whatsapp.net'
  },
  message: {
  documentMessage: {
  title: '𝙳 𝙰 𝚃 𝙰 𝙱 𝙰 𝚂 𝙴', 
  jpegThumbnail: (() => { try { return fs.readFileSync('./thumbnail.jpg') } catch { return Buffer.alloc(0) } })(),
                            }
                          }
                        }
	let d = new Date()
    let date = d.toLocaleDateString('id', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    if (!fs.existsSync('./database.json')) throw 'File database.json tidak ditemukan!'
    let dbBuffer = fs.readFileSync('./database.json')

    await conn.sendMessage(m.chat, {
        document: dbBuffer,
        mimetype: 'application/json',
        fileName: `database_${Date.now()}.json`,
        caption: `*🗓️ Backup Database:* ${date}`
    }, { quoted: m })

    let ownerTarget = (global.nomorown || '6285869074622').replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    if (m.chat !== ownerTarget) {
        await conn.sendMessage(ownerTarget, {
            document: dbBuffer,
            mimetype: 'application/json',
            fileName: `database_${Date.now()}.json`,
            caption: `*🗓️ Backup Database:* ${date}`
        }).catch(() => {})
    }
}
 
 handler.help = ['backup']
handler.tags = ['owner']
handler.command = /^(backup)$/i
handler.rowner = true

export default handler