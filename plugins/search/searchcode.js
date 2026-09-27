/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


/*
Search Code 
Desk : Search code dari https://codeshare.cloudku.click
Type : Plugin ESM 
Source Scrape : https://whatsapp.com/channel/0029Vb6D8o67YSd1UzflqU1d/502
*/
import axios from 'axios'
import * as cheerio from 'cheerio'

async function scrapeCodeSearch(query) {
  const url = `https://codeshare.cloudku.click/?q=${encodeURIComponent(query)}`
  const res = await axios.get(url)
  const $ = cheerio.load(res.data)
  const results = []

  const cards = $('.snippet-card').toArray()

  for (const el of cards) {
    const card = $(el)
    const title = card.find('.card-title a').text().trim()
    const path = card.find('.card-title a').attr('href')
    const link = 'https://codeshare.cloudku.click' + path
    const author = card.find('.card-user .user-info').text().trim()
    const views = parseInt(card.find('.meta-item').first().text().replace(/\D/g, '')) || 0
    const languageIcon = card.find('.meta-item i').attr('class') || ''
    const language = languageIcon.split('-').pop().replace('plain', '') || 'unknown'

    results.push({ title, author, views, language, link })
  }

  return {
    status: 200,
    total: results.length,
    data: results
  }
}

const pluginConfig = {
  name: "searchcode",
  alias: [],
  category: "search",
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

async function handler(m, { text, prefix, command }) {
    const usedPrefix = prefix || m.prefix || ".";
  if (!text) throw `Contoh:\n${usedPrefix + command} downloader tiktok `

  let res = await scrapeCodeSearch(text)
  if (!res.data.length) throw 'Tidak ada hasil ditemukan.'

  let teks = res.data.slice(0, 5).map((v, i) => {
    return `*${i + 1}. ${v.title}*\n👤 ${v.author}\n💻 ${v.language}\n👁 ${v.views} views\n🔗 ${v.link}`
  }).join`\n\n`

  await m.reply(`🔍 Hasil pencarian untuk: *${text}*\n\n${teks}`)
}

export { pluginConfig as config, handler };
