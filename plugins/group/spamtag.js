/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


/*

# Fitur : spamtag
# Type : Plugins ESM
# Created by : https://whatsapp.com/channel/0029VbAXI4B1iUxRoQ1aQF24
# Api : lokal

   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg

*/

const pluginConfig = {
  name: "spamtag",
  alias: [],
  category: "group",
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

const handler = async (m, { conn, text, args, participants }) => {
  try {
    if (!text) return m.reply('❌ Tag orangnya dulu bang, contoh: .spamtag @user')

    const mention = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid[0] : ''
    if (!mention) return m.reply('❌ Tag yang bener bang, harus pakai @user')

    const ownerNumber = '6287823745178' 
    const user = db.data.users[m.sender]
    const isOwner = m.sender.includes(ownerNumber)

    const limit = isOwner ? 10 : user?.premium ? 5 : 3

    for (let i = 0; i < limit; i++) {
      await delay(700)
      await conn.sendMessage(m.chat, {
        text: `@${mention.split('@')[0]}`,
        mentions: [mention]
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { text: '✅ Dah tu spam tag' }, { quoted: m })

  } catch (e) {
    m.reply(`❌ Error\nLogs error : ${e.message}`)
  }
}

handler.admin = true
handler.botAdmin = false

function delay(ms) {
  return new Promise(res => setTimeout(res, ms))
}

export { pluginConfig as config, handler };
