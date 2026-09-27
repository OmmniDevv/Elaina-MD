// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m) => {
    global.db.data.chats = global.db.data.chats || {}
    global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
    global.db.data.chats[m.chat].isBanned = true
    await global.db.write().catch(() => {})
    m.reply('✅ Chat berhasil di-ban! Bot tidak akan merespon perintah di chat ini kecuali unbanchat.')
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^(banchat|bnc)$/i

handler.owner = true

export default handler