// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!

async function makeTriggered(avatarUrl) {
  const { createCanvas, loadImage } = await import('@napi-rs/canvas')
  const size = 256
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  const avatar = await loadImage(avatarUrl)
  // Red tint
  ctx.drawImage(avatar, 0, 0, size, size)
  ctx.fillStyle = 'rgba(255,0,0,0.4)'
  ctx.fillRect(0, 0, size, size)
  // TRIGGERED text
  ctx.fillStyle = 'rgba(0,0,0,0.6)'
  ctx.fillRect(0, size - 50, size, 50)
  ctx.font = 'bold 28px sans-serif'
  ctx.fillStyle = '#FF0000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('TRIGGERED', size/2, size - 25)
  return canvas.toBuffer('image/png')
}

let handler = async (m, { conn, usedPrefix, command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.id : m.sender
  let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
  m.reply('🎨 Membuat gambar...')
  try {
    const buf = await makeTriggered(pp)
    await conn.sendMessage(m.chat, { image: { url: buf }, caption: '*TRIGGERED* 😡' }, { quoted: m })
  } catch (e) {
    throw `Error: ${e.message || e}`
  }
}

handler.help = ['triggered [@user]']
handler.tags = ['canvas']
handler.command = /^(triggered)$/i
handler.limit = true

export default handler
