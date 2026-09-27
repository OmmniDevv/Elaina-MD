/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "tagadmin",
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

async function handler(m, { sock, participants, text }) {
    const conn = sock;
  if (!m.isGroup) throw '…ini bukan grup.'

  let admins = participants
    .filter(v => v.admin)
    .map(v => v.id)

  if (!admins.length) throw '…adminnya hilang? aneh.'

  let alasan = text ? `\n\nalasan: ${text}` : ''

  let teks = `🎸 *tag admin dulu deh...*\n\n`
  teks += admins.map(v => `@${v.split('@')[0]}`).join('\n')
  teks += `${alasan}\n\n_...cepet respon ya._`

  await conn.sendMessage(m.chat, {
    text: teks,
    mentions: admins
  }, { quoted: m })
}

export { pluginConfig as config, handler };
