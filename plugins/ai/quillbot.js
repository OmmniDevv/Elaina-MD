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
  name: "quilbot",
  alias: ["quillbot", "parafrase"],
  category: "ai",
  description: "AI Quillbot untuk menulis ulang atau menyempurnakan kalimat",
  usage: ".quilbot <teks>",
  example: ".quilbot Saya sedang makan nasi di rumah",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.args.join(" ") || m.text?.trim();

  if (!text) {
    return m.reply("❌ Masukkan teks yang ingin disempurnakan.\n\nContoh: `.quilbot Saya sedang makan nasi di rumah`");
  }

  await m.react("🕕");

  try {
    const apiUrl = `https://api.nexray.eu.cc/ai/quillbot?text=${encodeURIComponent(text)}`;
    const res = await axios.get(apiUrl, {
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    const data = res.data;
    if (!data.status || !data.result) {
      await m.react("❌");
      return m.reply("⚠️ Quillbot gagal memproses teks.");
    }

    await m.reply(data.result);
    await m.react("✅");

  } catch (error) {
    console.error("[Quillbot]", error.message);
    await m.react("☢");
    m.reply("😔 Terjadi kesalahan saat memproses teks ke Quillbot.");
  }
}

export { pluginConfig as config, handler };
