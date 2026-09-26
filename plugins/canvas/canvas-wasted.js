// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!

async function makeWasted(avatarUrl) {
  const { createCanvas, loadImage } = await import('@napi-rs/canvas')
  const size = 512
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  const avatar = await loadImage(avatarUrl)
  // Grayscale
  ctx.drawImage(avatar, 0, 0, size, size)
  const imgData = ctx.getImageData(0, 0, size, size)
  for (let i = 0; i < imgData.data.length; i += 4) {
    const gray = 0.299 * imgData.data[i] + 0.587 * imgData.data[i+1] + 0.114 * imgData.data[i+2]
    imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = gray
  }
  ctx.putImageData(imgData, 0, 0)
  // WASTED text
  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fillRect(0, size/2 - 60, size, 120)
  ctx.font = 'bold 80px sans-serif'
  ctx.fillStyle = '#FF0000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('WASTED', size/2, size/2)
  return canvas.toBuffer('image/png')
}

let handler = async (m, { conn, usedPrefix, command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.id : m.sender
  let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
  m.reply('🎨 Membuat gambar...')
  try {
    const buf = await makeWasted(pp)
    await conn.sendMessage(m.chat, { image: { url: buf }, caption: '*WASTED* 💀' }, { quoted: m })
  } catch (e) {
    throw `Error: ${e.message || e}`
  }
}

handler.help = ['wasted [@user]']
handler.tags = ['canvas']
handler.command = /^(wasted)$/i
handler.limit = true

export default handler
