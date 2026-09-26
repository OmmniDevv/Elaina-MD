// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Anti Phising — port dari SxcWAMdV3
// Deteksi & kick pengirim link phishing (bank/dana/ovo/gopay/shopee domain mencurigakan)
let handler = async (m, { args, isAdmin, isOwner }) => {
  if (!m.isGroup) return m.reply('Fitur ini hanya dapat digunakan dalam grup.')
  if (!(isAdmin || isOwner)) return m.reply('Maaf, fitur ini hanya dapat digunakan oleh admin grup.')

  global.db.data.chats = global.db.data.chats || {}
  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}

  if (!args[0]) {
    return m.reply('Gunakan:\n.antiphising on / off')
  }

  if (args[0] === 'on') {
    if (global.db.data.chats[m.chat].antiphising) {
      return m.reply('Antiphising sudah aktif.')
    }
    global.db.data.chats[m.chat].antiphising = true
    return m.reply('✅ Antiphising berhasil diaktifkan.')
  }

  if (args[0] === 'off') {
    if (!global.db.data.chats[m.chat].antiphising) {
      return m.reply('Antiphising sudah nonaktif.')
    }
    global.db.data.chats[m.chat].antiphising = false
    return m.reply('❌ Antiphising berhasil dinonaktifkan.')
  }

  return m.reply('Opsi tidak valid.\nGunakan:\n.antiphising on / off')
}

handler.before = async (m, { conn, isBotAdmin, usedPrefix }) => {
  if (!m.isGroup) return
  if (!isBotAdmin) return

  if (typeof m.text === 'string') {
    const txt = m.text.toLowerCase()
    if (txt.startsWith((usedPrefix || '.') + 'antiphising')) return
  }

  global.db.data.chats = global.db.data.chats || {}
  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}

  if (!global.db.data.chats[m.chat].antiphising) return

  let text = m.text || ''

  const phisingPatterns = [
    /https?:\/\/[^\s]*bank[^\s]*\.(xyz|top|buzz|icu|click|link|vip|win)/i,
    /https?:\/\/[^\s]*dana[^\s]*\.(xyz|top|buzz|icu|click|link|vip|win)/i,
    /https?:\/\/[^\s]*ovo[^\s]*\.(xyz|top|buzz|icu|click|link|vip|win)/i,
    /https?:\/\/[^\s]*gopay[^\s]*\.(xyz|top|buzz|icu|click|link|vip|win)/i,
    /https?:\/\/[^\s]*shopee[^\s]*\.(xyz|top|buzz|icu|click|link|vip|win)/i,
    /https?:\/\/[^\s]*gratis[^\s]*\.(xyz|top|buzz|icu|click|link|vip|win)/i,
    /https?:\/\/[^\s]*free[^\s]*\.(xyz|top|buzz|icu|click|link|vip|win)/i,
  ]

  let isPhising = phisingPatterns.some(p => p.test(text))

  if (!isPhising) return

  // Hapus pesan
  await conn.sendMessage(m.chat, { delete: m.key }).catch(() => {})

  // Kick
  await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove').catch(() => {})

  // Kirim peringatan
  await conn.sendMessage(m.chat, {
    text: `⚠️ *Terdeteksi link phishing!*

@${m.sender.split('@')[0]} telah dikeluarkan dari grup.`,
    mentions: [m.sender]
  }).catch(() => {})
}

handler.help = ['antiphising on/off']
handler.tags = ['group']
handler.command = /^(antiphising)$/i

export default handler
