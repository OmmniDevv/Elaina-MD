/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'

const pluginConfig = {
  name: "mcstalk",
  alias: ["minecraftstalk", "stalkmc", "mcprofile"],
  category: "tools",
  description: "Stalk data profil / skin player Minecraft berdasarkan username",
  usage: ".mcstalk <username>",
  cooldown: 5,
  isEnabled: true,
}

// 🔑 API Key DashX
const DASHX_APIKEY = "DHX-5BF50D"

async function handler(m, extra) {
  const fullText = (m.text || m.body || "").trim()

  // Ambil username setelah command
  const username = fullText.replace(/^[\/.!#]?(mcstalk|minecraftstalk|stalkmc|mcprofile)\s*/i, "").trim()

  if (!username) {
    let guide = `🎮 *MINECRAFT STALKER*\n\n`
    guide += `📌 *Cara Pakai:*\n`
    guide += `• \`.mcstalk <username>\`\n\n`
    guide += `💡 *Contoh:* \`.mcstalk Notch\``
    return m.reply(guide)
  }

  try {
    const targetUrl = `https://api.dashx.dpdns.org/api/stalk/minecraft`

    const res = await axios.get(targetUrl, {
      params: {
        text: username,
        key: DASHX_APIKEY
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      timeout: 15000
    })

    const data = res?.data

    if (!data) {
      return m.reply("❌ *Gagal mendapatkan respons dari API DashX!*")
    }

    if (data.success === false || data.status === false) {
      return m.reply(`❌ *Gagal:* ${data.error || data.message || 'Player Minecraft tidak ditemukan atau API Key invalid.'}`)
    }

    const result = data.result || data.data || data

    let caption = `🎮 *MINECRAFT PLAYER PROFILE*\n\n`
    
    if (typeof result === 'object' && result !== null) {
      if (result.username || result.name) caption += `👤 *Username:* ${result.username || result.name}\n`
      if (result.uuid || result.id) caption += `🆔 *UUID:* \`${result.uuid || result.id}\`\n`
      if (result.skinUrl || result.skin) caption += `👕 *Skin URL:* ${result.skinUrl || result.skin}\n`
    } else {
      caption += `\`\`\`${JSON.stringify(result, null, 2)}\`\`\``
    }

    // Cek jika terdapat URL Skin/Avatar/Render player untuk dikirim sebagai gambar
    const skinPic = result.skinUrl || result.avatar || result.render || result.skin || result.image

    const conn = extra?.conn || extra?.client || extra?.sock || m?.conn || this

    if (skinPic && typeof skinPic === 'string' && skinPic.startsWith('http')) {
      return await conn.sendMessage(m.chat, { image: { url: skinPic }, caption }, { quoted: m })
    } else {
      return m.reply(caption)
    }

  } catch (error) {
    console.error("[MC Stalk Error]:", error?.message)
    const errDetail = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Server Error"
    return m.reply(`❌ *Terjadi Kesalahan:* ${errDetail}`)
  }
}

async function before(m) {
  return true
}

export { pluginConfig as config, handler, before }
