/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from 'axios'

const pluginConfig = {
  name: "sad",
  alias: [],
  category: "music",
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

async function handler(m, { sock, args }) {
    const conn = sock;
  const sadNumber = parseInt(args[0] || '', 10)

  if (isNaN(sadNumber) || sadNumber < 1 || sadNumber > 34)
    throw 'Masukkan nomor antara 1 dan 34\nContoh: .sad 2'

  const audioUrl = `https://github.com/Rangelofficial/Sad-Music/raw/main/audio-sad/sad${sadNumber}.mp3`

  m.reply('🍬 Mengirim audio...')

  const res = await fetch(audioUrl)
  if (!res.ok) throw 'Gagal mengunduh audio.'
  const audioBuffer = Buffer.from(await res.arrayBuffer())

  const thumbUrl = 'https://files.catbox.moe/y5b7l6.jpg'
  const thumb = (await axios.get(thumbUrl, { responseType: 'arraybuffer' })).data

  await conn.sendMessage(m.chat, {
    audio: audioBuffer,
    mimetype: 'audio/mpeg',
    ptt: false,
    contextInfo: {
      externalAdReplyOffOffOff: {
        title: "🎧 Sad Music",
        body: "Powered by Ryo Yamada MD",
        thumbnail: thumb,
        sourceUrl: "https://github.com/Rangelofficial/Sad-Music",
        mediaType: 2,
        renderLargerThumbnail: false
      }
    }
  }, { quoted: m })
}

export { pluginConfig as config, handler };
