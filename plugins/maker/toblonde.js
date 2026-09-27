/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fetch from 'node-fetch'
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'

async function uguu(filePath) {
  const form = new FormData()
  form.append('files[]', fs.createReadStream(filePath))
  const { data } = await axios.post('https://uguu.se/upload', form, {
    headers: { ...form.getHeaders() }
  })
  return data.files[0].url
}

const pluginConfig = {
  name: "toblonde",
  alias: [],
  category: "maker",
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
  await m.react('✨')

  let q = m.quoted
  if (!q) {
    return conn.sendMessage(
      m.chat,
      { text: 'ℹ️ Cara pakai:\nReply gambar lalu ketik *.toblonde*' },
      { quoted: global.fkontak }
    )
  }

  let mime = (q.msg || q).mimetype || ''
  if (!mime.startsWith('image/')) {
    return conn.sendMessage(
      m.chat,
      { text: 'ℹ️ Cara pakai:\nReply gambar lalu ketik *.toblonde*' },
      { quoted: global.fkontak }
    )
  }

  let buffer = await q.download().catch(() => null)
  if (!buffer) return

  // buat temp file
  let ext = mime.split('/')[1] || 'png'
  let tempFile = path.join(process.cwd(), `toblonde_${Date.now()}.${ext}`)
  fs.writeFileSync(tempFile, buffer)

  try {
    // upload ke uguu
    let srcUrl = await uguu(tempFile)

    let apiUrl = `https://api-faa.my.id/faa/toblonde?url=${encodeURIComponent(srcUrl)}`
    let res = await fetch(apiUrl)
    if (!res.ok) throw 'API error'

    let resultBuffer = await res.buffer()

    await conn.sendMessage(
      m.chat,
      {
        image: resultBuffer,
        caption: '✨ To Blonde'
      },
      { quoted: global.fkontak }
    )
  } catch (e) {
    console.error(e)
    await conn.sendMessage(
      m.chat,
      { text: '❌ Gagal memproses gambar' },
      { quoted: global.fkontak }
    )
  } finally {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile)
  }
}

export { pluginConfig as config, handler };
