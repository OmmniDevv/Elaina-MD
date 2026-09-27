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
  name: "capenergi",
  alias: ["setenergi"],
  category: "owner",
  description: "Mengubah potongan energi banyak fitur sekaligus",
  usage: ".capenergi <nama_fitur1> <nama_fitur2> ... <jumlah>",
  example: ".capenergi hd fakedev 5",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 0,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  if (m.args.length < 2) {
    return m.reply(
      `⚙️ *SISTEM CAP ENERGI*\n\n` +
      `Sistem untuk mengubah secara dinamis jumlah energi yang dipotong untuk banyak fitur sekaligus.\n\n` +
      `*PENGGUNAAN:*\n` +
      `- *${m.prefix}capenergi <nama_fitur1> <nama_fitur2> ... <jumlah>*\n\n` +
      `*CONTOH PENGGUNAAN:*\n` +
      `- *${m.prefix}capenergi hd jpm 5* (Fitur HD & JPM memotong 5 energi)\n` +
      `- *${m.prefix}capenergi hd 0* (Fitur HD menjadi gratis energi)\n\n` +
      `*PENJELASAN:*\n` +
      `1. Masukkan satu atau banyak nama fitur yang ingin diubah.\n` +
      `2. Di akhiran (kata terakhir) harus berupa ANGKA (jumlah potongan energi).`
    );
  }

  const rawCost = m.args[m.args.length - 1];
  const cost = parseInt(rawCost);
  
  if (isNaN(cost) || cost < 0) {
    return m.reply(`❌ *GAGAL*\n\nJumlah energi (di argumen paling akhir) harus berupa angka 0 atau lebih.`);
  }

  const commands = m.args.slice(0, -1);

  await m.react("🕕");
  
  const db = getDatabase();
  const overrides = db.setting("capenergi") || {};
  
  let successList = [];
  let failedList = [];
  
  for (const cmd of commands) {
    const targetCommand = cmd.toLowerCase();
    const plugin = getPlugin(targetCommand);
    if (!plugin) {
      failedList.push(targetCommand);
    } else {
      overrides[plugin.config.name] = cost;
      successList.push(plugin.config.name);
    }
  }
  
  db.setting("capenergi", overrides);
  await db.save();

  await m.react("✅");
  
  let msg = `✅ *POTONGAN ENERGI BERHASIL DIUBAH*\n\n`;
  if (successList.length > 0) {
    msg += `*Berhasil diubah jadi ${cost} Energi:*\n${successList.map(f => `- ${f}`).join("\n")}\n\n`;
  }
  if (failedList.length > 0) {
    msg += `*Gagal (Tidak ditemukan):*\n${failedList.map(f => `- ${f}`).join("\n")}\n\n`;
  }
  
  msg += `_Pengaturan tersimpan ke dalam database dan langsung berlaku._`;
  return m.reply(msg.trim());
}

export { config, handler };
