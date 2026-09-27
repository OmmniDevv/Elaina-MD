/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "kimi",
  alias: [],
  category: "ai",
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
  if (!text) return m.reply('Masukkan pertanyaan!\nContoh: .kimi apa itu bot wa')

  try {
    let res = await fetch(`https://api.zenzxz.my.id/api/ai/kimi?query=${encodeURIComponent(text)}`)
    let json = await res.json()
    let hasil = json?.data?.response || json?.response || 'Tidak ada respons dari AI.'
    m.reply(hasil)
  } catch (e) {
    m.reply('yahh error.')
  }
}

export { pluginConfig as config, handler };
