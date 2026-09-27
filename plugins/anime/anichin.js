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

class Anichin {
  constructor(domain = "https://anichin.cafe") {
    this.is = axios.create({
      baseURL: domain,
      headers: {
        'user-agent': 'Mozilla/5.0 (Linux; Android 13)'
      }
    })
  }

  async latest() {
    const { data } = await this.is.get('/')
    const $ = cheerio.load(data)
    return this.articleParser($, '.bixbox:eq(1) article .bsx')
  }

  async popular() {
    const { data } = await this.is.get('/')
    const $ = cheerio.load(data)
    return this.articleParser($, '.bixbox:eq(0) article .bsx')
  }

  async ongoing() {
    const { data } = await this.is.get('/')
    const $ = cheerio.load(data)
    return $(".ongoingseries li a").map((_, li) => ({
      name: $(li).find(".l").text(),
      episode: $(li).find(".r").text(),
      url: $(li).attr("href"),
    })).get()
  }

  async complete(page = 1) {
    const { data } = await this.is.get('/complete/page/' + page)
    const $ = cheerio.load(data)
    return this.articleParser($, '.listupd article .bsx')
  }

  async schedule() {
    const { data } = await this.is.get('/schedule')
    const $ = cheerio.load(data)
    return $('.listupd .bs .bsx').map((_, el) => ({
      title: $(el).find('.tt').text(),
      time: $(el).find('.cndwn').text(),
      url: $(el).find('a').attr('href'),
    })).get()
  }

  async search(query) {
    const { data } = await this.is.get('/', { params: { s: query } })
    const $ = cheerio.load(data)
    return this.articleParser($, '.bixbox article .bsx')
  }

  async detail(url) {
    const { data } = await this.is.get(url)
    const $ = cheerio.load(data)
    return {
      title: $('.entry-title').text(),
      synopsis: $('.synp .entry-content').text().trim(),
      cover: $('.thumb img').attr('src'),
      genres: $('.genxed a').map((_, e) => $(e).text()).get(),
      episode: $('.eplister li a').map((_, e) => ({
        episode: $(e).find('.epl-num').text(),
        date: $(e).find('.epl-date').text(),
        url: $(e).attr('href')
      })).get()
    }
  }

  async episode(url) {
    const { data } = await this.is.get(url)
    const $ = cheerio.load(data)
    return {
      title: $('div.headlist .det a').text(),
      download: $('.soraurlx').map((_, e) => ({
        quality: $(e).find('strong').text(),
        links: $(e).find('a').map((_, x) => ({
          service: $(x).text(),
          url: $(x).attr('href')
        })).get()
      })).get()
    }
  }

  articleParser($, selector) {
    return $(selector).map((_, el) => ({
      title: $(el).find('.tt h2').text().trim(),
      episode: $(el).find('.epx').text(),
      url: $(el).find('a').attr('href'),
      cover: $(el).find('img').attr('src')
    })).get()
  }
}

const api = new Anichin()

const pluginConfig = {
  name: "anichin",
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

async function handler(m, { sock, text, args, prefix, command }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
  if (!args[0]) {
    return m.reply(`📺 *Anichin Menu*

${usedPrefix + command} latest
${usedPrefix + command} popular
${usedPrefix + command} ongoing
${usedPrefix + command} complete 1
${usedPrefix + command} schedule
${usedPrefix + command} search naruto
${usedPrefix + command} detail url
${usedPrefix + command} episode url`)
  }

  let type = args[0].toLowerCase()
  let result, msg = ''

  try {

    if (type === 'latest') {
      result = await api.latest()
    }

    else if (type === 'popular') {
      result = await api.popular()
    }

    else if (type === 'ongoing') {
      result = await api.ongoing()
    }

    else if (type === 'complete') {
      result = await api.complete(args[1] || 1)
    }

    else if (type === 'schedule') {
      result = await api.schedule()
    }

    else if (type === 'search') {
      if (!args[1]) return m.reply('Masukkan judul!')
      result = await api.search(args.slice(1).join(' '))
    }

    else if (type === 'detail') {
      if (!args[1]) return m.reply('Masukkan URL!')
      const data = await api.detail(args[1])
      return conn.sendFile(m.chat, data.cover, 'cover.jpg',
        `🎬 *${data.title}*\n\n${data.synopsis}\n\nGenre: ${data.genres.join(', ')}`,
        m)
    }

    else if (type === 'episode') {
      if (!args[1]) return m.reply('Masukkan URL!')
      const data = await api.episode(args[1])
      msg = `🎬 ${data.title}\n\n`
      data.download.forEach(q => {
        msg += `📥 ${q.quality}\n`
        q.links.forEach(l => msg += `• ${l.service}\n${l.url}\n`)
        msg += '\n'
      })
      return m.reply(msg)
    }

    else return m.reply('Menu tidak dikenal')

    msg = result.map((v, i) =>
      `*${i + 1}.* ${v.title || v.name}\n${v.episode || ''}\n${v.url}`
    ).join('\n\n')

    m.reply(msg)

  } catch (e) {
    m.reply('Error: ' + e.message)
  }
}

handler.register = true

export { pluginConfig as config, handler };
