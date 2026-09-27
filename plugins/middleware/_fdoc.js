// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
let handler  = async (m, { conn, usedPrefix: _p }) => {
const anu = {
	key : {
           participant : '0@s.whatsapp.net'
                        },
       message: {
                    "documentMessage": {
                    "title": 'elaina.jpeg', 
                    "jpegThumbnail": (() => { try { return fs.readFileSync('./thumbnail.jpg') } catch { return Buffer.alloc(0) } })()
                          }
                        }
                      }
conn.sendMessage(m.chat,{ text: wm}, { quoted: anu })
}



handler.help = ['doc']

handler.tags = ['owner']

handler.command = /^doc$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true

export default handler