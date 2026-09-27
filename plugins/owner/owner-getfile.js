import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, isROwner, usedPrefix, command, text }) => {
    if (!text) throw `Masukkan path file yang ingin dibaca!\n\nContoh:\n*${usedPrefix + command} main.js*`
    let targetPath = path.resolve(process.cwd(), text.trim())
    if (!fs.existsSync(targetPath)) throw `File "${text}" tidak ditemukan!`
    let stat = fs.statSync(targetPath)
    if (stat.isDirectory()) throw `"${text}" adalah direktori, bukan file!`
    if (stat.size > 500000) {
        return await conn.sendMessage(m.chat, {
            document: fs.readFileSync(targetPath),
            mimetype: 'text/plain',
            fileName: path.basename(targetPath)
        }, { quoted: m })
    }
    let content = fs.readFileSync(targetPath, 'utf-8')
    m.reply(content)
}

handler.help = ['getfile'].map(v => v + ' <text>')
handler.tags = ['owner']
handler.command = /^(getfile|gf)$/i

handler.rowner = true

export default handler