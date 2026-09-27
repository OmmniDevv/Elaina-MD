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
  name: "whatrolethis",
  alias: ["whatrole", "cekrole", "cekakses"],
  category: "info",
  description: "Cek persyaratan akses banyak fitur sekaligus",
  usage: ".whatrolethis <nama_fitur1> <nama_fitur2> ...",
  example: ".whatrolethis hd jpm",
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
      `🔍 *PENGECEKAN AKSES FITUR*\n\n` +
      `Sistem untuk mengetahui detail informasi persyaratan akses sebuah fitur atau beberapa fitur sekaligus.\n\n` +
      `*PENGGUNAAN:*\n` +
      `- *${m.prefix}whatrolethis <nama_fitur1> <nama_fitur2> ...*\n\n` +
      `*CONTOH PENGGUNAAN:*\n` +
      `- *${m.prefix}whatrolethis hd jpm warn*\n\n` +
      `*PENJELASAN:*\n` +
      `Masukkan perintah beserta satu atau banyak nama fitur yang ingin kamu cek. Pisahkan dengan spasi.`
    );
  }

  await m.react("🕕");
  
  const db = getDatabase();
  const overrides = db.setting("capprem") || {};
  
  let responseText = `🔍 *DETAIL AKSES FITUR*\n\n`;
  
  for (const cmd of m.args) {
    const targetCommand = cmd.toLowerCase();
    const plugin = getPlugin(targetCommand);
    
    if (!plugin) {
      responseText += `❌ *${targetCommand}* : Tidak ditemukan!\n\n`;
      continue;
    }
    
    const isPremium = overrides[plugin.config.name] !== undefined 
      ? overrides[plugin.config.name] 
      : plugin.config.isPremium;
    
    let roles = [];
    
    if (plugin.config.isOwner) roles.push("Owner Only 👑");
    if (plugin.config.isAdmin) roles.push("Admin Grup 👮");
    if (plugin.config.isBotAdmin) roles.push("Bot Admin 🤖");
    if (plugin.config.isGroup) roles.push("Grup Only 👥");
    if (plugin.config.isPrivate) roles.push("Private Chat 📱");
    if (isPremium) roles.push("Premium 💎");
    
    if (roles.length === 0) {
      roles.push("Free / Semua Orang 🆓");
    }
    
    let listRoles = roles.map(r => `  - ${r}`).join("\n");
    responseText += `✅ *${plugin.config.name}*\n${listRoles}\n\n`;
  }

  await m.react("✅");
  return m.reply(responseText.trim());
}

export { config, handler };
