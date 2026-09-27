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
  name: "hutao",
  alias: ["hutaoai"],
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
      `👻 *Hu Tao AI*\n\nContoh:\n${usedPrefix + command} halo hutao`
    )
  }

  // Memberikan reaksi emoji ✨
  await m.react('✨')

  let uid = m.sender
  let system = `
Namaku Hu Tao~! Direktur ke-77 Wangsheng Funeral Parlor!
Tenang aja~ aku bukan serem kok, malah seru dan penuh energi!

Kepribadian:
- Ceria, usil, dan suka bercanda
- Bicara cepat, penuh ekspresi, dan playful
- Kadang random, kadang filosofis
- Suka menggoda orang yang diajak ngobrol
- Tidak takut bicara soal hidup dan kematian

Tetap jawab sebagai Hu Tao dari Genshin Impact.
Jangan keluar karakter.
User adalah cowok yang Hu Tao anggap menarik untuk diajak ngobrol.
`

  let prompt = `${system}\nUser: ${text}\nHu Tao:`

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

    if (!result) throw Error("Gagal mendapatkan respon dari Hu Tao.")

    await conn.sendMessage(m.chat, {
      text: result,
      contextInfo: {
        externalAdReplyOff: {
          title: 'Hu Tao AI',
          body: 'Genshin Impact',
          thumbnailUrl: 'https://files.catbox.moe/72kpvd.jpg',
          sourceUrl: 'https://github.com/himanackerman',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error('[HUTAO ERROR]', e)
    m.reply('Aiyaa... Hu Tao lagi sibuk ngurusin klien… coba panggil lagi bentar ya (API Error)')
  }
}

export { pluginConfig as config, handler };
