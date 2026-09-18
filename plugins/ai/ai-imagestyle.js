// © Elaina-MD — https://github.com/OmmniDevv/Elaina-MD
// AI Image Style Converter — 100% gratis, no API key.
// api-faa.my.id (endpoint map) + nanobanana (prompt-based styles)
import { uploadImage } from '../../lib/scraper/uploader.js'
import nanoBanana from '../../lib/scraper/nanobanana.js'
import axios from 'axios'

const FAA_ENDPOINTS = {
  tohijab:      'tohijab',
  tofigure:     'tofigura',
  tofigurev2:   'tofigurav3',
  tojapanese:   'tojapanese',
  tomekah:      'tomekah',
  toemotebatu:  'tomoai',
  toanime:      'toanime',
}

const PROMPT_STYLES = {
  toblack:       { emoji: '🖤', label: 'BLACK STYLE',  prompt: 'Transform skin tone to a darker complexion, maintain facial features, realistic shadows, high detail, natural skin texture, no distortion' },
  tocermin:      { emoji: '🪞', label: 'CERMIN',       prompt: 'Create a mirror reflection effect of this image. Add a realistic reflection as if the subject is in front of a mirror or reflective surface. Ensure symmetry, smooth reflection blending, realistic lighting and shadows. Keep the original identity and details, high quality, photorealistic.' },
  tomanga:       { emoji: '📖', label: 'MANGA',        prompt: 'Transform this image into Japanese manga style illustration. Apply black and white manga aesthetics with dramatic shading, speed lines, expressive eyes, and detailed screentones. Keep the original composition but convert it to look like a page from a Japanese manga with bold ink lines, dynamic poses, and that distinctive manga art style.' },
  tooilpainting: { emoji: '🖼️', label: 'OIL PAINTING', prompt: 'Transform this image into a classical oil painting style. Apply thick brushstrokes, rich colors, and the texture of traditional oil paint on canvas. Keep the original composition but make it look like a masterpiece painting with visible brushwork, artistic color blending, and that timeless gallery-quality aesthetic.' },
  to3d:          { emoji: '🎮', label: '3D STYLE',     prompt: 'Transform this image into a high-quality 3D rendered style like Pixar or DreamWorks CGI. Apply realistic lighting, smooth textures, and that polished 3D animated movie look. Keep the original composition but make it look like a frame from a modern 3D animated film with subsurface scattering on skin, detailed hair, and cinematic lighting.' },
  toisland:      { emoji: '🏝️', label: 'ISLAND',       prompt: 'Transform this image into a tropical island scene. Place the subject in a beautiful island environment with clear blue ocean, palm trees, and warm sunlight. Add realistic lighting, shadows, and vibrant tropical colors. Keep the original identity, high detail, cinematic, photorealistic.' },
  tofigurine:    { emoji: '🎎', label: 'FIGURINE',     prompt: 'Using the model, create a 1/7 scale commercialized figurine of the characters in the picture, in a realistic style, in a real environment. The figurine is placed on a computer desk. The figurine has a round transparent acrylic base, with no text on the base.' },
}

let handler = async (m, { conn, command }) => {
  const cmd = command.toLowerCase()
  const isFaa = Object.keys(FAA_ENDPOINTS).includes(cmd)
  const cfg = PROMPT_STYLES[cmd]
  if (!isFaa && !cfg) return
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || ''
  if (!/image/.test(mime)) return m.reply(`🖼️ *${cfg?.label || cmd.toUpperCase()}*\n\n> Reply/kirim gambar dulu senpai~\n\n\`${m.prefix}${command}\``)
  await conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })
  try {
    const buf = await q.download()
    const imageUrl = await uploadImage(buf, `${cmd}.jpg`)
    let result
    if (isFaa) {
      const res = await axios.get(`https://api-faa.my.id/faa/${FAA_ENDPOINTS[cmd]}?url=${encodeURIComponent(imageUrl)}`, { responseType: 'arraybuffer', timeout: 120000 })
      result = Buffer.from(res.data)
    } else {
      result = await nanoBanana(buf, cfg.prompt)
    }
    if (!result?.length) throw 'Hasil kosong'
    await conn.sendFile(m.chat, result, `${cmd}.jpg`, '', m)
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('😿 Gomen senpai... konversi gagal. Coba gambar lain ya~\n\n> ' + (e?.message || e + '').slice(0, 150))
  }
}
handler.help = [...Object.keys(FAA_ENDPOINTS), ...Object.keys(PROMPT_STYLES)]
handler.tags = ['ai']
handler.command = new RegExp(`^(${[...Object.keys(FAA_ENDPOINTS), ...Object.keys(PROMPT_STYLES)].join('|')})$`, 'i')
handler.limit = true
export default handler
