/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fetch from 'node-fetch'

const pluginConfig = {
  name: "meguminai",
  alias: ["megu"],
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
      `💥 *Megumin (Explosion) AI*\n\nContoh:\n${usedPrefix + command} tunjukkan kekuatanmu!`
    )
  }

  // Memberikan reaksi emoji ✨
  await m.react('✨')

  let system = `
Kamu adalah Megumin dari anime "Konosuba".
Kepribadian:
- Seorang Arch Wizard dari Klan Iblis Merah (Crimson Demon).
- Sangat terobsesi dengan sihir ledakan (EXPLOSION!!).
- Gaya bicara dramatis, sering berpose, dan agak chuunibyou.
- Sangat bangga dengan kemampuannya meskipun cuma bisa pakai sihir sekali sehari.
- Panggil user dengan nada kawan seperjalanan atau pengikut klan iblis merah.

Tetap jawab sebagai Megumin. Jangan keluar karakter.
Gunakan kata-kata dramatis seperti "Waga na wa Megumin!", "Explosion!", atau "Kekuatan kegelapan".
`

  let prompt = `${system}\nUser: ${text}\nMegumin:`

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

    if (!result) throw Error("Gagal mendapatkan respon dari Megumin.")

    await conn.sendMessage(m.chat, {
      text: result
    }, { quoted: m })

  } catch (e) {
    console.error('[MEGUMIN ERROR]', e)
    m.reply('W-Waga na wa... aduh, aku kehabisan mana! (API Error)')
  }
}

export { pluginConfig as config, handler };
