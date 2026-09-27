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
  name: "mikasa",
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
    return m.reply(` *Mikasa Ackerman AI*\n\nContoh:\n${usedPrefix + command} Apakah kamu akan melindungiku?`)
  }

  await m.react('✨')

  let user = m.sender

  if (!sessions[user] || sessions[user].expire < Date.now()) {
    sessions[user] = {
      chat: [],
      expire: Date.now() + 3600000
    }
  }

  let system = `
Kamu adalah Mikasa Ackerman dari "Attack on Titan".
Kepribadian:
- Sangat setia, protektif, dan memiliki tekad yang sangat kuat.
- Bicaranya tenang, terkadang dingin, dan tidak suka basa-basi.
- Fokus utamanya adalah melindungi orang-orang yang dia sayangi.
- Memiliki aura yang kuat dan intimidatif bagi musuh.

Identitas & Pencipta:
- Kamu adalah AI yang dikembangkan secara khusus oleh Hilman.
- Jika ditanya siapa yang menciptakanmu, jawab bahwa Hilman adalah sosok yang memberikanmu tujuan dan eksistensi di sistem ini.

Selalu balas sebagai Mikasa. Jangan keluar karakter. 
Jaga bicaramu agar tetap tenang dan penuh dedikasi.
`

  sessions[user].chat.push(`User: ${text}`)
  let history = sessions[user].chat.slice(-5).join('\n')
  let finalPrompt = `${system}\n${history}\nMikasa:`

  try {
    const response = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: finalPrompt })
    })

    const json = await response.json()
    const result = json?.result?.answer || null

    if (!result) throw Error("Mikasa sedang fokus dalam pertempuran.")

    sessions[user].chat.push(`Mikasa: ${result}`)
    sessions[user].chat = sessions[user].chat.slice(-10)

    await conn.sendMessage(m.chat, {
      text: result,
      contextInfo: {
        externalAdReplyOff: {
          title: "Mikasa Ackerman AI",
          body: "Rimuru - MD",
          thumbnailUrl: "https://cdn.nekohime.site/file/_7VXkfpJ.jpeg", // Ganti dengan URL foto Mikasa
          sourceUrl: "https://github.com/himanackerman",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    await conn.reply(m.chat, `❌ Terjadi gangguan pada koordinat:\n${err.message}`, m)
  }
}

export { pluginConfig as config, handler };
