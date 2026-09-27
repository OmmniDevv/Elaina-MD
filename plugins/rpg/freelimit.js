/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "freelimit",
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

async function handler(m, { sock }) {
    const conn = sock;
    let user = global.db.data.users[m.sender]

    if (!user.freelimit) user.freelimit = 0

    const cooldown = 79200000 
    const elapsed = Date.now() - user.freelimit
    const remaining = cooldown - elapsed

    if (elapsed > cooldown) {
        user.limit += 20
        user.freelimit = Date.now()

        m.reply(`✨ Berhasil!\n+20 Limit ditambahkan`)
    } else {
        m.reply(`🎌 Silahkan tunggu *${clockString(remaining)}* untuk mengambil limit kembali`)
    }
}

handler.register = true
function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
    }

export { pluginConfig as config, handler };
