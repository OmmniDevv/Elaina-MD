// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import axios from 'axios'

async function makeJail(avatarUrl) {
  const { createCanvas, loadImage } = await import('@napi-rs/canvas')
  const size = 512
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  // Draw avatar
  const avatar = await loadImage(avatarUrl)
  ctx.drawImage(avatar, 0, 0, size, size)
  // Draw jail bars overlay
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.fillRect(0, 0, size, size)
  const barCount = 7
  const barWidth = 18
  ctx.fillStyle = '#555555'
  for (let i = 0; i < barCount; i++) {
    const x = (size / barCount) * i + (size / barCount / 2) - barWidth / 2
    ctx.fillRect(x, 0, barWidth, size)
  }
  // Horizontal bars top and bottom
  ctx.fillStyle = '#444444'
  ctx.fillRect(0, 0, size, 30)
  ctx.fillRect(0, size - 30, size, 30)
  return canvas.toBuffer('image/png')
}

let handler = async (m, { conn, usedPrefix, command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.id : m.sender
  let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
  m.reply('🎨 Membuat gambar...')
  try {
    const buf = await makeJail(pp)
    await conn.sendMessage(m.chat, { image: { url: buf }, caption: '*JAIL* 🔒' }, { quoted: m })
  } catch (e) {
    throw `Error: ${e.message || e}`
  }
}

handler.help = ['jail [@user]']
handler.tags = ['canvas']
handler.command = /^(jail|penjara)$/i
handler.limit = true

export default handler
