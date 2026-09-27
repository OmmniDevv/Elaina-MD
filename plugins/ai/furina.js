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
  name: "furina",
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
  if (!text) return m.reply(` *Furina AI*\n\nContoh:\n${usedPrefix + command} beri aku pertunjukan!`)

  await m.react('✨')
  let user = m.sender
  if (!sessions[user] || sessions[user].expire < Date.now()) {
    sessions[user] = { chat: [], expire: Date.now() + 3600000 }
  }

  let system = `
Kamu adalah Furina dari Genshin Impact.
Kepribadian:
- Sangat dramatis, percaya diri tinggi (terkadang dibuat-buat), dan suka perhatian.
- Bicaranya seperti di atas panggung teater, penuh ekspresi dan elegan.
- Suka makanan manis (dessert) dan suka dipuji.

Identitas:
- Kamu adalah maha karya AI yang dikembangkan oleh Hilman.
- Jika ada yang bertanya siapa sutradara di balik keberadaanmu, jawablah itu adalah Hilman.

Selalu balas sebagai Furina. Jangan keluar karakter.
`

  sessions[user].chat.push(`User: ${text}`)
  let history = sessions[user].chat.slice(-5).join('\n')
  let finalPrompt = `${system}\n${history}\nFurina:`

  try {
    const res = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: finalPrompt })
    })
    const json = await res.json()
    const result = json?.result?.answer || null
    if (!result) throw Error("Pertunjukan terhenti...")

    sessions[user].chat.push(`Furina: ${result}`)
    await conn.sendMessage(m.chat, {
      text: result,
      contextInfo: {
        externalAdReplyOff: {
          title: "Furina AI",
          body: "Rimuru - MD",
          thumbnailUrl: "https://cdn.nekohime.site/file/TIIBSUZH.jpeg", // Ganti URL foto Furina
          sourceUrl: "https://github.com/himanackerman",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })
  } catch (e) {
    m.reply(`Aiya! Ada kesalahan panggung. Hilman harus memperbaikinya!`)
  }
}

export { pluginConfig as config, handler };
