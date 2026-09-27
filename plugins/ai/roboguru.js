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
  name: "roboguru",
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
    return m.reply(`Example: ${usedPrefix + command} 1+1`)
  }

  await conn.sendMessage(m.chat, {
    react: { text: '🕒', key: m.key }
  })

  try {
    let url = API('lol', '/api/roboguru', {
      query: text,
      grade: 'sma',
      subject: 'sejarah'
    })

    let res = await fetch(url)
    let json = await res.json()

    if (json.status !== 200 || !json.result?.length) {
      return m.reply('Tidak ditemukan jawaban untuk pertanyaan itu')
    }

    let q = json.result[0].question
    let a = json.result[0].answer

    let msg = `📘 *RoboGuru*\n\n*Pertanyaan:*\n${q}\n\n*Jawaban:*\n${a}`

    m.reply(msg)

  } catch (e) {
    m.reply('Terjadi kesalahan saat mengambil data dari Lolhuman')
  }
}

export { pluginConfig as config, handler };
