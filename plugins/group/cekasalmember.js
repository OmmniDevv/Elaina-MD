/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "cekasalmember",
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

const handler = async (m, { conn, mess }) => {
  if (!m.isGroup) return m.reply(mess.group);

  const participants = await conn.groupMetadata(m.chat).then(res => res.participants);

  let countIndonesia = 0;
  let countMalaysia = 0;
  let countUSA = 0;
  let countOther = 0;

  for (const p of participants) {
    const phone = p.id.split('@')[0];
    if (phone.startsWith("62")) countIndonesia++;
    else if (phone.startsWith("60")) countMalaysia++;
    else if (phone.startsWith("1")) countUSA++;
    else countOther++;
  }

  const msg = `Jumlah Anggota Grup Berdasarkan Negara:

• Indonesia: ${countIndonesia} 🇮🇩
• Malaysia: ${countMalaysia} 🇲🇾
• USA: ${countUSA} 🇺🇸
• Lainnya: ${countOther} 🌍`;

  m.reply(msg);
};

export { pluginConfig as config, handler };
