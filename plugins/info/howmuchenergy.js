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
  name: "howmuchenergy",
  alias: ["cekenergi"],
  category: "info",
  description: "Mengecek penggunaan energi banyak fitur sekaligus",
  usage: ".howmuchenergy <nama_fitur1> <nama_fitur2> ...",
  example: ".howmuchenergy hd jpm",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  if (m.args.length === 0) {
    return m.reply(
      `🔍 *PENGECEKAN ENERGI FITUR*\n\n` +
      `Sistem untuk mengetahui berapa besar potongan energi yang dibutuhkan untuk menggunakan satu atau banyak fitur sekaligus.\n\n` +
      `*PENGGUNAAN:*\n` +
      `- *${m.prefix}howmuchenergy <nama_fitur1> <nama_fitur2> ...*\n\n` +
      `*CONTOH PENGGUNAAN:*\n` +
      `- *${m.prefix}howmuchenergy hd jpm*\n\n` +
      `*PENJELASAN:*\n` +
      `Masukkan perintah beserta satu atau banyak nama fitur yang ingin kamu cek. Pisahkan dengan spasi.`
    );
  }

  await m.react("🕕");
  
  const db = getDatabase();
  const overrides = db.setting("capenergi") || {};
  
  let responseText = `🔋 *DETAIL ENERGI FITUR*\n\n`;
  
  for (const cmd of m.args) {
    const targetCommand = cmd.toLowerCase();
    const plugin = getPlugin(targetCommand);
    
    if (!plugin) {
      responseText += `❌ *${targetCommand}* : Tidak ditemukan!\n\n`;
      continue;
    }
    
    const energiCost = overrides[plugin.config.name] !== undefined 
      ? overrides[plugin.config.name] 
      : (plugin.config.energi || 0);
      
    responseText += `✅ *${plugin.config.name}* : ${energiCost} Energi\n`;
  }

  await m.react("✅");
  return m.reply(responseText.trim());
}

export { config, handler };
