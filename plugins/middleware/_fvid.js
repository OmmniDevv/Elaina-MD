// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
let handler  = async (m, { conn, usedPrefix: _p }) => {
const anu = {
	 key: { 
          fromMe: false,
	      participant: `0@s.whatsapp.net`, ...(m.chat ? 
	 { remoteJid: "17608914335-1613049930@g.us" } : {}) 
                },
	 message: { 
                 "videoMessage": { 
                 "title":"Haii Kak",
                 "h": `Hmm`,
                 'seconds': '182', 
                 'caption': 'Nothing ^^',
                 'jpegThumbnail': (() => { try { return fs.readFileSync('./thumbnail.jpg') } catch { return Buffer.alloc(0) } })()
                        }
                       }
	                  }
conn.sendMessage(m.chat, { text: wm }, { quoted: anu })
}



handler.help = ['vid']

handler.tags = ['owner']

handler.command = /^vid$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true

export default handler
