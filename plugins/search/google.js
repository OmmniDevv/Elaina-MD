/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { GoogleSearch } from "../../src/scraper/google.js";

const pluginConfig = {
  name: "google",
  alias: ["gsearch", "googlenews"],
  category: "search",
  description: "Cari berita di Google News",
  usage: ".google <query>",
  example: ".google gempa hari ini",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m) {
  const query = m.text?.trim();

  if (!query) {
    m.react("❌");
    return m.reply(
      `🔍 *Google News*\n\n` +
        `Cari berita terbaru dari Google News.\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}google <topik>*\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}google gempa hari ini*\n` +
        `> *${m.prefix}google teknologi terbaru*`,
    );
  }

  m.react("🕕");

  try {
    const result = await GoogleSearch(query);

    if (!result.status) {
      m.react("☢");
      return m.reply(`❌ *Google Gagal*\n\n> ${result.error}`);
    }

    const items = result.results.slice(0, 10);

    if (items.length === 0) {
      m.react("☢");
      return m.reply(`❌ Nggak nemu hasil buat: *${query}*`);
    }

    let txt = `🔍 *Google News*\n\n`;
    txt += `> Pencarian: *${query}*\n\n`;

    items.forEach((item) => {
      txt += `*${item.index_node}.* ${item.resource_title}\n`;
      txt += `   ├ 📰 ${item.origin_node}\n`;
      txt += `   ├ 🕐 ${item.temporal_stamp}\n`;
      txt += `   └ 🔗 ${item.resolved_endpoint}\n\n`;
    });

    m.reply(txt.trim());
    m.react("✅");
  } catch (e) {
    console.error(e);
    m.react("☢");
    m.reply("❌ Gagal mencari di Google, coba lagi nanti");
  }
}

export { pluginConfig as config, handler };
