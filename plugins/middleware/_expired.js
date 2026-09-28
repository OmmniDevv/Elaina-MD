// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
export async function all(m) {
    if (!m.isGroup)
        return
    if (!global.db?.data?.chats) return
    let chats = global.db.data.chats[m.chat]
    if (!chats || !chats.expired)
        return !0
    if (+new Date() > chats.expired) {
        await this.reply(m.chat, 'Bye🖐 bot akan left!!')
        await this.groupLeave(m.chat)
        chats.expired = null
    }
}