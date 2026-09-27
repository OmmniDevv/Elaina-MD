// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Al-Quran — via alquran.cloud (no API key, dites 2026-09-26: hidup)
import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // format: .alquran 2:255  atau  .alquran 2 255
  let surah, ayah
  const raw = args.join(' ')
  if (/^\d+:\d+$/.test(raw)) {
    [surah, ayah] = raw.split(':')
  } else if (/^\d+$/.test(raw)) {
    // nomor ayah global → cari via API
    surah = null
    ayah = raw
  } else if (args.length >= 2 && /^\d+$/.test(args[0]) && /^\d+$/.test(args[1])) {
    surah = args[0]
    ayah = args[1]
  } else {
    throw `📖 *Al-Quran*\n\n> Contoh: \`${usedPrefix}${command} 2:255\` (surat 2 ayat 255)\n> atau: \`${usedPrefix}${command} 2 255\``
  }

  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })

  try {
    const ref = surah ? `${surah}:${ayah}` : ayah
    const { data } = await axios.get(`https://api.alquran.cloud/v1/ayah/${ref}/editions/quran-uthmani,id.indonesian`, { timeout: 20000 })
    if (data.code !== 200 || !Array.isArray(data.data)) throw 'Data tidak ditemukan'

    const [arab, indo] = data.data
    const s = arab.surah || {}
    const globalNumber = arab.number

    const caption = `📖 *QS. ${s.name || s.englishName || '?'} (${s.englishName || '?'}) — Ayat ${arab.numberInSurah ?? ayah}*\n\n${arab.text}\n\n🇮🇩 *Artinya:*\n${indo.text}\n\n> ✨ untuk senpai~`

    // kirim audio murottal (Alafasy) kalau tersedia
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNumber}.mp3`
    try {
      await conn.sendMessage(m.chat, {
        audio: { url: audioUrl }, mimetype: 'audio/mpeg', ptt: false,
        fileName: `quran_${s.number || surah || 'ayah'}_${arab.numberInSurah || ayah}.mp3`,
        contextInfo: { mentionedJid: [] }
      }, { quoted: m })
      await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
    } catch {
      await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
    }
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    throw `😿 Gomen senpai... ayatnya tidak ditemukan. Pastikan formatnya benar ya~ (${e.message || e})`
  }
}

handler.command = ['alquran']
handler.help = ['alquran <surat>:<ayat>', 'alquran <surat> <ayat>']
handler.tags = ['islamic']

export default handler