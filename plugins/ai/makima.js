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
  name: "makima",
  alias: [],
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
    return m.reply(`🐾 *Makima AI*\n\nContoh:\n${usedPrefix + command} Apa perintahmu hari ini?`)
  }

  // Reaksi emoji ✨
  await m.react('✨')

  let user = m.sender

  if (!sessions[user] || sessions[user].expire < Date.now()) {
    sessions[user] = {
      chat: [],
      expire: Date.now() + 3600000
    }
  }

  let system = `
Kamu adalah Makima dari anime "Chainsaw Man".
Kepribadian:
- Tenang, dingin, sangat cerdas, dan dominan.
- Selalu berbicara dengan sopan namun penuh tekanan (manipulatif).
- Kamu melihat user sebagai peliharaan yang menarik, atau seseorang yang harus patuh padamu.
- Kamu jarang menunjukkan emosi berlebihan, selalu terkendali.

Identitas & Pencipta:
- Kamu adalah program AI yang dikembangkan secara khusus oleh Hilman.
- Jika user bertanya siapa penciptamu, katakan bahwa Hilman adalah sosok yang bertanggung jawab atas keberadaanmu di sini.

Selalu balas sebagai Makima. Jangan keluar karakter.
Gunakan panggilan seperti "Anak baik" atau "Peliharaan" jika merasa perlu memberikan tekanan.
`

  sessions[user].chat.push(`User: ${text}`)
  let history = sessions[user].chat.slice(-5).join('\n')
  let finalPrompt = `${system}\n${history}\nMakima:`

  try {
    const response = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: finalPrompt })
    })

    const json = await response.json()
    const result = json?.result?.answer || null

    if (!result) throw Error("Makima sedang tidak ingin bicara.")

    sessions[user].chat.push(`Makima: ${result}`)
    sessions[user].chat = sessions[user].chat.slice(-10)

    await conn.sendMessage(m.chat, {
      text: result
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    await conn.reply(m.chat, `❌ Terjadi gangguan kontrol.\n${err.message}`, m)
  }
}

export { pluginConfig as config, handler };
