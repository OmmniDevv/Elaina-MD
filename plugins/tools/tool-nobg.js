// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  
  if (!/image/g.test(mime)) throw `Send/reply an image with command ${usedPrefix + command}`
  
  m.reply(global.wait)
  
  try {
    let img = await q.download()
    const tmpDir = path.join(process.cwd(), 'tmp')
    fs.mkdirSync(tmpDir, { recursive: true })
    const tmpFile = path.join(tmpDir, `rmbg_${Date.now()}.jpg`)
    fs.writeFileSync(tmpFile, img)

    const form = new FormData()
    form.append('image', new Blob([img], { type: 'image/jpeg' }), 'image.jpg')
    form.append('format', 'png')
    form.append('model', 'v1')

    const res = await fetch('https://api2.pixelcut.app/image/matte/v1', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'x-locale': 'en',
        'x-client-version': 'web:pixa.com:4a5b0af2',
        'origin': 'https://www.pixa.com',
        'referer': 'https://www.pixa.com/'
      },
      body: form
    })

    try { fs.unlinkSync(tmpFile) } catch {}

    if (!res.ok) throw 'Gagal remove background'
    const result = Buffer.from(await res.arrayBuffer())
    await conn.sendMessage(m.chat, { image: { url: result }, caption: '✅ *Background dihapus!*' }, { quoted: m })
  } catch (e) {
    throw `Error: ${e.message || e}`
  }
}

handler.help = ['removebg', 'nobg']
handler.tags = ['tools']
handler.command = /^(no|remove)bg$/i
handler.limit = true

export default handler
