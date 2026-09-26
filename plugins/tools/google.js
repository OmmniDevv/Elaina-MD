// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Google-style search — via DuckDuckGo Instant Answer (no API key, pola pain-bot, dites 2026-09-26: hidup)
import axios from 'axios'

async function translateToId(text) {
  try {
    const { data } = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=id&dt=t&q=${encodeURIComponent(text)}`, { timeout: 10000 })
    return data?.[0]?.map(x => x[0]).join('') || text
  } catch {
    return text
  }
}

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) throw `🔍 *Pencarian*\n\n> Contoh: \`${usedPrefix}${command} apa itu fotosintesis\``
  conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

  try {
    const { data } = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(text)}&format=json&no_html=1&skip_disambig=1`, { timeout: 15000 })

    if (!data.AbstractText && !(data.RelatedTopics || []).length && !data.Answer && !data.Definition) {
      throw 'tidak ada hasil'
    }

    let txt = `🔍 *Hasil pencarian: ${text}*\n\n`

    if (data.Answer) {
      txt += `💡 *Jawaban langsung:*\n${data.Answer}\n\n`
    }

    if (data.AbstractText) {
      const abstrak = await translateToId(data.AbstractText)
      txt += `📄 *Informasi:*\n${abstrak}\n`
      if (data.AbstractSource) txt += `📌 Sumber: ${data.AbstractSource}\n`
      if (data.AbstractURL) txt += `🔗 ${data.AbstractURL}\n`
      txt += '\n'
    } else if (data.Definition) {
      txt += `📖 *Definisi:*\n${data.Definition}\n\n`
    }

    if (data.Heading && !data.AbstractText) txt = `🔍 *${data.Heading}*\n\n` + txt

    const topics = (data.RelatedTopics || []).filter(t => t.Text && t.FirstURL).slice(0, 5)
    if (topics.length) {
      txt += `🔎 *Topik terkait:*\n` + topics.map((t, i) => `${i + 1}. ${t.Text}\n   🔗 ${t.FirstURL}`).join('\n\n')
    }

    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    m.reply(txt.trim())
  } catch (e) {
    if (/tidak ada hasil/.test(e.message || '')) {
      throw `😿 Gomen senpai... tidak ada hasil untuk "${text}". Coba kata kunci lain ya~`
    }
    throw `😿 Gomen senpai... pencariannya gagal. Coba lagi nanti~ (${e.message || e})`
  }
}

handler.help = ['google <pencarian>', 'googlef <pencarian>']
handler.tags = ['internet']
handler.command = /^googlef?$/i
export default handler