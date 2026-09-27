// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
let handler = async (m, { conn, text }) => {
    m.reply('Tunggu Sebentar, Sedang mengambil file sesi mu')
    let sesi = await fs.readFileSync('./session.data.json')
    return await conn.sendMessage(m.chat, { document: { url: sesi }, mimetype: 'application/json', fileName: 'session.data.json' }, { quoted: m })
}
handler.help = ['getsessi']
handler.tags = ['owner']
handler.command = /^(g(et)?ses?si(on)?(data.json)?)$/i

handler.rowner = true

export default handler
