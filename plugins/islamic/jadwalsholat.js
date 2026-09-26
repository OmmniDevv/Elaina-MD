// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Jadwal Sholat — via aladhan.com method=20 Kemenag RI (no API key, dites 2026-09-26: hidup)
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🕌 *Jadwal Sholat*\n\n> Contoh: \`${usedPrefix}${command} Bandung\``
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })

  try {
    const { data } = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(text.trim())}&country=Indonesia&method=20`, { timeout: 20000 })
    if (data.code !== 200 || !data.data?.timings) throw 'Kota tidak ditemukan'

    const t = data.data.timings
    const d = data.data.date
    const hijri = d.hijri ? `${d.hijri.day} ${d.hijri.month.en} ${d.hijri.year} H` : ''

    const caption = [
      `🕌 *JADWAL SHOLAT — ${text.trim()}*`,
      `📅 ${d.readable}${hijri ? ' • ' + hijri : ''}`,
      ``,
      `🌅 Imsak   : ${t.Imsak}`,
      `🌄 Subuh   : ${t.Fajr}`,
      `☀️  Dzuhur  : ${t.Dhuhr}`,
      `🌤️  Ashar   : ${t.Asr}`,
      `🌇 Maghrib : ${t.Maghrib}`,
      `🌙 Isya    : ${t.Isha}`,
      ``,
      `> ✨ jangan lupa sholat ya senpai~`
    ].join('\n')

    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    m.reply(caption)
  } catch (e) {
    throw `😿 Gomen senpai... jadwal sholat untuk "${text.trim()}" tidak ditemukan. Coba nama kota lain ya~ (${e.message || e})`
  }
}
handler.help = ['salat <kota>', 'jadwalsholat <kota>']
handler.tags = ['islamic']
handler.command = /^(jadwal)?s(a|o|ha|ho)lat$/i

export default handler