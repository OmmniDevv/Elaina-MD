/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


/**
 * Fitur   : TikTok Slide Downloader
 * Base    : tikwm.com
 * Type    : Plugin ESM
 * Channel : https://whatsapp.com/channel/0029VbAYjQgKrWQulDTYcg2K
 * Creator : Hilman
 */

import { proto, generateWAMessageFromContent, generateWAMessageContent } from '@rexxhayanasi/elaina-baileys'

async function getSlide(url) {
  const res = await fetch(`https://www.tikwm.com/api/?url=${url}&hd=1`)
  const json = await res.json()
  return json?.data
}

async function createImage(url, conn) {
  const { imageMessage } = await generateWAMessageContent(
    { image: { url } },
    { upload: conn.waUploadToServer }
  )
  return imageMessage
}

const pluginConfig = {
  name: "ttimg",
  alias: ["tiktokimg"],
  category: "download",
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

async function handler(m, { text, prefix, command, sock }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
  if (!text) {
    return m.reply(`Contoh:\n${usedPrefix + command} https://vt.tiktok.com/xxxx`)
  }

  await m.react('✨')

  try {
    const regex = /(https:\/\/(vt|vm)\.tiktok\.com\/[^\s]+|https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+)/
    const url = text.match(regex)?.[0]

    if (!url) return m.reply('❌ Link TikTok tidak valid.')

    const data = await getSlide(url)
    if (!data) return m.reply('❌ Gagal mengambil data.')

    const images = data.images || []
    if (!images.length) return m.reply('❌ Post ini bukan slideshow foto.')

    const cards = []

    for (let img of images.slice(0, 6)) {
      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: data.title || 'TikTok Slide'
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: 'ʀyᴏ yᴀᴍᴀᴅᴀ - ᴍᴅ'
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: data.author.nickname,
          hasMediaAttachment: true,
          imageMessage: await createImage(img, conn)
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({
                display_text: 'Buka TikTok',
                url: `https://www.tiktok.com/@${data.author.unique_id || 'user'}/video/${data.video_id}`
              })
            }
          ]
        })
      })
    }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text:
`✨ *TIKTOK PHOTO*

Judul: ${data.title || '-'}
Uploader: ${data.author.nickname}
Total: ${images.length}`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: 'Slide Viewer'
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false
            }),
            carouselMessage:
              proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                cards
              })
          })
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    console.error(e)
    m.reply('❌ Gagal mengambil slide.')
  }
}

handler.register = true

export { pluginConfig as config, handler };
