/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from 'axios'

/* =========================
   SCRAPE (TIDAK DIUBAH LOGIC)
========================= */
class Mobinime {
  constructor() {
    this.inst = axios.create({
      baseURL: 'https://air.vunime.my.id/mobinime',
      headers: {
        'accept-encoding': 'gzip',
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        host: 'air.vunime.my.id',
        'user-agent': 'Dart/3.3 (dart:io)',
        'x-api-key': 'ThWmZq4t7w!z%C*F-JaNdRgUkXn2r5u8'
      }
    })
  }

  homepage = async () => {
    const { data } = await this.inst.get('/pages/homepage')
    return data
  }

  animeList = async (type, { page = '0', count = '15', genre = '' } = {}) => {
    const types = {
      series: '1',
      movie: '3',
      ova: '2',
      'live-action': '4'
    }

    if (!types[type]) throw 'Tipe anime tidak valid'

    const genres = await this.genreList()
    const gnr = genres.find(
      g => g.title.toLowerCase().replace(/\s+/g, '-') === genre.toLowerCase()
    )?.id

    if (!gnr) throw 'Genre tidak ditemukan'

    const { data } = await this.inst.post('/anime/list', {
      perpage: count,
      startpage: page,
      userid: '',
      sort: '',
      genre: gnr,
      jenisanime: types[type]
    })

    return data
  }

  genreList = async () => {
    const { data } = await this.inst.get('/anime/genre')
    return data
  }

  search = async (query, { page = '0', count = '25' } = {}) => {
    if (!query) throw 'Query kosong'

    const { data } = await this.inst.post('/anime/search', {
      perpage: count,
      startpage: page,
      q: query
    })

    return data
  }

  detail = async (id) => {
    if (isNaN(id)) throw 'ID tidak valid'

    const { data } = await this.inst.post('/anime/detail', {
      id: id.toString()
    })

    return data
  }

  stream = async (id, epsid, { quality = 'HD' } = {}) => {
    if (!id || !epsid) throw 'ID anime & episode wajib'

    const { data: srv } = await this.inst.post('/anime/get-server-list', {
      id: epsid.toString(),
      animeId: id.toString(),
      jenisAnime: '1',
      userId: ''
    })

    const { data } = await this.inst.post('/anime/get-url-video', {
      url: srv.serverurl,
      quality,
      position: '0'
    })

    if (!data?.url) throw 'Link stream tidak ditemukan'
    return data.url
  }
}

/* =========================
   HANDLER
========================= */
const mob = new Mobinime()

const pluginConfig = {
  name: "mobinime",
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
  energi: 1,
  isEnabled: true,
};

async function handler(m, { text, prefix, command }) {
    const usedPrefix = prefix || m.prefix || ".";
  try {
    if (!text)
      return m.reply(
`🎌 *MOBINIME*
Gunakan:
${usedPrefix + command} search <judul>
${usedPrefix + command} detail <id>

Contoh:
${usedPrefix + command} search naruto`
      )

    const [sub, ...rest] = text.split(' ')
    const q = rest.join(' ')

    // 🔎 SEARCH
    if (sub === 'search') {
      if (!q) return m.reply('Masukkan judul anime')

      const res = await mob.search(q)
      if (!res?.data?.length) return m.reply('Anime tidak ditemukan')

      let out = `🔎 *Hasil Pencarian*\n\n`
      res.data.slice(0, 10).forEach((v, i) => {
        out += `${i + 1}. *${v.title}*\n`
        out += `   ID: ${v.id}\n`
        out += `   Episode: ${v.total_eps}\n\n`
      })

      return m.reply(out.trim())
    }

    // 📄 DETAIL
    if (sub === 'detail') {
      if (!q || isNaN(q)) return m.reply('Masukkan ID anime')

      const d = await mob.detail(q)

      let out = `🎬 *${d.title}*\n\n`
      out += `⭐ Rating : ${d.rating}\n`
      out += `📺 Episode : ${d.total_eps}\n`
      out += `📅 Rilis : ${d.release}\n`
      out += `🏷 Genre : ${d.genre?.join(', ') || '-'}\n\n`
      out += `📝 Sinopsis:\n${d.sinopsis || '-'}`

      return m.reply(out)
    }

    m.reply('Sub-command tidak dikenali')
  } catch (e) {
    console.error(e)
    m.reply('❌ Terjadi error saat mengambil data anime')
  }
}

export { pluginConfig as config, handler };
