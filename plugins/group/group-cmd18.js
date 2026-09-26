// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// CMD18 Toggle — port dari pain-bot cmd18-toggle.js
// Admin bisa on/off NSFW per grup

let handler = async (m, { conn, args, usedPrefix, command, isAdmin }) => {
    if (!m.isGroup) return m.reply('❌ Hanya bisa di grup!')
    if (!isAdmin) return m.reply('❌ Hanya admin!')

    if (!global.db.data.chats[m.chat].cmd18) {
        global.db.data.chats[m.chat].cmd18 = false
    }

    const action = (args[0] || '').toLowerCase()

    if (action === 'on') {
        global.db.data.chats[m.chat].cmd18 = true
        return m.reply(`🔞 *Perintah +18 DIAKTIFKAN*\n\nPerintah NSFW sudah bisa dipakai di grup ini.`)
    } else if (action === 'off') {
        global.db.data.chats[m.chat].cmd18 = false
        return m.reply(`🔞 *Perintah +18 DINONAKTIFKAN*\n\nPerintah NSFW tidak bisa dipakai di grup ini.`)
    } else {
        const status = global.db.data.chats[m.chat].cmd18 ? '✅ AKTIF' : '❌ NONAKTIF'
        return m.reply(`🔞 *CMD18 Status:* ${status}\n\nGunakan: ${usedPrefix + command} on/off`)
    }
}

handler.help = ['cmd18 on/off']
handler.tags = ['group']
handler.command = /^(cmd18|nsfwtoggle)$/i
handler.group = true
handler.admin = true

export default handler
