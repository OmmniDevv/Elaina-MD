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
  name: "juaraml",
  alias: [],
  category: "canvas",
  description: "Bikin sertifikat juara Mobile Legends",
  usage: ".juaraml <nama>",
  example: ".juaraml Fauzan",
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
    const fontBuffer = await axios.get("https://files.catbox.moe/8wqg77.ttf", { responseType: "arraybuffer" }).then(r => r.data);
    GlobalFonts.register(Buffer.from(fontBuffer), "Times New Roman");
    isFontLoaded = true;
}

async function handler(m, { sock }) {
  await loadFont();
  const name = m.text?.trim();

  if (!name) {
    return m.reply(`⚠️ Harap masukkan namanya!\nContoh: \`${m.prefix}${m.command} Fauzan\``);
  }

  if (name.length > 50) {
    return m.reply(`⚠️ Nama terlalu panjang! Maksimal 50 huruf.`);
  }

  await m.react("🕕");
  
  try {
    const backgroundUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772230373362.jpeg";
    const bgBuffer = await axios.get(backgroundUrl, { responseType: "arraybuffer" }).then(r => r.data);
    const bg = await loadImage(Buffer.from(bgBuffer));

    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    let fontSize = 45;
    ctx.font = `bold italic ${fontSize}px "Times New Roman"`;
    ctx.fillStyle = "#e6c85e";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let maxTextWidth = 480;
    while (ctx.measureText(name.toUpperCase()).width > maxTextWidth && fontSize > 10) {
      fontSize--;
      ctx.font = `bold italic ${fontSize}px "Times New Roman"`;
    }

    let certX = canvas.width * 0.665;
    let certY = canvas.height * 0.555;

    ctx.save();
    ctx.fillStyle = "#090909";
    ctx.fillRect(certX - 250, certY - 40, 500, 80);
    ctx.restore();

    ctx.fillText(name.toUpperCase(), certX, certY);

    const buffer = await canvas.encode("png");
    await sock.sendMessage(m.chat, { image: buffer, caption: "🏆 *Sertifikat Juara ML*" }, { quoted: m });
    await m.react("✅");

  } catch (err) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
