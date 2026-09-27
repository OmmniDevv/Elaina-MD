/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "addlimit",
  alias: ["user"],
  category: "owner",
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

async function handler(m, { sock, text }) {
    const conn = sock;
  if (!text) throw 'Format:\n.addlimit @user 1000\n.addlimit 628xxxx 1000'

  let users = global.db.data.users
  let args = text.trim().split(/\s+/)
  let jumlah = parseInt(args[1]) || 1000
  let who

  if (m.quoted) {
    who = m.quoted.sender
  } else if (m.mentionedJid && m.mentionedJid.length) {
    who = m.mentionedJid[0]
  } else if (args[0].match(/^\d{5,}$/)) {
    who = args[0].replace(/\D/g, '') + '@s.whatsapp.net'
  }

  if (!who) throw 'Tag, reply, atau masukkan nomor user!'

  if (!users[who]) users[who] = { limit: 0 }
  users[who].limit += jumlah

  conn.reply(
    m.chat,
    `✅ *DONE*\n\n👤 User: @${who.split('@')[0]}\n➕ Limit: +${jumlah}`,
    m,
    { mentions: [who] }
  )
}

handler.rowner = true

export { pluginConfig as config, handler };
