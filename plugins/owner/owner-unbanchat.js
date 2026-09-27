// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m) => {
    global.db.data.chats = global.db.data.chats || {}
    global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
    global.db.data.chats[m.chat].isBanned = false
    await global.db.write().catch(() => {})
    m.reply('✅ Chat berhasil di-unban! Bot sekarang dapat merespon kembali di chat ini.')
}
handler.help = ['unbanchat']
handler.tags = ['owner']
handler.command = /^(unbanchat|ubnc)$/i
handler.owner = true

export default handler