/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from "../../config.js";
import te from "../../src/lib/elaina-error.js";
import { drawBrat } from "../../src/lib/elaina-brat.js";

const pluginConfig = {
  name: "bratgreen",
  alias: ["brat2"],
  category: "sticker",
  description: "Membuat sticker brat ijo",
  usage: ".brat2 <text>",
  example: ".brat2 Hai semua",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.args.join(" ").trim();
  if (!text) {
    return m.reply(`🖼️ *BRAT GREEN*\n\n> Masukkan teks\n\n\`Contoh: ${m.prefix}bratgreen Hai semua\``);
  }

  m.react("🕕");

  try {
    const buffer = await drawBrat({
      text,
      bgColor: "#8ACE00",
      width: 512,
      height: 512,
      maxWidth: 450,
      maxHeight: 450,
      centerX: 256,
      centerY: 256,
      maxFontSize: 130,
      fontDecrement: 5,
      lineHeightMult: 1.1,
      textColor: "#000000"
    });

    await sock.sendImageAsSticker(m.chat, buffer, m, {
      packname: config.sticker.packname,
      author: config.sticker.author,
    });
    m.react("✅");
  } catch (error) {
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };