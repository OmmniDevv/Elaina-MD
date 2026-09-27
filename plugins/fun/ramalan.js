/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "ramal",
  alias: [],
  category: "fun",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { text }) {
  const nama = text || m.pushName || 'Kamu'

  const ramalan = [
    '💸 Akan jadi sultan dadakan dari giveaway yang gak sengaja diikutin.',
    '💔 Akan ditikung sahabat sendiri, tapi tetap ikhlas karena jodoh gak ke mana.',
    '🛌 Kamu akan tidur 14 jam dan bangun tetap capek.',
    '📱 HP kamu akan jatuh tapi nggak lecet. Cuma mental kamu yang retak.',
    '🎓 Kamu akan lulus... dari hubungan tanpa kejelasan.',
    '📉 Akan investasi kripto, tapi malah beli token tipu-tipu.',
    '🛍️ Kamu akan belanja banyak, tapi lupa bayar listrik.',
    '👽 Alien bakal culik kamu karena mengira kamu spesies langka.',
    '💘 Akan jatuh cinta sama orang yang ngira kamu bot.',
    '😂 Kamu akan ketawa hari ini gara-gara baca pesan ini.'
  ]

  const hasil = ramalan[Math.floor(Math.random() * ramalan.length)]
  m.reply(`🔮 *Ramalan Masa Depan*\n\n${nama}, ${hasil}`)
}

export { pluginConfig as config, handler };
