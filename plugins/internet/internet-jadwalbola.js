/**
 * Elaina-MD — github.com/OmmniDevv/Elaina-MD
 * Jangan Dijual!
 */
import axios from 'axios'

let handler = async (m, { conn }) => {
  // ponytail: neoxr bola dibuang → thesportsdb public demo key 3 (no-key). Upgrade when butuh liga spesifik.
  const today = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10)
  const res = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${today}&s=Soccer`, {
    timeout: 15000, headers: { 'user-agent': 'Mozilla/5.0' }
  }).catch(() => null)
  const data = res?.data?.events
  if (!data?.length) throw '❌ Gagal mengambil jadwal bola'
  let txt = `⚽ *JADWAL BOLA* (${today})\n\n`
  data.slice(0, 8).forEach(d => {
    txt += `🏟️ *${d.strLeague || '-'}*\n`
    txt += `⏰ Waktu: ${d.strTimeLocal || d.strTime || '-'} WIB\n`
    txt += `🏠 ${d.strHomeTeam || '-'} vs ${d.strAwayTeam || '-'}\n\n`
  })
  m.reply(txt.trim())
}
handler.help = ['jadwalbola']
handler.tags = ['internet']
handler.command = /^jadwalbola$/i
export default handler
