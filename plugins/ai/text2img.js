/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import { f } from "../../src/lib/elaina-http.js";
import te from "../../src/lib/elaina-error.js";
import config from "../../config.js";
const pluginConfig = {
  name: "text2img",
  alias: [],
  category: "ai",
  description: "Buat gambar dari teks",
  usage: ".text2img <teks>",
  example: ".text2img Buat gambar dari teks",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.args.join(" ");
  if (!text) {
    return m.reply(
      `📿 *ᴛᴇxᴛ ᴛᴏ ɪᴍᴀɢᴇ*\n\n> Masukkan teks\n\n\`Contoh: ${m.prefix}text2img Buat gambar dari teks\``,
    );
  }

  m.react("🕕");

  try {
    const url = `https://firefly.maiku.my.id/api/deepai?apikey=${config.APIkey.firefly}&prompt=${encodeURIComponent(text)}`;
    const data = await axios.get(url);

    const content = data.data.data.output_url;

    m.react("✅");
    await sock.sendMedia(m.chat, content, text, m, {
      type: "image",
    });
  } catch (error) {
    console.error(error);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
