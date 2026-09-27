// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!m.quoted) throw 'Reply stiker yang ingin di-(un)lock!'
    if (!m.quoted.fileSha256) throw 'SHA256 Hash Missing'
    let sticker = global.db.data.sticker = global.db.data.sticker || {}
    let hash = Buffer.from(m.quoted.fileSha256).toString('base64')
    if (!(hash in sticker)) throw 'Hash stiker tidak ditemukan di database'
    sticker[hash].locked = !/^un/i.test(command)
    await global.db.write().catch(() => {})
    m.reply(`✅ Berhasil ${/^un/i.test(command) ? 'membuka kunci' : 'mengunci'} stiker command!`)
} 
handler.help = ['un', ''].map(v => v + 'lockcmd')
handler.tags = ['owner']
handler.command = /^(un)?lockcmd$/i
handler.premium = true

export default handler
