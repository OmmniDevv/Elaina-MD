// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
 let handler  = async (m, { conn, usedPrefix: _p }) => {
 const anu = {
	key : {
                          participant : '0@s.whatsapp.net'
                        },
       message: {
                    orderMessage: {
                            itemCount : 404,
                            itemCoun : 404,
                            surface : 404,
                            message: '𝙰 𝚛 𝚊 - 𝙰 𝚛 𝚊',
                            orderTitle: 'B',
                            thumbnail: (() => { try { return fs.readFileSync('./thumbnail.jpg') } catch { return Buffer.alloc(0) } })(), 
                            sellerJid: '0@s.whatsapp.net'
          
                          }
                        }
                      }
conn.sendMessage(m.chat,{text:wm}, {quoted: anu})
}


handler.help = ['troli']

handler.tags = ['owner']

handler.command = /^troli$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true

export default handler
