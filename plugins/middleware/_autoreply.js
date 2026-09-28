/**
 * Auto Reply System — Elaina-MD
 * Referensi: OURIN autoreply.js
 * https://github.com/OmmniDevv/Elaina-MD
 */

// Middleware: cek autoreply setiap pesan
let handler = m => m
handler.all = async function (m) {
  if (!m.text || m.isBaileys) return
  if (!global.db?.data?.chats) return
  const chat = global.db.data.chats[m.chat] || {}
  const replies = chat.autoReplies || {}
  if (!Object.keys(replies).length) return

  for (const [trigger, response] of Object.entries(replies)) {
    const regex = new RegExp(trigger, 'i')
    if (regex.test(m.text)) {
      await this.sendMessage(m.chat, { text: response }, { quoted: m })
      break
    }
  }
}
export default handler
