// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
let handler  = async (m, { conn, usedPrefix: _p }) => {
const anu = {
	 key: { 
          fromMe: false,
	      participant: `6285736178354@s.whatsapp.net`, ...(m.chat ? 
	 { remoteJid: "6285736178354-1610340626@g.us" } : {}) 
                },
	 message: { 
		"audioMessage": {
                 "mimetype":"audio/ogg; codecs=opus",
                 "seconds": "${second}",
                 "ptt": "true"
                        }
	                  } 
                     }
conn.sendMessage(m.chat,{ text: wm}, {quoted: anu})
}


handler.help = ['tod']

handler.tags = ['owner']

handler.command = /^tod|fvn$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 3

export default handler
