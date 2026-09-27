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
  name: "sologo",
  alias: ["ailogo", "bikinlogo"],
  category: "ai",
  description: "Membuat logo menggunakan AI dari teks (prompt)",
  usage: ".sologo <prompt>",
  example: ".sologo Kucing lucu warna biru",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const prompt = m.text?.trim() || m.args.join(" ");

  if (!prompt) {
    return m.reply("❌ Masukkan deskripsi logo yang ingin dibuat.\n\nContoh: `.sologo robot keren warna merah`");
  }

  await m.react("🕕");

  try {
    const apiUrl = `https://api.nexray.eu.cc/ai/sologo?prompt=${encodeURIComponent(prompt)}`;
    const res = await axios.get(apiUrl, {
      timeout: 120000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    const data = res.data;
    if (!data.status || !data.result || data.result.length === 0) {
      await m.react("❌");
      return m.reply("⚠️ AI gagal membuat logo. Coba gunakan prompt (deskripsi) yang lain.");
    }

    const logo = data.result[0];

    const caption = `🎨 *SOLOGO AI* 🎨\n\n` +
      `*Prompt:* ${prompt}\n` +
      `*Judul:* ${logo.title}\n` +
      `*Deskripsi:* ${logo.desc}\n` +
      `*Tipe:* ${logo.logo_type || "origin"}`;

    await sock.sendMessage(m.chat, {
      image: { url: logo.thumbnail },
      caption: caption
    }, { quoted: m });

    await m.react("✅");

  } catch (error) {
    console.error("[SoLogo AI]", error.message);
    await m.react("☢");
    m.reply("😔 Terjadi kesalahan saat memproses permintaan ke AI.");
  }
}

export { pluginConfig as config, handler };
