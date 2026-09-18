// © Elaina-MD — https://github.com/OmmniDevv/Elaina-MD
// Text-to-image: Pollinations.ai — gratis, no API key, no login.
import axios from 'axios'

const STYLES = {
  anime:    '&style=anime',
  real:     '',
  fantasy:  '&style=fantasy',
  digital:  '&style=digital-art',
  pixel:    '&style=pixel-art',
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🎨 *Senpai~* mau gambar apa? Elaina gambatkan~\n\n> Contoh: \`${usedPrefix}${command} anime girl with sword\``
  await conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } })
  const style = STYLES[command.toLowerCase()] || ''
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?width=512&height=512&nologo=true${style}`
  try {
    const { data } = await axios.get(url, { responseType: 'arraybuffer', timeout: 120000 })
    if (!data?.length) throw 'Gambar kosong'
    await conn.sendFile(m.chat, Buffer.from(data), 'image.jpg', `🎨 *${text}*\n\n> ✨ Elaina gambar untuk senpai~`, m)
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('😿 Gomen senpai... gambarannya gagal. Coba prompt lain ya~')
  }
}
handler.help = ['txt2img <prompt>', 'image <prompt>', 'imggen <prompt>', 'animeimg <prompt> anime', 'realimg <prompt>']
handler.tags = ['ai']
handler.command = /^(txt2img|text2img|t2i|imggen|imagegen|animeimg|realimg|pixelimg|fantasyimg|digitalimg)$/i
handler.limit = true
export default handler
