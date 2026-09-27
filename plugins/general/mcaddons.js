/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import * as cheerio from "cheerio";

const pluginConfig = {
  name: "mcaddons",
  alias: ["mcmap"],
  category: "general",
  description: "Mencari Minecraft Bedrock addon dan map terbaru",
  usage: ".mcaddons [atau .mcmap]",
  example: ".mcaddons",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function scrape(url) {
  const { data: html } = await axios.get(url, {
    timeout: 20000,
    headers: { "user-agent": "Mozilla/5.0" },
  });
  const $ = cheerio.load(html);
  const results = [];

  $("#contentContainer #addon_rows .content-row-cell").each((_, element) => {
    const title =
      $(element).find(".card-product-title b#product-name").text().trim() ||
      $(element).find(".product-name").text().trim();
    const relativeLink = $(element).find(".product-card").attr("data-href");
    const link = relativeLink
      ? new URL(relativeLink, "https://www.bedrockexplorer.com").href
      : null;
    let image = $(element).find(".product-card-wrapper img").first().attr("src");
    if (image) image = new URL(image, "https://www.bedrockexplorer.com").href;
    const price =
      $(element).find(".price-element b").text().trim() ||
      $(element).find(".price-element").text().trim();

    if (title && link) results.push({ title, link, image, price });
  });

  return results;
}

async function handler(m, { sock }) {
  const isMap = String(m.command || "").toLowerCase() === "mcmap";
  const url = isMap
    ? "https://www.bedrockexplorer.com/queries/free-content/everyone/maps/latest"
    : "https://www.bedrockexplorer.com/discover";
  const label = isMap ? "Free Maps" : "Add-ons";

  try {
    await m.react("⏳");
    const results = await scrape(url);

    if (!results.length) {
      await m.react("❌");
      return m.reply(`⚠️ Tidak ditemukan ${label} terbaru.`);
    }

    let message = `📦 *MINECRAFT BEDROCK — ${label.toUpperCase()}*\n\n`;
    for (const [i, item] of results.slice(0, 5).entries()) {
      message += `*${i + 1}. ${item.title}*\n`;
      message += `🔗 ${item.link}\n`;
      if (item.price) message += `💰 ${item.price}\n`;
      message += "\n";
    }

    await m.react("✅");
    if (results[0].image) {
      return sock?.sendMessage
        ? sock.sendMessage(m.chat, {
            image: { url: results[0].image },
            caption: message.trim(),
          }, { quoted: m })
        : m.reply(message.trim());
    }
    return m.reply(message.trim());
  } catch (error) {
    console.error("[mcaddons]", error);
    await m.react("❌");
    return m.reply(
      `❌ Gagal mengambil data Minecraft Bedrock.\n` +
      `Website sumber mungkin sedang berubah atau tidak bisa diakses.`,
    );
  }
}

export { pluginConfig as config, handler };
