// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import axios from 'axios'
import { elainaFooter } from '../../lib/elainaVoice.js'

const BASE = 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image'
const cache = new Map()

async function getImages(src) {
  if (cache.has(src)) return cache.get(src)
  const { data } = await axios.get(`${BASE}/${src}.json`, { timeout: 15000 })
  if (Array.isArray(data) && data.length) { cache.set(src, data); return data }
  return null
}

let handler = async (m, { conn, command, usedPrefix }) => {
  const imgs = await getImages('kanna')
  if (!imgs) throw '❌ Gagal ambil gambar'
  const url = imgs[Math.floor(Math.random() * imgs.length)]
  conn.sendButton(m.chat, 'Kanna 🐉', elainaFooter(), url, [['🔁 Next', `${usedPrefix}${command}`]], m)
}
handler.command = /^(kanna)$/i
handler.tags = ['anime']
handler.help = ['kanna']
handler.limit = true

export default handler
