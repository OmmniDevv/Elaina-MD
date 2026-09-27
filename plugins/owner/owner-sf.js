// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Masukkan path tujuan file!\n\nPenggunaan:\n*${usedPrefix + command} <path>*\n\nContoh:\n*${usedPrefix + command} plugins/tools/test.js*`
    if (!m.quoted || !m.quoted.text) throw `Balas (reply) pesan teks/kode yang ingin disimpan ke file!`
    let targetPath = `${text}`
    let dir = targetPath.includes('/') ? targetPath.slice(0, targetPath.lastIndexOf('/')) : ''
    if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(targetPath, m.quoted.text)
    m.reply(`✅ Berhasil disimpan di ${targetPath}`)
}
handler.help = ['sf'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^sf$/i

handler.rowner = true
export default handler