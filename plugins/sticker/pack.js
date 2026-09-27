/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import sharp from 'sharp'
import axios from 'axios'
import FormData from 'form-data'

async function toWebp(buffer) {
  return await sharp(buffer)
    .webp({ quality: 80 })
    .toBuffer()
}

async function uploadUguu(buffer) {
  let form = new FormData()
  form.append('files[]', buffer, 'file.webp')

  let res = await axios.post('https://uguu.se/upload.php', form, {
    headers: form.getHeaders()
  })

  return res.data.files[0].url
}

const pluginConfig = {
  name: "pack",
  alias: [],
  category: "sticker",
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
    if (!m.quoted) return m.reply('Reply gambar / sticker')

    let mime = m.quoted.mimetype || ''
    if (!/image|webp/.test(mime)) {
      return m.reply('Harus reply gambar atau sticker')
    }

    let media = await m.quoted.download()
    let webp = await toWebp(media)
    let url = await uploadUguu(webp)

    if (typeof conn.sendStickerPack !== 'function') {
      throw new Error('Fitur sticker pack tidak tersedia pada socket bot')
    }

    await conn.sendStickerPack(
      m.chat,
      [webp],
      m,
      {
        name: 'Ryo Yamada',
        publisher: 'Ryo Yamada',
        description: 'ytta acumalaka'
      }
    )

  } catch (e) {
    console.error(e)
    m.reply('Error bikin sticker pack')
  }
}

export { pluginConfig as config, handler };
