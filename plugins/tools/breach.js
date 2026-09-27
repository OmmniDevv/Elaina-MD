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

async function checkDataBreach(email) {
  try {
    const url = 'https://periksadata.com/'
    const formData = new URLSearchParams()
    formData.append('email', email)

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    const $ = cheerio.load(response.data)
    const info = $('.text-center.col-md-6.col-lg-5 > div > h2').text()

    if (info === 'WAH SELAMAT!') {
      return []
    }

    const breaches = []
    $('div.col-md-6').each((i, element) => {
      try {
        const img = $(element).find('div > div > img').attr('src')
        const title = $(element).find('div.feature__body > h5').text().trim()
        const boldElements = $(element).find('div.feature__body > p > b')

        if (boldElements.length >= 3) {
          const date = $(boldElements[0]).text().trim()
          const breachedData = $(boldElements[1]).text().trim()
          const totalBreach = $(boldElements[2]).text().trim()

          breaches.push({
            img,
            title,
            date,
            breached_data: breachedData,
            total_breach: totalBreach
          })
        }
      } catch (error) {
        console.error('Error parsing breach data:', error)
      }
    })

    return breaches
  } catch (error) {
    console.error('Error checking data breach:', error.message)
    throw error
  }
}

const pluginConfig = {
  name: "breach",
  alias: [],
  category: "tools",
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

async function handler(m, { sock, args, command }) {
    const conn = sock;
  if (!args[0] || !args[0].includes('@')) {
    return m.reply(`Masukkan email yang valid!\nContoh: .${command} email@domain.com`)
  }

  try {
    m.reply('🔍 Sedang memeriksa data breach...')

    const result = await checkDataBreach(args[0])

    if (result.length === 0) {
      return m.reply(`✅ Email *${args[0]}* tidak ditemukan dalam database kebocoran.`)
    }

    let txt = `⚠️ Email *${args[0]}* ditemukan dalam ${result.length} kebocoran:\n\n`
    for (let i = 0; i < result.length; i++) {
      const item = result[i]
      txt += `*${i + 1}. ${item.title}*\n📅 Tanggal : ${item.date}\n🗂️ Data    : ${item.breached_data}\n📊 Jumlah  : ${item.total_breach}\n\n`
    }

    await conn.reply(m.chat, txt, m)

  } catch (e) {
    console.error(e)
    m.reply('❌ Terjadi error saat memeriksa data breach.')
  }
}

export { pluginConfig as config, handler };
