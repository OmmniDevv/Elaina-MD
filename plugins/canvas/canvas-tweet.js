// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!

async function makeTweet(avatarUrl, username, displayname, text) {
  const { createCanvas, loadImage } = await import('@napi-rs/canvas')
  const W = 600, H = 200
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')
  // Background
  ctx.fillStyle = '#15202B'
  ctx.fillRect(0, 0, W, H)
  // Avatar circle
  const avatar = await loadImage(avatarUrl)
  ctx.save()
  ctx.beginPath(); ctx.arc(55, 55, 35, 0, Math.PI * 2); ctx.clip()
  ctx.drawImage(avatar, 20, 20, 70, 70)
  ctx.restore()
  // Name
  ctx.font = 'bold 18px sans-serif'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(displayname.slice(0, 25), 105, 45)
  // Username
  ctx.font = '14px sans-serif'
  ctx.fillStyle = '#8899A6'
  ctx.fillText(`@${username.slice(0, 20)}`, 105, 68)
  // Tweet text
  ctx.font = '16px sans-serif'
  ctx.fillStyle = '#FFFFFF'
  const words = text.split(' ')
  let line = '', y = 115
  for (const word of words) {
    const test = line + word + ' '
    if (ctx.measureText(test).width > W - 40 && line) {
      ctx.fillText(line.trim(), 20, y); line = word + ' '; y += 24
    } else line = test
  }
  ctx.fillText(line.trim(), 20, y)
  // Twitter bird icon
  ctx.font = '20px sans-serif'
  ctx.fillStyle = '#1DA1F2'
  ctx.fillText('🐦', W - 40, 40)
  return canvas.toBuffer('image/png')
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} Halo`
  m.reply('🎨 Membuat gambar...')
  try {
    const pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
    const buf = await makeTweet(pp, m.pushName || 'User', m.pushName || 'User', text)
    await conn.sendMessage(m.chat, { image: { url: buf }, caption: `*Tweet by ${m.pushName}*` }, { quoted: m })
  } catch (e) {
    throw `Error: ${e.message || e}`
  }
}

handler.help = ['tweet <text>']
handler.tags = ['canvas']
handler.command = /^(tweet)$/i
handler.limit = true

export default handler
