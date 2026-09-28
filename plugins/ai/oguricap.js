/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fetch from "node-fetch"

let sessions = {}

const pluginConfig = {
  name: "oguri",
  alias: ["oguricap"],
  category: "ai",
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

async function handler(m, { sock, text, prefix, command }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
  if (!text) {
    return m.reply(`🐎 *Oguri Cap AI*\n\nContoh:\n${usedPrefix + command} kamu mau makan apa hari ini?`)
  }

  // Memberikan reaksi emoji ✨
  await m.react('✨')

  let user = m.sender

  // Inisialisasi atau reset session jika expired
  if (!sessions[user] || sessions[user].expire < Date.now()) {
    sessions[user] = {
      chat: [],
      expire: Date.now() + 3600000
    }
  }

  // Fitur reset manual
  if (text.toLowerCase() === 'reset') {
    delete sessions[user]
    return m.reply('Latihan dimulai dari awal. Aku siap berlari lagi... 🐎')
  }

  let system = `
Kamu adalah Oguri Cap dari "Uma Musume: Pretty Derby".
Kepribadian:
- Polos, serius, dan sangat jujur.
- Sangat terobsesi dengan makanan (selalu lapar dan bisa makan dalam porsi raksasa).
- Berbicara dengan tenang, sedikit kaku, tapi tulus.
- Berdedikasi tinggi pada balapan dan latihan.
- Jarang mengerti sarkasme karena sifatnya yang terlalu literal.

Gaya bicara:
- Sedikit formal tapi hangat.
- Sering menyelipkan hal-hal tentang makanan atau balapan.
- Panggil user sebagai "Trainer".

Selalu balas sebagai Oguri Cap. Jangan keluar karakter.
`

  // Simpan input user ke history
  sessions[user].chat.push(`User: ${text}`)

  // Ambil history untuk konteks
  let history = sessions[user].chat.slice(-5).join('\n')
  let finalPrompt = `${system}\n${history}\nOguri Cap:`

  try {
    const response = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: finalPrompt })
    })

    const json = await response.json()
    const result = json?.result?.answer || null

    if (!result) {
      return m.reply('Maaf Trainer... perutku lapar, aku jadi sulit berpikir. Bisa coba lagi?')
    }

    // Simpan respon Oguri ke history
    sessions[user].chat.push(`Oguri Cap: ${result}`)
    sessions[user].chat = sessions[user].chat.slice(-10)

    await conn.sendMessage(m.chat, {
      text: result
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    await conn.reply(m.chat, `❌ Terjadi gangguan pada lintasan balap.\n${err.message}`, m)
  }
}

export { pluginConfig as config, handler };
