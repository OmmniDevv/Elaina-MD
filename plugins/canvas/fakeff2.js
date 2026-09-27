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
  name: "fakeff2",
  alias: [],
  category: "canvas",
  description: "Bikin gambar banner Fake FF (Solo 2)",
  usage: ".fakeff2 <teks>|[bgNum]",
  example: ".fakeff2 Fauzan|2",
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
    const backgrounds = [
      "https://c.termai.cc/i139/c3AE.png",
      "https://c.termai.cc/i190/1Bl.png",
      "https://c.termai.cc/i127/BGpc9R.png",
      "https://c.termai.cc/i111/PiZ7.png",
      "https://c.termai.cc/i139/r9kbes.png",
      "https://c.termai.cc/i102/Sg6Y.png",
      "https://c.termai.cc/i101/08JOs0.png",
      "https://c.termai.cc/i166/AYfQRT.png",
      "https://c.termai.cc/i120/pJoap1K.png",
      "https://c.termai.cc/i176/6ZBF.png",
      "https://c.termai.cc/i104/IMs.png",
      "https://c.termai.cc/i102/LKC.png",
      "https://c.termai.cc/i152/UQsC.png",
      "https://c.termai.cc/i164/owW1J.png",
      "https://c.termai.cc/i180/bPl01wI.png",
      "https://c.termai.cc/i187/qEz.png",
      "https://c.termai.cc/i169/iYMybl.png",
      "https://c.termai.cc/i149/8n6.png",
      "https://c.termai.cc/i193/vp6.png",
      "https://c.termai.cc/i106/9RvfDi.png",
      "https://c.termai.cc/i144/cOYfeO.png",
      "https://c.termai.cc/i164/09Fl.png",
      "https://c.termai.cc/i170/6Vp6Qja.png",
      "https://c.termai.cc/i177/nMwo.png",
      "https://c.termai.cc/i149/cvx1wmH.png",
      "https://c.termai.cc/i173/n9YxdU.png",
      "https://c.termai.cc/i113/8wiCPNx.png",
      "https://c.termai.cc/i155/yBerT.png",
      "https://c.termai.cc/i136/pHN5eK.png",
      "https://c.termai.cc/i144/DXA.png"
    ];

    let index = Math.floor(Math.random() * backgrounds.length);
    if (bgNum) {
      const n = parseInt(bgNum.trim());
      if (!isNaN(n) && n >= 1 && n <= backgrounds.length) {
        index = n - 1;
      }
    }

    const bgBuffer = await axios.get(backgrounds[index], { responseType: "arraybuffer" }).then(r => r.data);
    const bg = await loadImage(Buffer.from(bgBuffer));
    
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    let fontSize = 50;
    if (text.length > 12) {
      fontSize = Math.max(26, fontSize - (text.length - 12) * 2);
    }

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
    await sock.sendMessage(m.chat, { image: buffer, caption: "🎮 *Fake FF 2*" }, { quoted: m });
    await m.react("✅");

  } catch (err) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
