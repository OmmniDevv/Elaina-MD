// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m, { conn, text, usedPrefix, command }) => {
    global.db.data.sticker = global.db.data.sticker || {}
    if (!m.quoted) throw `Balas stiker dengan perintah *${usedPrefix + command}*`
    if (!m.quoted.fileSha256) throw 'SHA256 Hash Missing'
    if (!text) throw `Penggunaan:\n${usedPrefix + command} <teks>\n\nContoh:\n${usedPrefix + command} tes`
    let sticker = global.db.data.sticker
    let hash = Buffer.from(m.quoted.fileSha256).toString('base64')
    if (sticker[hash] && sticker[hash].locked) throw 'Kamu tidak memiliki izin untuk mengubah perintah stiker ini'
    sticker[hash] = {
        text,
        mentionedJid: m.mentionedJid,
        creator: m.sender,
        at: Date.now(),
        locked: false,
    }
    await global.db.write().catch(() => {})
    m.reply(`✅ Berhasil mengaitkan teks/perintah ke stiker!`)
}


handler.help = ['cmd'].map(v => 'set' + v + ' <teks>')
handler.tags = ['owner']
handler.command = ['setcmd']
handler.premium = true

export default handler
