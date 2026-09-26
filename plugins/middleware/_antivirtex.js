// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Anti Virtex — port dari SxcWAMdV3
// Deteksi & hapus teks berbahaya (virtex/virus text)
let handler = async (m, { args, isAdmin, isOwner }) => {
  if (!m.isGroup) return m.reply('Fitur ini hanya dapat digunakan dalam grup.')
  if (!(isAdmin || isOwner)) return m.reply('Maaf, fitur ini hanya dapat digunakan oleh admin grup.')

  global.db.data.chats = global.db.data.chats || {}
  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}

  if (!args[0]) {
    return m.reply('Gunakan:\n.antivirtex on / off')
  }

  if (args[0] === 'on') {
    if (global.db.data.chats[m.chat].antivirtex) {
      return m.reply('Antivirtex sudah aktif.')
    }
    global.db.data.chats[m.chat].antivirtex = true
    return m.reply('✅ Antivirtex berhasil diaktifkan.')
  }

  if (args[0] === 'off') {
    if (!global.db.data.chats[m.chat].antivirtex) {
      return m.reply('Antivirtex sudah nonaktif.')
    }
    global.db.data.chats[m.chat].antivirtex = false
    return m.reply('❌ Antivirtex berhasil dinonaktifkan.')
  }

  return m.reply('Opsi tidak valid.\nGunakan:\n.antivirtex on / off')
}

handler.before = async (m, { conn, isBotAdmin }) => {
  if (!m.isGroup) return
  if (!isBotAdmin) return

  global.db.data.chats = global.db.data.chats || {}
  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}

  if (!global.db.data.chats[m.chat].antivirtex) return

  let text = m.text || ''

  // Deteksi virtex: teks terlalu panjang atau banyak karakter unicode aneh
  const isVirtex = text.length > 5000 ||
    (text.match(/[\u{10000}-\u{10FFFF}]/gu) || []).length > 10 ||
    (text.match(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g) || []).length > 5

  if (!isVirtex) return

  // Hapus pesan
  await conn.sendMessage(m.chat, { delete: m.key }).catch(() => {})

  // Kirim peringatan
  await conn.sendMessage(m.chat, {
    text: `⚠️ *Terdeteksi virtex!*

@${m.sender.split('@')[0]} mengirim teks berbahaya. Pesan telah dihapus.`,
    mentions: [m.sender]
  }).catch(() => {})
}

handler.help = ['antivirtex on/off']
handler.tags = ['group']
handler.command = /^(antivirtex)$/i

export default handler
