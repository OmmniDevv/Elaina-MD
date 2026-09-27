/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getImageProcessingLibrary } from '@rexxhayanasi/elaina-baileys'

let handler = async (m, { conn }) => {
  let q = m.quoted || m
  let mime = q.mimetype || ''

  if (!mime.startsWith('image/')) return m.reply('Reply gambar!')

  let buffer = await q.download()

  const lib = await getImageProcessingLibrary()

  let output = buffer
  if (lib.sharp?.default) {
    output = await lib.sharp.default(buffer)
      .resize(512)
      .png()
      .toBuffer()
  }

  await conn.sendMessage(m.chat, { image: output }, { quoted: m })
}

handler.command = ['resize']
export default handler
