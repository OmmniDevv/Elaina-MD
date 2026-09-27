// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
let handler = async (m, { conn, text }) => {
    m.reply('Tunggu sebentar, sedang mengambil file database...')
    if (!fs.existsSync('./database.json')) throw 'File database.json tidak ditemukan!'
    let sesi = fs.readFileSync('./database.json')
    return await conn.sendMessage(m.chat, { document: sesi, mimetype: 'application/json', fileName: 'database.json' }, { quoted: m })
}
handler.help = ['getdb']
handler.tags = ['owner']
handler.command = /^(getdb)$/i

handler.rowner = true

export default handler