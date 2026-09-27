// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import { Canvas } from 'skia-canvas'
import { addExifToWebp } from '../../src/lib/exif.js'

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word }
    else line = test
  }
  if (line) lines.push(line)
  return lines
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix}${command} Halo Dunia\nDengan warna: ${usedPrefix}${command} Halo|#ff69b4`

  const parts = text.split('|')
  const teks = parts[0].trim()
  const bgColor = parts[1]?.trim() || null
  const textColor = parts[2]?.trim() || '#FFFFFF'

  const size = 512
  const canvas = new Canvas(size, size)
  const ctx = canvas.getContext('2d')

  if (bgColor) {
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)
  } else {
    const grad = ctx.createLinearGradient(0, 0, size, size)
    grad.addColorStop(0, '#1a1a2e')
    grad.addColorStop(1, '#16213e')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
  }

  let fontSize = 96
  ctx.fillStyle = textColor
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  while (fontSize > 24) {
    ctx.font = `bold ${fontSize}px sans-serif`
    const lines = wrapText(ctx, teks, size - 60)
    if (lines.length * fontSize * 1.3 < size * 0.8) break
    fontSize -= 4
  }

  ctx.shadowColor = 'rgba(0,0,0,0.8)'
  ctx.shadowBlur = 8
  ctx.shadowOffsetX = 3
  ctx.shadowOffsetY = 3

  const lines = wrapText(ctx, teks, size - 60)
  const lineH = fontSize * 1.3
  const startY = size / 2 - (lines.length - 1) * lineH / 2
  lines.forEach((line, i) => ctx.fillText(line, size / 2, startY + i * lineH))

  const pngBuffer = await canvas.png
  const sticker = await addExifToWebp(pngBuffer, {
    packname: global.stickpack || 'Elaina BOT',
    author: global.stickauth || 'ElainaBOT'
  })

  await conn.sendMessage(m.chat, { sticker }, { quoted: m })
}

handler.help = ['ttp2 <teks>', 'ttp2 <teks>|<warna_bg>']
handler.tags = ['sticker']
handler.command = /^(ttp2|ttpv2|textcanvas)$/i
export default handler
