// © Elaina-MD — https://github.com/OmmniDevv/Elaina-MD
// AI chat: Gemini (gratis, no API key). Cuma ini satu-satunya AI chat.
import gemini from '../../lib/scraper/gemini.js'

const sessions = global.aiSessions || (global.aiSessions = new Map())

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🌸 *Senpai~* mau ngobrol apa dengan Elaina?\n\n> Contoh: \`${usedPrefix}${command} hai, apa kabar?\``
  const key = m.sender
  let session = sessions.get(key) || null
  await conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })
  try {
    const res = await gemini({ message: text, sessionId: session })
    if (!res?.text) throw '😿 Gomen senpai... Elaina tidak bisa menjawab sekarang. Coba lagi nanti~'
    if (res.sessionId) sessions.set(key, res.sessionId)
    m.reply(`🌸 *Elaina*\n\n${res.text}`)
  } catch (e) {
    sessions.delete(key)
    m.reply('😿 Maaf senpai... terjadi kesalahan. Sesi AI sudah direset, coba lagi ya~\n\n> ' + (e?.message || e + '').slice(0, 200))
  }
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handler.help = ['ai <pertanyaan>', 'gemini <pertanyaan>', 'chatbot <pertanyaan>']
handler.tags = ['ai']
handler.command = /^(ai|gemini|chatbot|elaina|tanya)$/i
handler.limit = true
export default handler
