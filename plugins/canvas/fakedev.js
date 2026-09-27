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
import axios from "axios";

const pluginConfig = {
  name: "fakedev",
  alias: [],
  category: "canvas",
  description: "Bikin gambar fakedev dari fotomu",
  usage: ".fakedev <teks> (reply/kirim foto)",
  example: ".fakedev developer",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

function drawCircularTextTop(ctx, text, centerX, centerY, radius, badgeImage) {
  const fontSize = 72;
  const strokeWidth = 3;
  const arcSpan = Math.PI * 0.7;

  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const textRadius = radius + 75;
  const chars = text.split("");
  const n = chars.length;
  const angleIncrement = n > 1 ? arcSpan / (n - 1) : 0;
  const start = Math.PI / 2 + arcSpan / 2;

  for (let i = 0; i < n; i++) {
    const char = chars[i];
    const angle = start - i * angleIncrement;
    const x = centerX + Math.cos(angle) * textRadius;
    const y = centerY + Math.sin(angle) * textRadius;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle - Math.PI / 2);
    ctx.lineWidth = strokeWidth;
    ctx.strokeText(char, 0, 0);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }

  if (badgeImage) {
    const endAngle = start - (n - 1) * angleIncrement;
    const badgeAngle = endAngle - angleIncrement;
    const badgeSize = Math.round(fontSize * 0.9);
    const bx = centerX + Math.cos(badgeAngle) * textRadius;
    const by = centerY + Math.sin(badgeAngle) * textRadius;
    ctx.drawImage(badgeImage, bx - badgeSize / 2, by - badgeSize / 2, badgeSize, badgeSize);
  }
}

async function handler(m, { sock }) {
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

    const bgUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772797781960.jpeg";
    const bgBuffer = await axios.get(bgUrl, { responseType: "arraybuffer" }).then(r => r.data);
    const badgeBuffer = await axios.get("https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772797710490.png", { responseType: "arraybuffer" }).then(r => r.data);

    const userImage = await loadImage(media);
    const bg = await loadImage(Buffer.from(bgBuffer));
    const badge = await loadImage(Buffer.from(badgeBuffer));

    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 263;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(userImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
    ctx.restore();

    drawCircularTextTop(ctx, text.toUpperCase(), centerX, centerY, radius, badge);

    const buffer = await canvas.encode("png");
    await sock.sendMessage(m.chat, { image: buffer, caption: "👨‍💻 *Fake Dev*" }, { quoted: m });
    await m.react("✅");

  } catch (err) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
