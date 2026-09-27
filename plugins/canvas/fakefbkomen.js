/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage } from "@napi-rs/canvas";
import { downloadMediaMessage, getContentType } from '@rexxhayanasi/elaina-baileys';
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "fakefbkomen",
  alias: ["fbkomen", "komenfb"],
  category: "canvas",
  description: "Bikin gambar komentar palsu facebook",
  usage: ".fakefbkomen <nama>|<komentar> (reply/kirim foto)",
  example: ".fakefbkomen Fauzan|Ini komentar saya",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
}

async function handler(m, { sock }) {
  const text = m.text?.trim();
  if (!text || !text.includes("|")) {
    return m.reply(`⚠️ Harap masukkan nama dan komentar yang dipisahkan dengan tanda |!\nContoh: \`${m.prefix}${m.command} Fauzan|Ini komentar\``);
  }

  const [nama, ...komenArr] = text.split("|");
  const komentar = komenArr.join("|").trim();

  let media = null;
  const msgObj = m.quoted?.message ? m.quoted : m;
  const type = getContentType(msgObj.message);

  if (!type || type !== "imageMessage") {
    return m.reply(`⚠️ Harap kirim atau reply foto dengan perintah \`${m.prefix}${m.command}\``);
  }
  
  await m.react("🕕");
  
  try {
    media = await downloadMediaMessage(msgObj, "buffer", {});
    if (!media) throw new Error("Gagal membaca media");

    const avatar = await loadImage(media);
    const canvas = createCanvas(1280, 780);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#1877f2";
    ctx.fillRect(0, 0, canvas.width, 60);

    ctx.fillStyle = "#f0f2f5";
    ctx.fillRect(0, 60, canvas.width, canvas.height - 60);

    const postWidth = 800;
    const postX = (canvas.width - postWidth) / 2;
    const postY = 100;

    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;
    roundedRect(ctx, postX, postY, postWidth, 600, 10);
    ctx.fill();
    ctx.shadowColor = "transparent";

    const postHeaderY = postY + 20;
    ctx.save();
    ctx.beginPath();
    ctx.arc(postX + 30, postHeaderY + 20, 25, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    // Potong tengah untuk avatar agar proporsional
    const minSide = Math.min(avatar.width, avatar.height);
    const cropX = (avatar.width - minSide) / 2;
    const cropY = (avatar.height - minSide) / 2;
    ctx.drawImage(avatar, cropX, cropY, minSide, minSide, postX + 5, postHeaderY, 50, 50);
    ctx.restore();

    ctx.fillStyle = "#050505";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(nama.trim(), postX + 70, postHeaderY + 25);

    ctx.fillStyle = "#65676b";
    ctx.font = "13px sans-serif";
    ctx.fillText("baru saja · 🌍", postX + 70, postHeaderY + 45);

    const imgX = postX + 30;
    const imgY = postHeaderY + 80;
    const imgW = postWidth - 60;
    const imgH = 300;
    ctx.drawImage(avatar, imgX, imgY, imgW, imgH);

    ctx.fillStyle = "#050505";
    ctx.font = "16px sans-serif";
    wrapText(ctx, komentar, imgX, imgY + imgH + 40, imgW, 28);

    ctx.fillStyle = "#65676b";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("👍 Suka · 💬 Komentar · ↗️ Bagikan", postX + 30, postY + 580);

    const buffer = await canvas.encode("png");
    await sock.sendMessage(m.chat, { image: buffer, caption: "💬 *Fake FB Comment*" }, { quoted: m });
    await m.react("✅");

  } catch (err) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
