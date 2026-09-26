// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fetch from 'node-fetch'

async function getWaifuIm(tag) {
  const t = tag || 'waifu'
  const res = await fetch(`https://api.waifu.im/images?IncludedTags=${t}&IsNsfw=False`)
  const json = await res.json()
  return json.items?.[0]?.url
}

// waifu.pics mati (dites 2026-09-26: 000 timeout) → semua via waifu.im
let handler = async (m, { conn, command }) => {
  let url
  switch (command.toLowerCase()) {
    case 'neko':    url = await getWaifuIm('neko'); break
    case 'waifu':   url = await getWaifuIm('waifu'); break
    case 'maid':    url = await getWaifuIm('maid'); break
    case 'shinobu': url = await getWaifuIm('shinobu'); break
    case 'hug':     url = await getWaifuIm('hug'); break
    case 'pat':     url = await getWaifuIm('pat'); break
    case 'kiss':    url = await getWaifuIm('kiss'); break
    case 'slap':    url = await getWaifuIm('slap'); break
    case 'cry':     url = await getWaifuIm('cry'); break
    case 'dance':   url = await getWaifuIm('dance'); break
    case 'smug':    url = await getWaifuIm('smug'); break
    case 'blush':   url = await getWaifuIm('blush'); break
    default:        url = await getWaifuIm('waifu'); break
  }

  if (!url) throw 'Gagal mengambil gambar'
  await conn.sendMessage(m.chat, { image: { url }, caption: global.wm }, { quoted: m })
}

handler.help = ['waifu', 'neko', 'maid', 'hug', 'pat', 'kiss', 'slap', 'cry', 'dance', 'smug', 'blush']
handler.tags = ['anime']
handler.command = /^(neko|waifu|maid|shinobu|hug|pat|kiss|slap|cry|dance|smug|blush)$/i
export default handler
