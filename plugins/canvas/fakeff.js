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
  name: "fakeff",
  alias: [],
  category: "canvas",
  description: "Bikin gambar banner Fake FF (Solo)",
  usage: ".fakeff <teks>|[bgNum]",
  example: ".fakeff Fauzan|2",
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
    const fontBuffer = await axios.get("https://files.catbox.moe/knb2k0.otf", { responseType: "arraybuffer" }).then(r => r.data);
    GlobalFonts.register(Buffer.from(fontBuffer), "TeutonNormal");
    isFontLoaded = true;
}

async function handler(m, { sock }) {
  await loadFont();
  const input = m.text?.trim();
  if (!input) {
    return m.reply(`⚠️ Harap masukkan teksnya!\nContoh: \`${m.prefix}${m.command} Fauzan|2\``);
  }

  const [text, bgNum] = input.split("|");
  if (!text) {
    return m.reply(`⚠️ Harap masukkan teksnya!`);
  }

  await m.react("🕕");
  
  try {
    const githubBaseUrl = "https://raw.githubusercontent.com/Raavfy-24/Maker/refs/heads/main";
    const max = 60;
    const getBackgroundUrl = (idx) => `${githubBaseUrl}/FAKE%20FF%20SOLO/${idx + 1}.png`;

    let index = Math.floor(Math.random() * max);
    if (bgNum) {
      const pick = bgNum.trim().toLowerCase();
      if (pick === "rand" || pick === "random") {
        index = Math.floor(Math.random() * max);
      } else {
        const n = parseInt(pick);
        if (!isNaN(n) && n >= 1 && n <= max) index = n - 1;
      }
    }

    const bgBuffer = await axios.get(getBackgroundUrl(index), { responseType: "arraybuffer" }).then(r => r.data);
    const bg = await loadImage(Buffer.from(bgBuffer));
    
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    let fontSize = 50;
    if (text.length > 12) fontSize = Math.max(26, fontSize - (text.length - 12) * 2);

    const x = 582;
    const y = canvas.height - 378;

    ctx.textAlign = "center";
    ctx.font = `bold ${fontSize}px "TeutonNormal"`;
    
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.lineWidth = 1.8;
    ctx.strokeText(text, x, y);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, x, y);

    ctx.fillStyle = "#ffb300";
    ctx.fillText(text, x, y);

    const buffer = await canvas.encode("png");
    await sock.sendMessage(m.chat, { image: buffer, caption: "🎮 *Fake FF*" }, { quoted: m });
    await m.react("✅");

  } catch (err) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
