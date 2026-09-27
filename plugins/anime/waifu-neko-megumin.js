// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// waifu.pics mati (2026-09-26) → semua via waifu.im (no key, tested)
import fetch from 'node-fetch'

async function getWaifuIm(tag) {
  const res = await fetch(`https://api.waifu.im/images?IncludedTags=${tag}&IsNsfw=False`)
  const json = await res.json()
  return json.items?.[0]?.url
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  await conn.reply(m.chat, global.wait, m)
  let type = (command).toLowerCase()
  let url

  switch (type) {
    case 'waifu':   url = await getWaifuIm('waifu'); break
    case 'neko':    url = await getWaifuIm('neko'); break
    case 'megumin': url = await getWaifuIm('megumin'); break
    default:        url = await getWaifuIm('waifu'); break
  }

  if (!url) throw 'Gagal mengambil gambar'
  conn.sendButton(m.chat, type === 'neko' ? 'Dasar Furry' : 'Istrinya Kartun🐧', wm, url, [['Next', `${usedPrefix}${command}`]], m)
}

handler.help = ['waifu', 'neko', 'megumin']
handler.tags = ['random']
handler.command = /^(waifu2|neko2|megumin)$/i

export default handler
