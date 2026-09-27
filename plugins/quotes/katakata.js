/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'

const pluginConfig = {
  name: "katakata",
  alias: ["quotes", "quote", "katamutiara", "randomkata"],
  category: "quotes",
  description: "Mengambil kata-kata / quotes random dari API Xemoz",
  usage: ".katakata",
  cooldown: 3,
  isEnabled: true,
}

async function handler(m, extra) {
  try {
    const targetUrl = `https://api-xemoz-official.my.id/api/random/kata-kata.php`

    const res = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      timeout: 10000
    })

    const data = res?.data

    if (!data) {
      return m.reply("❌ *Gagal mendapatkan respons dari API Xemoz!*")
    }

    if (data.status === false) {
      return m.reply(`❌ *Gagal:* ${data.message || data.error || 'Server Xemoz sedang bermasalah'}`)
    }

    // Ekstrak kata-kata dari berbagai variasi respons JSON Xemoz
    const quoteData = data.result || data.quotes || data.data || data.kata || data

    let caption = `✨ *KATA-KATA RANDOM* ✨\n\n`

    if (typeof quoteData === 'object' && quoteData !== null) {
      const teks = quoteData.kata || quoteData.quote || quoteData.text || quoteData.result || JSON.stringify(quoteData)
      const author = quoteData.author || quoteData.penulis || quoteData.by || "Anonim"

      caption += `_"${teks}"_\n\n`
      caption += `✍️ *Author:* ${author}`
    } else {
      caption += `_"${quoteData}"_`
    }

    return m.reply(caption)

  } catch (error) {
    console.error("[Kata-Kata Error]:", error?.message)
    const errDetail = error?.response?.data?.message || error?.message || "Server Error"
    return m.reply(`❌ *Terjadi Kesalahan:* ${errDetail}`)
  }
}

async function before(m) {
  return true
}

export { pluginConfig as config, handler, before }
