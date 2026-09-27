/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import config from "../../config.js";

const pluginConfig = {
  name: "list",
  alias: ["liststore", "daftar", "info"],
  category: "store",
  description: "📋 Lihat daftar informasi toko",
  usage: ".list atau .list <nomor>",
  example: ".list 1",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const lists = db.setting("storeLists") || [];

  if (lists.length === 0) {
    return m.reply(
      `📋 *Belum Ada Informasi Toko*\n\n` +
        `Saat ini belum ada informasi yang ditambahkan oleh admin 😔\n\n` +
        `Silakan cek kembali nanti atau hubungi admin untuk informasi lebih lanjut.\n\n` +
        `_Terima kasih atas ketertarikan Anda_ 🙏`,
    );
  }

  const input = m.text?.trim();
  const idx = parseInt(input) - 1;

  if (!isNaN(idx) && idx >= 0 && idx < lists.length) {
    const l = lists[idx];
    let txt = `${l.content}`;

    if (l.image) {
      await sock.sendMessage(
        m.chat,
        { image: { url: l.image }, caption: txt },
        { quoted: m },
      );
      return;
    }
    if (l.video) {
      await sock.sendMessage(
        m.chat,
        { video: { url: l.video }, caption: txt },
        { quoted: m },
      );
      return;
    }
    return m.reply(txt);
  }

  let txt = `📋 *DAFTAR INFORMASI TOKO*\n\n`;
  txt += `Berikut informasi yang tersedia saat ini 📝\n`;
  txt += `Ketik \`${m.prefix}list <nomor>\` untuk melihat detail.\n\n`;

  for (let i = 0; i < lists.length; i++) {
    const l = lists[i];
    const mediaIcon = l.image ? "🖼️" : l.video ? "🎬" : "📝";
    txt += `*${i + 1}.* ${mediaIcon} *${l.name}*\n`;
  }
  txt += "\n";

  txt += `💡 _Ketik \`${m.prefix}list <nomor>\` untuk membaca detail informasi_`;

  await m.reply(txt);
}

export { pluginConfig as config, handler };
