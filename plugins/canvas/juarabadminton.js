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
  name: "juarabadminton",
  alias: ["sertifikatbadminton", "badmintoncert", "badminton"],
  category: "canvas",
  description: "Membuat sertifikat Juara Badminton kustom",
  usage: ".juarabadminton <nama>",
  example: ".juarabadminton Alex",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

// 🔑 API Key Theresav
const THERESAV_KEY = "4ZtwE";

async function handler(m, { sock }) {
  const fullText = (m.text || m.body || "").trim();
  const prefix = m.prefix || ".";

  // Parsing nama dari argumen
  const inputName = fullText.replace(/^[\/.!#]?(juarabadminton|sertifikatbadminton|badmintoncert|badminton)\s*/i, "").trim();

  if (!inputName) {
    return m.reply(
      `🏸 *ᴊᴜᴀʀᴀ ʙᴀᴅᴍɪɴᴛᴏɴ ᴄᴇʀᴛɪғɪᴄᴀᴛᴇ*\n\n` +
      `> *Penggunaan:* \`${prefix}juarabadminton <Nama>\`\n` +
      `> *Contoh:* \`${prefix}juarabadminton Alex\``
    );
  }

  await m.react("🏸");

  try {
    const targetUrl = `https://api.theresav.biz.id/canvas/cbadminton`;

    const res = await axios.get(targetUrl, {
      params: {
        text: inputName,
        apikey: THERESAV_KEY
      },
      responseType: "arraybuffer",
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      timeout: 20000
    });

    const imageBuffer = Buffer.from(res.data);

    await m.react("✅");

    // Kirim gambar polosan
    return await sock.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `🏸 *Certificate of Badminton* for *${inputName}*`
    }, { quoted: m });

  } catch (error) {
    console.error("[Juara Badminton Error]:", error?.message);
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
