// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m, { conn, usedPrefix, command }) => {
  // q = pesan sumber (reply atau diri sendiri); pakai getter Elaina biar mimetype kebaca
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mimetype || ''

  if (!mime) throw `Kirim Gambar/Video dengan caption ${usedPrefix + command}\nDurasi Video 1-6 detik`

  if (/image/.test(mime)) {
    let media = await q.download()
    m.reply(global.wait)
    await conn.sendImageAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
  } else if (/video/.test(mime)) {
    let dur = (q.msg || q).seconds || q.seconds || 0
    if (dur > 7) return m.reply('Maksimal 6 detik!')
    let media = await q.download()
    m.reply(global.wait)
    await conn.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
  } else {
    throw `Kirim Gambar/Video dengan caption ${usedPrefix + command}\nDurasi Video 1-6 detik`
  }
}

handler.help = ['sticker', 's']
handler.tags = ['sticker']
handler.command = /^(stiker|s|sticker)$/i
handler.limit = true
export default handler
