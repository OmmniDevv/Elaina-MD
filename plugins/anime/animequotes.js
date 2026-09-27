/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from 'axios'
import * as cheerio from 'cheerio'

async function animequote() {
  try {
    const page = Math.floor(Math.random() * 184)
    const { data } = await axios.get('https://otakotaku.com/quote/feed/' + page)
    const $ = cheerio.load(data)

    const kotodamaLinks = $('div.kotodama-list').map((i, el) => {
      return $(el).find('a.kuroi').attr('href')
    }).get()

    const results = await Promise.all(kotodamaLinks.map(async (url) => {
      const { data: quote } = await axios.get(url)
      const $q = cheerio.load(quote)

      return {
        char: $q('.char-info .tebal a[href*="/character/"]').text().trim(),
        from_anime: $q('.char-info a[href*="/anime/"]').text().trim(),
        episode: $q('.char-info span.meta').text().trim().replace('- ', ''),
        quote: $q('.post-content blockquote p').text().trim()
      }
    }))

    return results
  } catch (error) {
    throw new Error(error.message)
  }
}

const pluginConfig = {
  name: "animequotes",
  alias: [],
  category: "anime",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
    const conn = sock;
  try {
    let data = await animequote()
    let res = data[Math.floor(Math.random() * data.length)]

    let txt = `╔═══ ❖ • ✦ • ❖ ═══╗
      🌸 *ANIME QUOTES* 🌸
╚═══ ❖ • ✦ • ❖ ═══╝

👤 *Karakter* : ${res.char || '-'}
🎬 *Anime* : ${res.from_anime || '-'}
📺 *Episode* : ${res.episode || '-'}

💭 ❝ ${res.quote || '-'} ❞`

    await conn.reply(m.chat, txt, m)
  } catch (e) {
    await conn.reply(m.chat, '⚠️ Gagal mengambil quote anime, coba lagi ya~', m)
  }
}

export { pluginConfig as config, handler };
