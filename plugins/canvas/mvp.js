/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage } from "@napi-rs/canvas";
import te from "../../src/lib/elaina-error.js";
import axios from "axios";

const pluginConfig = {
  name: "mvp",
  alias: ["sertifikatmvp", "mvp"],
  category: "canvas",
  description: "Buat sertifikat MVP",
  usage: ".mvp <nama>",
  example: ".mvp Fauzan",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.text?.trim();

  if (!text) {
    return m.reply(`⚠️ Harap masukkan nama!\nContoh: \`${m.prefix}${m.command} Fauzan\``);
  }

  if (text.length > 20) {
    return m.reply("⚠️ Nama terlalu panjang! Maksimal 20 karakter.");
  }

  await m.react("🕕");

  try {
    const backgroundUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772230577235.jpeg";
    
    const response = await axios.get(backgroundUrl, { responseType: 'arraybuffer' });
    const bg = await loadImage(Buffer.from(response.data));

    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.font = "bold 32px sans-serif";
    ctx.fillStyle = "#918A81";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, 640, 530);

    const buffer = await canvas.encode("png");
    
    await sock.sendMessage(m.chat, {
      image: buffer,
      caption: "🎉 Ini dia sertifikat MVP kamu!"
    }, { quoted: m });

    await m.react("✅");
  } catch (error) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
