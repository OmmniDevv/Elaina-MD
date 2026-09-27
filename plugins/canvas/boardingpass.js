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
  name: "boardingpass",
  alias: ["nasapass", "boarding"],
  category: "canvas",
  description: "Membuat tiket NASA Boarding Pass kustom",
  usage: ".boardingpass <nama>",
  example: ".boardingpass Alex",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

// 🔑 API Key Zelapi
const ZELAPI_KEY = "zelapi-u43ihyj";

async function handler(m, { sock }) {
  const fullText = (m.text || m.body || "").trim();
  const prefix = m.prefix || ".";

  // Parsing nama dari argumen
  const inputName = fullText.replace(/^[\/.!#]?(boardingpass|nasapass|boarding)\s*/i, "").trim();

  if (!inputName) {
    return m.reply(
      `🚀 *ɴᴀsᴀ ʙᴏᴀʀᴅɪɴɢ ᴘᴀss*\n\n` +
      `> *Penggunaan:* \`${prefix}boardingpass <Nama>\`\n` +
      `> *Contoh:* \`${prefix}boardingpass Alex\``
    );
  }

  await m.react("🎫");

  try {
    const targetUrl = `https://zelapi.eu.cc/canvas/boardingpass`;

    const res = await axios.get(targetUrl, {
      params: {
        name: inputName,
        apikey: ZELAPI_KEY
      },
      responseType: "arraybuffer",
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      timeout: 20000
    });

    const imageBuffer = Buffer.from(res.data);

    await m.react("✅");

    // Kirim langsung berupa Gambar Polosan
    return await sock.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `🚀 *NASA Boarding Pass* for *${inputName}*`
    }, { quoted: m });

  } catch (error) {
    console.error("[Boarding Pass Error]:", error?.message);
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
