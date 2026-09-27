/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fs from "fs"

const pluginConfig = {
  name: "bankcek",
  alias: [],
  category: "rpg",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

const handler = async (m, { conn }) => {
  const who = m.mentionedJid && m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.fromMe
      ? conn.user.jid
      : m.sender

  const user = global.db.data.users[who]
  if (!user) return m.reply(`User ${who} not in database`)

  const devs = global.owner.filter(([_, __, isDev]) => isDev).map(([num]) => num.replace(/\D/g, '') + '@s.whatsapp.net')
  const owners = global.owner.filter(([_, __, isDev]) => !isDev).map(([num]) => num.replace(/\D/g, '') + '@s.whatsapp.net')
  const isMods = devs.includes(who)
  const isOwner = m.fromMe || isMods || [conn.decodeJid(conn.user.id), ...owners].includes(who)
  const isPrems = isOwner || (new Date() - user.premiumTime < 0)

  const caption = `
▧「 *BANK INFO* 」
│ Name: ${user.registered ? user.name : conn.getName(m.sender)}
│ Status: ${isMods ? 'Developer' : isOwner ? 'Owner' : isPrems ? 'Premium User' : user.level > 999 ? 'Elite User' : 'Free User'}
│ Registered: ${user.registered ? 'Yes' : 'No'}
│ 
│ Atm: ${user.atm > 0 ? 'Level ' + toRupiah(user.atm) : '✖️'}
│ Bank: ${toRupiah(user.bank)} / ${toRupiah(user.fullatm)}
│ Money: ${toRupiah(user.money)}
│ Chip: ${toRupiah(user.chip)}
│ Robo: ${user.robo > 0 ? 'Level ' + user.robo : '✖️'}
└────···
`.trim()

  await conn.sendMessage(m.chat, {
    text: caption,
    contextInfo: {
      externalAdReplyOffOffOff: {
        title: 'B A N K  I N F O',
        body: '',
        mediaType: 1,
        previewType: 'PHOTO',
        renderLargerThumbnail: true,
        thumbnailUrl: 'https://files.catbox.moe/c67nx0.jpg',
        sourceUrl: global.config?.website || '',
        mediaUrl: flaImg.getRandom() + 'BANK INFO'
      }
    }
  }, { quoted: m })
}

handler.register = true
const flaImg = [
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextColor=%23000&shadowGlowColor=%23000&backgroundColor=%23000&text=',
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&text=',
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&doScale=true&scaleWidth=800&scaleHeight=500&text=',
  'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=',
  'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColor1Color=%23f2aa4c&fillColor2Color=%23f2aa4c&backgroundColor=%23101820&text='
]

const toRupiah = number => parseInt(number).toLocaleString().replace(/,/g, ".")

export { pluginConfig as config, handler };
