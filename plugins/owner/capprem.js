/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getPlugin } from "../../src/lib/elaina-plugins.js";
import { getDatabase } from "../../src/lib/elaina-database.js";

const config = {
  name: "capprem",
  alias: ["cappremium", "setprem"],
  category: "owner",
  description: "Mengecap banyak fitur sekaligus menjadi premium",
  usage: ".capprem <nama_fitur1> <nama_fitur2> ...",
  example: ".capprem hd jpm warn",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 0,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  if (m.args.length === 0) {
    return m.reply(
      `💎 *SISTEM CAP PREMIUM*\n\n` +
      `Sistem eksklusif untuk mengubah status akses banyak fitur sekaligus menjadi Premium.\n\n` +
      `*PENGGUNAAN:*\n` +
      `- *${m.prefix}capprem <nama_fitur1> <nama_fitur2> ...* — Bisa banyak sekaligus\n\n` +
      `*CONTOH PENGGUNAAN:*\n` +
      `- *${m.prefix}capprem hd jpm warn*\n\n` +
      `*PENJELASAN:*\n` +
      `Masukkan satu atau lebih nama fitur yang ingin dijadikan Premium. Pisahkan dengan spasi.`
    );
  }

  await m.react("🕕");
  
  const db = getDatabase();
  const overrides = db.setting("capprem") || {};
  
  let successList = [];
  let failedList = [];
  
  for (const cmd of m.args) {
    const targetCommand = cmd.toLowerCase();
    const plugin = getPlugin(targetCommand);
    if (!plugin) {
      failedList.push(targetCommand);
    } else {
      overrides[plugin.config.name] = true;
      successList.push(plugin.config.name);
    }
  }
  
  db.setting("capprem", overrides);
  await db.save();

  await m.react("✅");
  
  let msg = `✅ *STATUS BERHASIL DIUBAH*\n\n`;
  if (successList.length > 0) {
    msg += `*Berhasil (PREMIUM 💎):*\n${successList.map(f => `- ${f}`).join("\n")}\n\n`;
  }
  if (failedList.length > 0) {
    msg += `*Gagal (Tidak ditemukan):*\n${failedList.map(f => `- ${f}`).join("\n")}\n\n`;
  }
  
  msg += `_Fitur di atas (yang berhasil) sekarang hanya bisa diakses oleh member Premium._`;
  
  return m.reply(msg.trim());
}

export { config, handler };
