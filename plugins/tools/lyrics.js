// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Lirik lagu — via delirius lyrics (no API key, dites 2026-09-26: hidup)
import axios from 'axios'

const DELIRIUS = () => (global.APIs?.delirius || 'https://api.delirius.online').replace(/\/$/, '')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🎶 *Senpai~* mau cari lirik lagu apa?\n\n> Contoh: \`${usedPrefix}${command} Night Changes\``
  conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

  const { data } = await axios.get(`${DELIRIUS()}/search/lyrics?query=${encodeURIComponent(text)}`, { timeout: 20000 }).catch(() => ({ data: null }))
  const d = data?.data
  if (!data?.status || !d?.lyrics) throw '😿 Gomen senpai... liriknya tidak ditemukan. Coba judul lain ya~'

  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  m.reply(`🎶 *${d.title || text}*\n> ${d.artists || ''}${d.album ? ' — ' + d.album : ''}${d.duration ? ' • ' + d.duration : ''}\n\n${d.lyrics}`)
}
handler.help = ['lirik'].map(v => v + ' <judul lagu>')
handler.tags = ['internet']
handler.command = /^(lirik|lyrics|lyric)$/i

export default handler
