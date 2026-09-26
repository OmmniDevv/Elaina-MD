// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Welcome Custom — port dari SxcWAMdV3 welcome.js
// .welcome on/off/set/reset

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!m.isGroup) return m.reply('❌ Hanya bisa di grup!')

    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    let chat = global.db.data.chats[m.chat]

    let query = (text || '').trim()
    let sub = (query.split(/\s+/)[0] || '').toLowerCase()

    if (sub === 'on' || sub === 'enable' || sub === '1') {
        chat.welcome = true
        return m.reply('✅ *Welcome* berhasil DIAKTIFKAN!')
    } else if (sub === 'off' || sub === 'disable' || sub === '0') {
        chat.welcome = false
        return m.reply('❌ *Welcome* berhasil DINONAKTIFKAN!')
    } else if (sub === 'set') {
        let customMsg = query.slice(3).trim() || (m.quoted?.text?.trim() || '')
        if (!customMsg) return m.reply(`⚠️ Masukkan teks welcome!\nContoh: ${usedPrefix}welcome set Selamat datang @user di @subject!`)
        chat.sWelcome = customMsg
        chat.welcome = true
        return m.reply(`✅ *Pesan kustom welcome* berhasil disimpan!\n\n"${customMsg}"`)
    } else if (sub === 'reset' || sub === 'del') {
        chat.sWelcome = ''
        return m.reply('🗑️ Pesan kustom welcome dihapus (kembali ke default).')
    } else {
        let status = chat.welcome ? '✅ AKTIF' : '❌ NONAKTIF'
        let custom = chat.sWelcome ? `\n📝 Teks Kustom:\n"${chat.sWelcome}"` : ''
        return m.reply(
            `👋 *PENGATURAN WELCOME*\n\n` +
            `Status: ${status}${custom}\n\n` +
            `📌 *Penggunaan:*\n` +
            `${usedPrefix}welcome on — Aktifkan\n` +
            `${usedPrefix}welcome off — Nonaktifkan\n` +
            `${usedPrefix}welcome set <teks> — Set teks kustom\n` +
            `${usedPrefix}welcome reset — Hapus teks kustom\n\n` +
            `Variabel: @user, @subject, @desc`
        )
    }
}

handler.help = ['welcome on/off/set/reset']
handler.tags = ['group']
handler.command = /^(welcome|setwelcome)$/i
handler.group = true
handler.admin = true

export default handler
