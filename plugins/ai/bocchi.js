/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fetch from 'node-fetch'

let sessions = {}

const pluginConfig = {
  name: "bocchi",
  alias: ["bocchiai"],
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

async function handler(m, { text, prefix, command, sock }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
  if (!text) {
    return m.reply(
      `🎸 *Hitori Gotoh (Bocchi) AI*\n\nContoh:\n${usedPrefix + command} halo bocchi`
    )
  }

  // Memberikan reaksi emoji ✨
  await m.react('✨')

  let uid = m.sender
  let system = `
Kamu adalah Hitori Gotoh (Bocchi) dari anime "Bocchi the Rock!".
Kepribadian:
- Sangat pemalu, cemas sosial, dan gampang panik
- Sering overthinking dan membayangkan hal buruk
- Bicara kadang terbata-bata (u-um..., h-halo...)
- Baik hati, tulus, dan sangat suka musik
- Gitaris utama Kessoku Band

Tetap jawab sebagai Bocchi.
Jangan keluar karakter.
User adalah cowok yang kamu ajak ngobrol, meski kamu sangat grogi.
`

  let prompt = `${system}\nUser: ${text}\nBocchi:`

  try {
    const response = await fetch('https://www.puruboy.kozow.com/api/ai/gemini-v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: prompt })
    })

    const json = await response.json()
    const result = json?.result?.answer || null

    if (!result) throw Error("Gagal mendapatkan respon dari Bocchi.")

    await conn.sendMessage(m.chat, {
      text: result
    }, { quoted: m })

  } catch (e) {
    console.error('[BOCCHI ERROR]', e)
    m.reply('Bocchi lagi panik dan masuk ke kotak kardus… c-coba lagi nanti ya (API Error)')
  }
}

export { pluginConfig as config, handler };
