/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getAllPlugins } from "../../src/lib/elaina-plugins.js";
import { getDatabase } from "../../src/lib/elaina-database.js";

const config = {
  name: "fiturpremium",
  alias: ["listprem", "listpremium", "fiturprem"],
  category: "info",
  description: "Melihat daftar seluruh fitur premium bot",
  usage: ".fiturpremium",
  example: ".fiturpremium",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  await m.react("🕕");

  const db = getDatabase();
  const overrides = db.setting("capprem") || {};
  const allPlugins = getAllPlugins();
  
  let premiumFeatures = [];
  
  for (const plugin of allPlugins) {
    if (plugin && plugin.config && plugin.config.name) {
      const isPremium = overrides[plugin.config.name] !== undefined 
        ? overrides[plugin.config.name] 
        : plugin.config.isPremium;
        
      if (isPremium) {
        premiumFeatures.push(plugin.config.name);
      }
    }
  }
  
  if (premiumFeatures.length === 0) {
    await m.react("✅");
    return m.reply(
      `📝 *DAFTAR FITUR PREMIUM*\n\n` +
      `Saat ini belum ada fitur yang terdaftar sebagai fitur premium eksklusif.`
    );
  }
  
  premiumFeatures.sort(); // Urutkan sesuai abjad
  
  let listText = premiumFeatures.map((f) => `- ${f}`).join("\n");
  
  await m.react("✅");
  return m.reply(
    `💎 *DAFTAR FITUR PREMIUM*\n\n` +
    `Berikut adalah seluruh daftar fitur eksklusif yang hanya bisa diakses oleh member berstatus Premium:\n\n` +
    `${listText}\n\n` +
    `_Untuk berlangganan premium, silakan hubungi owner._`
  );
}

export { config, handler };
