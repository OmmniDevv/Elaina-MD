/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import te from "../../src/lib/elaina-error.js";
import axios from "axios";

const pluginConfig = {
  name: "basket",
  alias: ["basket"],
  category: "canvas",
  description: "Buat gambar basket dengan nama custom",
  usage: ".basket <nama>",
  example: ".basket Fauzan",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

let isFontLoaded = false;
async function loadFont() {
    if (isFontLoaded) return;
    try {
        const fontBuffer = await axios.get("https://files.catbox.moe/8wqg77.ttf", { responseType: "arraybuffer" }).then(r => r.data);
        GlobalFonts.register(Buffer.from(fontBuffer), "ArialBoldBasket");
        isFontLoaded = true;
    } catch (e) {
    }
}

async function handler(m, { sock }) {
  await loadFont();
  const text = m.text?.trim();

  if (!text) {
    return m.reply(`⚠️ Harap masukkan teksnya!\nContoh: \`${m.prefix}${m.command} Fauzan\``);
  }

  if (text.length > 25) {
    return m.reply("⚠️ Nama terlalu panjang! Maksimal 25 karakter.");
  }

  await m.react("🕕");

  try {
    const backgroundUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772229249253.jpeg";
    const bgBuffer = await axios.get(backgroundUrl, { responseType: 'arraybuffer' }).then(r => r.data);
    const bg = await loadImage(Buffer.from(bgBuffer));
    
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    const fontFace = isFontLoaded ? "ArialBoldBasket" : "sans-serif";
    ctx.font = `bold 40px "${fontFace}"`;
    ctx.fillStyle = "#1a1a1a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, (canvas.width / 2) - 110, 545);

    const buffer = await canvas.encode("png");
    
    await sock.sendMessage(m.chat, {
      image: buffer,
      caption: "🏀 Gambar basket berhasil dibuat!"
    }, { quoted: m });

    await m.react("✅");
  } catch (error) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
