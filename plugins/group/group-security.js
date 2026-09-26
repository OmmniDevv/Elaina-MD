// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Group Security — port dari SxcWAMdV3 security.js (14 fitur)
// Aktif per-grup via db.data.chats[chat].groupSecurity

const FEATURES = [
    'antilink', 'antilinkwa', 'antitagsw', 'antisw',
    'antikudeta', 'antiforward', 'antibot', 'antidokumen',
    'antifoto', 'antivideo', 'antisticker', 'antivoice',
    'antinsfw', 'antitoxic'
]

const FEATURE_NAMES = {
    antilink: 'Anti Link Semua Website',
    antilinkwa: 'Anti Link Grup/Saluran WA',
    antitagsw: 'Anti Tag/Mention Status WA',
    antisw: 'Anti Kirim/Forward Status WA ke Grup',
    antikudeta: 'Anti Kudeta Admin',
    antiforward: 'Anti Pesan Terusan/Forward',
    antibot: 'Anti Bot Luar',
    antidokumen: 'Anti Kirim Dokumen',
    antifoto: 'Anti Kirim Foto',
    antivideo: 'Anti Kirim Video',
    antisticker: 'Anti Kirim Sticker',
    antivoice: 'Anti Kirim Voice Note',
    antinsfw: 'Anti Gambar Dewasa',
    antitoxic: 'Anti Kata Kasar'
}

let handler = async (m, { conn, text, isAdmin, isBotAdmin, isOwner, usedPrefix, command }) => {
    if (!m.isGroup) return m.reply('❌ Hanya bisa di grup!')
    if (!isAdmin && !isOwner) return m.reply('❌ Hanya admin/owner!')
    if (!isBotAdmin) return m.reply('❌ Bot harus jadi admin dulu!')

    if (!global.db.data.chats[m.chat].groupSecurity) {
        global.db.data.chats[m.chat].groupSecurity = {}
    }
    const sec = global.db.data.chats[m.chat].groupSecurity

    const args = (text || '').toLowerCase().trim().split(/\s+/)
    let fitur = args[0]
    let action = args[1]

    // Kalau tanpa argumen → tampilkan status semua
    if (!fitur) {
        let txt = `🛡️ *GROUP SECURITY*\n\n`
        for (const f of FEATURES) {
            const status = sec[f] ? '✅ ON' : '❌ OFF'
            txt += `${status} — ${FEATURE_NAMES[f]}\n`
        }
        txt += `\n📌 *Cara pakai:*\n${usedPrefix}security <fitur> on/off\n`
        txt += `Contoh: ${usedPrefix}security antifoto on`
        return m.reply(txt)
    }

    // Validasi fitur
    if (!FEATURES.includes(fitur)) {
        let txt = `❌ Fitur tidak dikenal: *${fitur}*\n\nFitur tersedia:\n`
        FEATURES.forEach(f => { txt += `• ${f} — ${FEATURE_NAMES[f]}\n` })
        return m.reply(txt)
    }

    // Toggle
    if (action === 'on' || action === '1' || action === 'enable') {
        sec[fitur] = true
        return m.reply(`✅ *${FEATURE_NAMES[fitur]}* berhasil DIAKTIFKAN!`)
    } else if (action === 'off' || action === '0' || action === 'disable') {
        sec[fitur] = false
        return m.reply(`❌ *${FEATURE_NAMES[fitur]}* berhasil DINONAKTIFKAN!`)
    } else {
        const status = sec[fitur] ? '✅ AKTIF' : '❌ NONAKTIF'
        return m.reply(`🛡️ *${FEATURE_NAMES[fitur]}*\nStatus: ${status}\n\nGunakan: ${usedPrefix}security ${fitur} on/off`)
    }
}

handler.help = ['security <fitur> on/off']
handler.tags = ['group']
handler.command = /^(security|groupsecurity|keamanan)$/i
handler.group = true
handler.admin = true

export default handler
