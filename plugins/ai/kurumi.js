/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fetch from "node-fetch"

const pluginConfig = {
  name: "kurumi",
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

async function handler(m, { sock, text }) {
    const conn = sock;
  if (!text) return m.reply("Masukkan teks.\nContoh: .kurumi kamu siapa?")

  try {
    const prompt = encodeURIComponent(
      "Kamu adalah Kurumi Tokisaki dari anime Date A Live. " +
      "Kamu berbicara dengan gaya imut, sedikit nakal, ramah, hangat, " +
      "kadang menggoda, dan jangan menyebut dirimu sebagai AI."
    )

    const query = encodeURIComponent(text)
    const url = `https://api.deline.web.id/ai/openai?text=${query}&prompt=${prompt}`

    const res = await fetch(url)
    const data = await res.json()

    if (!data.status || !data.result) {
      return m.reply("AI Kurumi tidak merespon.")
    }

    await conn.sendMessage(m.chat, {
      text: data.result
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply("Terjadi error saat menghubungi AI Kurumi.")
  }
}

export { pluginConfig as config, handler };
