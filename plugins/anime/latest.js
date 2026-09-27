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
  name: "animelatest",
  alias: ["latestanime"],
  category: "anime",
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

async function handler(m, { sock }) {
    const conn = sock;
  try {
    const res = await fetch('https://api.sansekai.my.id/api/anime/latest')
    const data = await res.json()

    if (!data.length) throw 'Anime tidak ditemukan.'

    let teks = `🎌 *ANIME TERBARU*\n\n`

    data.forEach((anime, i) => {
      teks += `*${i + 1}. ${anime.judul}*\n`
      teks += `📺 Episode : ${anime.lastch}\n`
      teks += `🕒 Update  : ${anime.lastup}\n`
      teks += `🔗 Link    : https://sansekai.my.id/anime/${anime.url}\n\n`
    })

    await conn.sendFile(
      m.chat,
      data[0].cover,
      'anime.jpg',
      teks,
      m
    )

  } catch (e) {
    m.reply('❌ Gagal mengambil data anime terbaru')
  }
}

export { pluginConfig as config, handler };
