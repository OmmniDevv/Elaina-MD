// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Google image search — via delirius pinterest + wallcraft (no API key, dites 2026-09-26)
import axios from 'axios'

const DELIRIUS = () => (global.APIs?.delirius || 'https://api.delirius.online').replace(/\/$/, '')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🌸 *Senpai~* mau cari gambar apa?\n\n> Contoh: \`${usedPrefix}${command} kucing lucu\``
  conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

  let urls = []

  // 1) pinterest image search
  try {
    const { data } = await axios.get(`${DELIRIUS()}/search/pinterest?text=${encodeURIComponent(text)}`, { timeout: 20000 })
    if (data?.status && Array.isArray(data.results)) urls = data.results.filter(u => /^https?:/.test(u))
  } catch {}

  // 2) fallback wallcraft
  if (!urls.length) {
    try {
      const { data } = await axios.get(`${DELIRIUS()}/search/wallcraft?query=${encodeURIComponent(text)}`, { timeout: 20000 })
      if (data?.status && Array.isArray(data.data)) urls = data.data.map(v => v.download).filter(u => /^https?:/.test(u))
    } catch {}
  }

  if (!urls.length) throw '😿 Gomen senpai... gambarnya tidak ditemukan. Coba kata kunci lain ya~'
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  await conn.sendFile(m.chat, urls[Math.floor(Math.random() * urls.length)], 'gimage.jpg', `🖼️ *Hasil pencarian: ${text}*\n\n> ✨ untuk senpai~`, m)
}
handler.help = ['gimage <query>', 'image <query>']
handler.tags = ['internet']
handler.command = /^(gimage|image)$/i

export default handler
