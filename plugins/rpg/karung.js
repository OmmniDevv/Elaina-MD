/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
  name: "karung",
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

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m) => {
  let user = global.db.data.users[m.sender]
  if (!user) return

  user.botol = user.botol || 0
  user.kardus = user.kardus || 0
  user.kaleng = user.kaleng || 0
  user.gelas = user.gelas || 0
  user.plastik = user.plastik || 0

  let isi = [
    ['botol', '🧴 Botol'],
    ['kardus', '📦 Kardus'],
    ['kaleng', '🥫 Kaleng'],
    ['gelas', '🥛 Gelas'],
    ['plastik', '🛍️ Plastik']
  ]
  .map(([k, label]) => user[k] > 0 ? `${label}: ${user[k]}` : null)
  .filter(Boolean)
  .join('\n')

  let teks = isi
    ? `📮 *ISI KARUNG KAMU*\n\n${isi}`
    : '📮 Karung kamu masih kosong!'

  m.reply(teks)
}

handler.register = true

export { pluginConfig as config, handler };
