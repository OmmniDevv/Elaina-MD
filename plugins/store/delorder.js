/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "delorder",
  alias: [],
  category: "store",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { args }) {
  let orders = global.db.data.store?.orders || []
  if (!orders.length) return m.reply('Tidak ada order.')

  let no = parseInt(args[0])
  if (!no || no < 1 || no > orders.length) {
    return m.reply('❗ Contoh: .delorder 1')
  }

  let del = orders.splice(no - 1, 1)[0]
  m.reply(`✅ Order *${del.barang}* berhasil dihapus dari antrian.`)
}

export { pluginConfig as config, handler };
