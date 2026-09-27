/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import { downloadMediaMessage, getContentType } from '@rexxhayanasi/elaina-baileys';
import te from "../../src/lib/elaina-error.js";
import axios from "axios";

const pluginConfig = {
  name: "fakedev2",
  alias: [],
  category: "canvas",
  description: "Bikin gambar fakedev 2 dari fotomu",
  usage: ".fakedev2 <teks> (reply/kirim foto)",
  example: ".fakedev2 developer",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

const drawCircularTextBottom = (context, str, cx, cy, rad) => {
  const fontSize = 85;
  const arcSpan = Math.PI * 0.6; 
  const textRadius = rad + 75; 
  const chars = str.toUpperCase().split("");
  const n = chars.length;
  const angleIncrement = n > 1 ? arcSpan / (n - 1) : 0;
  const start = (Math.PI / 2) + (arcSpan / 2);

  context.font = `bold italic ${fontSize}px "Nunito"`;
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";

  for (let i = 0; i < n; i++) {
    const char = chars[i];
    const angle = start - i * angleIncrement;
    const x = cx + Math.cos(angle) * textRadius;
    const y = cy + Math.sin(angle) * textRadius;

    context.save();
    context.translate(x, y);
    context.rotate(angle - Math.PI / 2);
    context.lineWidth = 4;
    context.strokeStyle = "rgba(0,0,0,0.5)";
    context.strokeText(char, 0, 0);
    context.fillText(char, 0, 0);
    context.restore();
  }
};

let isFontLoaded = false;
async function loadFont() {
    if (isFontLoaded) return;
    const fontBuffer = await axios.get("https://files.catbox.moe/76wwjt.ttf", { responseType: "arraybuffer" }).then(r => r.data);
    GlobalFonts.register(Buffer.from(fontBuffer), "Nunito");
    isFontLoaded = true;
}

async function handler(m, { sock }) {
  await loadFont();
  const text = m.text?.trim();
  if (!text) {
    return m.reply(`⚠️ Harap masukkan teksnya!\nContoh: \`${m.prefix}${m.command} Halo\``);
  }

  let media = null;
  const msgObj = m.quoted?.message ? m.quoted : m;
  const type = getContentType(msgObj.message);

  if (!type || type !== "imageMessage") {
    return m.reply(`⚠️ Harap kirim atau reply foto dengan perintah \`${m.prefix}${m.command} <teks>\``);
  }
  
  await m.react("🕕");
  
  try {
    media = await downloadMediaMessage(msgObj, "buffer", {});
    if (!media) throw new Error("Gagal membaca media");

    const bgUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772229788017.jpeg";
    const bgBuffer = await axios.get(bgUrl, { responseType: "arraybuffer" }).then(r => r.data);

    const userImg = await loadImage(media);
    const background = await loadImage(Buffer.from(bgBuffer));

    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(background, 0, 0, 1024, 1024);

    const centerX = 518; 
    const centerY = 455; 
    const radius = 235; 

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const aspect = userImg.width / userImg.height;
    let drawWidth, drawHeight, dx, dy;
    
    if (aspect > 1) {
      drawHeight = radius * 2;
      drawWidth = drawHeight * aspect;
      dx = centerX - drawWidth / 2;
      dy = centerY - radius;
    } else {
      drawWidth = radius * 2;
      drawHeight = drawWidth / aspect;
      dx = centerX - radius;
      dy = centerY - drawHeight / 2;
    }
    
    ctx.drawImage(userImg, dx, dy, drawWidth, drawHeight);
    ctx.restore();

    drawCircularTextBottom(ctx, text.trim(), centerX, centerY, radius);

    const buffer = await canvas.encode("png");
    await sock.sendMessage(m.chat, { image: buffer, caption: "👨‍💻 *Fake Dev v2*" }, { quoted: m });
    await m.react("✅");

  } catch (err) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
