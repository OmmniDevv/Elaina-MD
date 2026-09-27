/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from "../../config.js";
import te from "../../src/lib/elaina-error.js";
import rimuruApi from "../../src/lib/elaina-apimanager.js";

const pluginConfig = {
  name: "melolo",
  alias: ["melolodrama", "dramamelolo"],
  category: "search",
  description: "Cari daftar drama pendek berdasarkan kategori dari Melolo",
  usage: ".melolo <category>",
  example: ".melolo fantasy",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 8,
  energi: 1,
  isEnabled: true,
};

function trimText(text, max = 90) {
  const value = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!value) return "-";
  if (value.length <= max) return value;
  return value.slice(0, max) + "...";
}

function normalizeResults(data) {
  const groups = [];

  for (const [section, items] of Object.entries(data || {})) {
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      groups.push({
        section,
        title: item?.title || "-",
        url: item?.url || "-",
        image: item?.image || "",
        rating: item?.rating || "-",
        episodes: item?.episodes || "-",
      });
    }
  }

  return groups;
}

async function fetchMelolo(category) {
  const data = await rimuruApi.covenant.meloloCategory(category, {
    timeout: 30000,
  });

  if (!data?.status || !data?.data) {
    throw new Error(data?.message || "Hasil Melolo tidak ditemukan");
  }

  return data;
}

async function handler(m, { sock }) {
  const category = m.text?.trim();

  if (!category) {
    return m.reply(
      `🎭 *MELOLO DRAMA*\n\n> Contoh:\n\`${m.prefix}melolo fantasy\``,
    );
  }

  if (!config.APIkey?.covenant) {
    return m.reply("❌ API key covenant tidak dikonfigurasi!");
  }

  m.react("🔍");

  try {
    const result = await fetchMelolo(category);
    const items = normalizeResults(result.data).slice(0, 10);

    if (items.length === 0) {
      m.react("❌");
      return m.reply(
        `❌ Tidak ditemukan hasil Melolo untuk kategori: ${category}`,
      );
    }

    let caption = "🎭 *MELOLO DRAMA*\n\n";
    caption += `🌿 *Category:* ${category}\n`;
    caption += `📦 *Total:* ${items.length}\n`;
    caption += `💳 *Cost:* ${result?.usage?.cost ?? "-"}\n`;
    caption += `🔋 *Sisa Credit:* ${result?.usage?.remaining ?? "-"}\n\n`;

    items.forEach((item, index) => {
      caption += `*${index + 1}.* ${trimText(item.title, 70)}\n`;
      caption += `   ├ 📂 ${trimText(item.section, 32)}\n`;
      caption += `   ├ ⭐ ${item.rating || "-"}\n`;
      caption += `   ├ 📝 ${trimText(item.episodes, 110)}\n`;
      caption += `   └ ${item.url}\n\n`;
    });

    const cover = items.find((item) => item.image)?.image;
    if (cover) {
      await sock.sendMedia(m.chat, cover, caption.trim(), m, {
        type: "image",
      });
    } else {
      await m.reply(caption.trim());
    }

    m.react("✅");
  } catch (error) {
    m.react("☢");
    const message = error?.response?.data?.message || error?.message;
    if (message) {
      return m.reply(`❌ ${message}`);
    }
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
