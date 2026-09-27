// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m, { conn, usedPrefix, text, command }) => {
    let hash = text
    if (m.quoted && m.quoted.fileSha256) hash = Buffer.from(m.quoted.fileSha256).toString('base64')
    if (!hash) throw `Balas stiker atau masukkan hash stiker yang ingin dihapus!`
    let sticker = global.db.data.sticker = global.db.data.sticker || {}
    if (!sticker[hash]) throw 'Hash stiker tidak ditemukan di database!'
    if (sticker[hash].locked) throw 'Kamu tidak memiliki izin untuk menghapus perintah stiker ini (terkunci)!'
    delete sticker[hash]
    await global.db.write().catch(() => {})
    m.reply(`✅ Berhasil menghapus perintah dari stiker!`)
}


handler.help = ['cmd'].map(v => 'del' + v + ' <teks>')
handler.tags = ['owner']
handler.command = ['delcmd']
handler.premium = true

export default handler
