/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from 'axios'
import FormData from 'form-data'

async function uguu(buffer) {
  try {
    const form = new FormData()
    form.append("files[]", buffer, "image.jpg")

    const { data } = await axios.post(
      "https://uguu.se/upload",
      form,
      { headers: form.getHeaders() }
    )

    return data?.files?.[0]?.url || null
  } catch {
    return null
  }
}

const pluginConfig = {
  name: "fakechannel",
  alias: ["fakech"],
  category: "maker",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, text, prefix, command }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
  const q = m.quoted ? m.quoted : m
  const mime = q.mimetype || q.msg?.mimetype || ''

  if (!text) {
    return m.reply(`Contoh:
${usedPrefix + command} url|name|followers|desc|date
Reply gambar:
${usedPrefix + command} name|followers|desc|date

Contoh cepat:
${usedPrefix}fakech hilman ytta|2,1M|anu|20/06/26`)
  }

  await m.react('🕒')

  try {
    let url, name, followers, desc, date
    let args = text.split('|').map(v => v?.trim())

    if (args.length === 5) {
      [url, name, followers, desc, date] = args
    } else if (args.length === 4) {
      if (!mime.startsWith('image/')) {
        throw 'Reply atau kirim gambar untuk foto channel.'
      }
      ;[name, followers, desc, date] = args
      let media = await q.download()
      url = await uguu(media)
      if (!url) throw 'Gagal upload gambar.'
    } else {
      throw `Format salah.
Contoh:
${usedPrefix}fakech hilman ytta|2,1M|anu|20/06/26`
    }

    let api = `https://api.zenzxz.my.id/maker/fakechannel?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}&followers=${encodeURIComponent(followers)}&desc=${encodeURIComponent(desc)}&date=${encodeURIComponent(date)}`

    let { data } = await axios.get(api, { responseType: 'arraybuffer' })
    let buffer = Buffer.from(data)

    await conn.sendMessage(m.chat, {
      image: buffer
    }, { quoted: m })

  } catch (e) {
    m.reply(typeof e === 'string' ? e : '❌ Gagal membuat fake channel.')
  }
}

export { pluginConfig as config, handler };
