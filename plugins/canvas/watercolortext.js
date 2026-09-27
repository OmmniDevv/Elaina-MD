/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from "../../src/lib/elaina-error.js";
import config from "../../config.js";
import axios from "axios";

const pluginConfig = {
  name: "watercolortext",
  alias: ["watercolor", "wctext"],
  category: "canvas",
  description: "Buat gambar teks dengan efek watercolor",
  usage: ".watercolortext <teks>",
  example: ".watercolortext RIMURU",
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
      `🎨 *ᴡᴀᴛᴇʀᴄᴏʟᴏʀ ᴛᴇxᴛ*\n\n> Masukkan teks yang ingin dijadikan gambar\n\n\`Contoh: ${m.prefix}watercolortext RIMURU\``,
    );
  }

  m.react("🕕");

  try {
    const url = `https://api.cuki.biz.id/api/ephoto/watercolortext?apikey=${config.APIkey.cuki}&query=${encodeURIComponent(text)}`;
    
    // Mengunduh gambar langsung (response type image)
    const { data } = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000
    });

    const imageBuffer = Buffer.from(data, 'binary');

    m.react("✅");
    await sock.sendMessage(m.chat, { 
      image: imageBuffer, 
      caption: `🎨 *Water Color Text*\n\nTeks: ${text}` 
    }, { quoted: m });
  } catch (error) {
    console.log(error);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
