// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { elainaSay, elainaFooter } from '../../lib/elainaVoice.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.join(__dirname, '../../data/tebakkata.json')

let timeout = 120000
let poin = 4999
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakkata = conn.tebakkata ? conn.tebakkata : {}
    let id = m.chat
    if (id in conn.tebakkata) {
        conn.reply(m.chat, elainaSay('noargs', 'masih ada soal yang belum dijawab di chat ini lho~ selesaikan dulu ya~'), conn.tebakkata[id][0])
        throw false
    }
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    const json = data[Math.floor(Math.random() * data.length)]

    let caption = `*${global.htki} ᴛᴇʙᴀᴋ ᴋᴀᴛᴀ ${global.htka}*

${json.soal}

⏳ Timeout *${(timeout / 1000).toFixed(0)} detik*
💡 Ketik ${usedPrefix}teka buat bantuan
🎁 Bonus: ${poin} XP`

    conn.tebakkata[id] = [
        await conn.sendButton(m.chat, caption, elainaFooter(), null, [['💡 Bantuan', `${usedPrefix}teka`]], m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakkata[id]) conn.sendButton(m.chat, elainaSay('gagal', `waktu habis~ jawabannya adalah *${json.jawaban}*`), elainaFooter(), null, [['🔁 Main Lagi', `${usedPrefix}tebakkata`]], conn.tebakkata[id][0])
            delete conn.tebakkata[id]
        }, timeout)
    ]
}
handler.help = ['tebakkata']
handler.tags = ['game']
handler.command = /^tebakkata/i

export default handler
