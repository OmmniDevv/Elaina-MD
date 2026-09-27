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
  name: "simi",
  alias: ["simisimi"],
  category: "ai",
  description: "Ngobrol santai bareng SimiSimi",
  usage: ".simi <pesan>",
  example: ".simi Halo Simi!",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.args.join(" ") || m.text?.trim();

  if (!text) {
    return m.reply("❌ Mau ngobrol apa sama Simi?\n\nContoh: `.simi Halo Simi!`");
  }

  await m.react("🕕");

  try {
    const apiUrl = `https://api.nexray.eu.cc/ai/simisimi?text=${encodeURIComponent(text)}`;
    const res = await axios.get(apiUrl, {
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    const data = res.data;
    if (!data.status || !data.result) {
      await m.react("❌");
      return m.reply("⚠️ Simi lagi ngambek, nggak mau balas.");
    }

    await m.reply(data.result);
    await m.react("✅");

  } catch (error) {
    console.error("[SimiSimi]", error.message);
    await m.react("☢");
    m.reply("😔 Simi gagal membalas pesanmu.");
  }
}

export { pluginConfig as config, handler };
