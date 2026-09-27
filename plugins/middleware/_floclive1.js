// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fetch from "node-fetch"
import { generateWAMessageFromContent } from "@rexxhayanasi/elaina-baileys"

let handler  = async (m, { conn }) => {

 let pp = 'https://tinyurl.com/24u64tky'
  try {
    pp = await conn.profilePictureUrl(m.sender, 'image')
  } catch (e) {
  }

let msg = await generateWAMessageFromContent(m.chat, { locationMessage: {
  degreesLatitude: 0,
  degreesLongitude: 0,
  name: '𝚁𝚙𝚐 𝙱𝚘𝚝 𝚆𝚑𝚊𝚝𝚜𝚊𝚙𝚙',
  address: wm,
  url: 'https://github.com/ImYanXiao',
  isLive: true,
  accuracyInMeters: 0,
  speedInMps: 0,
  degreesClockwiseFromMagneticNorth: 2,
  comment: '',
  jpegThumbnail: global.thumbBuffer
}}, { quoted: m })

return conn.relayMessage(m.chat, msg.message, {})
}

handler.command = /^loc1$/
handler.owner = true
export default handler
