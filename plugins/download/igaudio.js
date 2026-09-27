/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from 'axios'
import * as cheerio from 'cheerio'

const pluginConfig = {
  name: "igaudio",
  alias: ["igmp3"],
  category: "download",
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
  if (!text) throw `Contoh:\n${usedPrefix + command} https://www.instagram.com/reel/xxxxx/`

  await m.react('🕒')

  try {
    let { data } = await axios.post(
      'https://reelsvideo.io/reel/',
      new URLSearchParams({
        id: text,
        locale: 'id',
        'cf-turnstile-response': '',
        tt: 'a66b23d8bfa4878536d788ac3d33d1a6',
        ts: Math.floor(Date.now() / 1000)
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'HX-Request': 'true',
          'HX-Trigger': 'main-form',
          'HX-Target': 'target',
          'HX-Current-URL': 'https://reelsvideo.io/id',
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://reelsvideo.io/id'
        }
      }
    )

    const $ = cheerio.load(data)
    const mp3Link = $('a.type_audio').attr('href')

    if (!mp3Link) throw 'Audio tidak tersedia di reel ini.'

    await conn.sendMessage(m.chat, {
      audio: { url: mp3Link },
      mimetype: 'audio/mpeg'
    }, { quoted: global.fstatus })

  } catch (e) {
    m.reply(typeof e === 'string' ? e : '❌ Gagal mengambil audio Instagram.')
  }
}

export { pluginConfig as config, handler };
