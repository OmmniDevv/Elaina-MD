/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "gag",
  alias: ["growagarden", "gaginfo"],
  category: "info",
  description: "Menampilkan informasi stok Grow a Garden",
  usage: ".gag",
  example: ".gag",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  await m.react("🕕");

  try {
    const res = await axios.get("https://api.nexray.eu.cc/information/growagarden", {
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    const data = res.data;
    if (!data.status || !data.result) {
      await m.react("❌");
      return m.reply("⚠️ Gagal mengambil informasi Grow a Garden saat ini.");
    }

    const r = data.result;

    const formatStock = (arr, title) => {
      if (!arr || arr.length === 0) return "";
      let txt = `*${title}*\n`;
      arr.forEach(item => {
        txt += `- ${item.name}: ${item.value}\n`;
      });
      return txt + "\n";
    };

    let caption = `🌱 *GROW A GARDEN INFO* 🌱\n\n`;

    caption += formatStock(r.gearStock, "⚙️ Gear Stock");
    caption += formatStock(r.eggStock, "🥚 Egg Stock");
    caption += formatStock(r.eventStock, "🎟️ Event Stock");
    caption += formatStock(r.cosmeticsStock, "👕 Cosmetics Stock");
    caption += formatStock(r.seedsStock, "🌾 Seeds Stock");
    caption += formatStock(r.merchantsStock, "🏪 Merchants Stock");

    if (r.lastSeen && r.lastSeen.length > 0) {
      caption += `*👀 Last Seen*\n`;
      r.lastSeen.slice(0, 5).forEach(item => {
        caption += `- ${item.name}: ${item.seen}\n`;
      });
    }

    await m.reply(caption.trim());
    await m.react("✅");

  } catch (error) {
    console.error("[GAG Info]", error.message);
    await m.react("☢");
    m.reply("😔 Terjadi kesalahan saat mengambil data GAG.");
  }
}

export { pluginConfig as config, handler };
