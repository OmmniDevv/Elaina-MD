/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "shopeedl",
  alias: ["shopeevideo", "shopeevid"],
  category: "download",
  description: "Download video dari Shopee",
  usage: ".shopeedl <url>",
  example: ".shopeedl https://shopee.co.id/universal-link/video/...",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

const BASE_URL = "https://shopeenowatermark.com";

async function extract(url) {
  const form = new FormData();
  form.append("url", url);

  const res = await fetch(`${BASE_URL}/api/extract`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Extraction failed");
  return data;
}

function bestStream(streams) {
  const order = ["V1080P", "V720P", "V540P", "V360P", "V1080P_H265", "V720P_H265", "V540P_H265", "V360P_H265"];
  for (const q of order) {
    const s = streams.find(s => s.quality === q);
    if (s) return s;
  }
  return streams[0];
}

async function handler(m, { sock }) {
  const url = m.args[0] || m.text?.trim();

  if (!url || !url.includes("shopee")) {
    return m.reply("❌ Masukkan link video Shopee yang valid.\n\nContoh: `.shopeedl https://shopee.co.id/...`");
  }

  await m.react("🕕");

  try {
    const data = await extract(url);
    if (!data || !data.streams_array || data.streams_array.length === 0) {
      await m.react("❌");
      return m.reply("⚠️ Gagal mengekstrak video. Pastikan link video Shopee sudah benar dan bersifat publik.");
    }

    const best = bestStream(data.streams_array);
    const videoUrl = best.stream_url;

    let caption = `🛍️ *SHOPEE VIDEO DOWNLOADER* 🛍️\n\n`;
    if (data.username) caption += `*Username:* ${data.username}\n`;
    caption += `*Kualitas:* ${best.quality}\n`;
    caption += `\n> Dibuat oleh bot kesayanganmu`;

    await sock.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: caption
    }, { quoted: m });

    await m.react("✅");

  } catch (error) {
    console.error("[Shopee DL]", error.message);
    await m.react("☢");
    m.reply("😔 Gagal mengunduh video dari Shopee.");
  }
}

export { pluginConfig as config, handler };
