/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "cecanjapan",
  alias: [],
  category: "random",
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

async function handler(m, { sock }) {
    const conn = sock;
  try {
    let url = 'https://api.siputzx.my.id/api/r/cecan/japan'
    let caption = `🇯🇵 *Random Cecan Jepang*\nManisnya bikin pengen liburan ke Tokyo 😳`

    await conn.sendFile(m.chat, url, 'cecan-japan.jpg', caption, m)
  } catch (e) {
    console.error(e)
    m.reply(`❌ Gagal ambil gambar cecan Jepang.\n${e}`)
  }
}

export { pluginConfig as config, handler };
