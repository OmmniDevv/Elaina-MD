// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Wallpaper search — via delirius wallcraft (no API key, dites 2026-09-26: hidup)
import axios from 'axios'

const DELIRIUS = () => (global.APIs?.delirius || 'https://api.delirius.online').replace(/\/$/, '')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🌸 *Senpai~* mau wallpaper apa?\n\n> Contoh: \`${usedPrefix}${command} anime\``
  conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

  const { data } = await axios.get(`${DELIRIUS()}/search/wallcraft?query=${encodeURIComponent(text)}`, { timeout: 20000 }).catch(() => ({ data: null }))
  const arr = Array.isArray(data?.data) ? data.data.map(v => v.download).filter(u => /^https?:/.test(u)) : []
  if (!arr.length) throw '😿 Gomen senpai... wallpaper-nya tidak ditemukan. Coba kata kunci lain ya~'

  const url = arr[Math.floor(Math.random() * arr.length)]
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  await conn.sendFile(m.chat, url, 'wallpaper.jpg', `🖼️ *Wallpaper: ${text}*\n\n> ✨ untuk senpai~`, m)
}
handler.help = ['', '2'].map(v => 'wallpaper' + v + ' <query>')
handler.tags = ['downloader']
handler.command = /^(wallpaper2?)$/i

export default handler
