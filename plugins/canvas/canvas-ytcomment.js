// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!

async function makeYTComment(avatarUrl, username, comment) {
  const { createCanvas, loadImage } = await import('@napi-rs/canvas')
  const W = 600, H = 160
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')
  // Background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, W, H)
  // Avatar circle
  const avatar = await loadImage(avatarUrl)
  ctx.save()
  ctx.beginPath(); ctx.arc(45, 45, 28, 0, Math.PI * 2); ctx.clip()
  ctx.drawImage(avatar, 17, 17, 56, 56)
  ctx.restore()
  // Username
  ctx.font = 'bold 15px sans-serif'
  ctx.fillStyle = '#030303'
  ctx.fillText(username.slice(0, 30), 90, 38)
  // Time
  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#606060'
  ctx.fillText('just now', 90 + ctx.measureText(username.slice(0, 30)).width + 10, 38)
  // Comment text
  ctx.font = '14px sans-serif'
  ctx.fillStyle = '#030303'
  const words = comment.split(' ')
  let line = '', y = 65
  for (const word of words) {
    const test = line + word + ' '
    if (ctx.measureText(test).width > W - 110 && line) {
      ctx.fillText(line.trim(), 90, y); line = word + ' '; y += 22
    } else line = test
  }
  ctx.fillText(line.trim(), 90, y)
  // Like/dislike icons
  ctx.font = '13px sans-serif'
  ctx.fillStyle = '#606060'
  ctx.fillText('👍  👎  REPLY', 90, H - 20)
  return canvas.toBuffer('image/png')
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} Videonya keren!`
  m.reply('🎨 Membuat gambar...')
  try {
    const pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
    const buf = await makeYTComment(pp, m.pushName || 'User', text)
    await conn.sendMessage(m.chat, { image: { url: buf }, caption: `*YouTube Comment by ${m.pushName}*` }, { quoted: m })
  } catch (e) {
    throw `Error: ${e.message || e}`
  }
}

handler.help = ['ytcomment <text>']
handler.tags = ['canvas']
handler.command = /^(ytcomment|youtubecomment)$/i
handler.limit = true

export default handler
