// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
let handler = async (m, { conn, text }) => {
    m.reply('Tunggu sebentar, sedang mengambil file sesi creds...')
    const authFolder = global.authFile || 'elaina_session'
    const credsPath = `./${authFolder}/creds.json`
    if (!fs.existsSync(credsPath)) throw `File ${credsPath} tidak ditemukan!`
    let sesi = fs.readFileSync(credsPath)
    return await conn.sendMessage(m.chat, { document: sesi, mimetype: 'application/json', fileName: 'creds.json' }, { quoted: m })
}
handler.help = ['getsessi']
handler.tags = ['owner']
handler.command = /^(g(et)?ses?si(on)?(data.json)?)$/i

handler.rowner = true

export default handler
