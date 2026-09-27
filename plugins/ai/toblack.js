/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import { uploadImage } from "../../src/lib/elaina-uploader.js";
import { f } from "../../src/lib/elaina-http.js";
import te from "../../src/lib/elaina-error.js";
import { live3d } from "../../src/scraper/seaart.js";
const pluginConfig = {
  name: "toblack",
  alias: ["black", "hitamkan", "hitam", "tohitam"],
  category: "ai",
  description: "Ubah gambar ke skin tone lebih gelap",
  usage: ".toblack (reply gambar)",
  example: ".toblack",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 30,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const isImage = m.isImage || (m.quoted && m.quoted.type === "imageMessage");

  if (!isImage) {
    return m.reply(
      `🖤 *ʙʟᴀᴄᴋ sᴛʏʟᴇ*\n\n> Kirim/reply gambar\n\n\`${m.prefix}toblack\``,
    );
  }

  const PROMPT = `Transform skin tone to a darker complexion, maintain facial features, realistic shadows, high detail, natural skin texture, no distortion`;

  try {
    let buffer;
    if (m.quoted && m.quoted.isMedia) {
      buffer = await m.quoted.download();
    } else if (m.isMedia) {
      buffer = await m.download();
    }

    if (!buffer) {
      m.react("❌");
      return m.reply(`❌ Gagal mendownload gambar`);
    }

    const result = await live3d(buffer, PROMPT);

    m.react("✅");

    await sock.sendMedia(m.chat, result.image, null, m, {
      type: "image",
    });
  } catch (error) {
    console.log(error);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
