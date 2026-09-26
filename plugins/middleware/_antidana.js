// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Anti DANA Scam — port dari SxcWAMdV3
// Deteksi & hapus pesan DANA bagi-bagi saldo scam
let handler = async (m, { args, isAdmin, isOwner }) => {
  if (!m.isGroup) return m.reply('Fitur ini hanya dapat digunakan dalam grup.')
  if (!(isAdmin || isOwner)) return m.reply('Maaf, fitur ini hanya dapat digunakan oleh admin grup.')

  global.db.data.chats = global.db.data.chats || {}
  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}

  if (!args[0]) {
    return m.reply('Gunakan:\n.antidana on / off')
  }

  if (args[0] === 'on') {
    if (global.db.data.chats[m.chat].antidana) {
      return m.reply('Antidana sudah aktif.')
    }
    global.db.data.chats[m.chat].antidana = true
    return m.reply('✅ Antidana berhasil diaktifkan.')
  }

  if (args[0] === 'off') {
    if (!global.db.data.chats[m.chat].antidana) {
      return m.reply('Antidana sudah nonaktif.')
    }
    global.db.data.chats[m.chat].antidana = false
    return m.reply('❌ Antidana berhasil dinonaktifkan.')
  }

  return m.reply('Opsi tidak valid.\nGunakan:\n.antidana on / off')
}

handler.before = async (m, { conn, isBotAdmin, usedPrefix }) => {
  if (!m.isGroup) return
  if (!isBotAdmin) return

  if (typeof m.text === 'string') {
    const txt = m.text.toLowerCase()
    if (txt.startsWith((usedPrefix || '.') + 'antidana')) return
  }

  global.db.data.chats = global.db.data.chats || {}
  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}

  if (!global.db.data.chats[m.chat].antidana) return

  let text = m.text || ''

  let isScam =
    text.includes('*DANA bagi-bagi saldo') &&
    text.includes('Aku baru saja dapat') &&
    text.includes('Klik di sini') &&
    /(http|https):\/\/[^\s]+/i.test(text)

  if (!isScam) return

  // Hapus pesan
  await conn.sendMessage(m.chat, { delete: m.key }).catch(() => {})

  // Kirim peringatan
  await conn.sendMessage(m.chat, {
    text: `⚠️ *Terdeteksi DANA scam!*

@${m.sender.split('@')[0]} mengirim link DANA scam. Pesan telah dihapus.`,
    mentions: [m.sender]
  }).catch(() => {})
}

handler.help = ['antidana on/off']
handler.tags = ['group']
handler.command = /^(antidana)$/i

export default handler
