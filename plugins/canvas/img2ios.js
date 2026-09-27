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
  name: "img2ios",
  alias: ["toios"],
  category: "canvas",
  description: "Bikin gambarmu menjadi gaya foto iOS",
  usage: ".img2ios (reply/kirim foto)",
  example: ".img2ios",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
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

    const templateURL = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772230291185.jpeg";
    const templateBuffer = await axios.get(templateURL, { responseType: "arraybuffer" }).then(r => r.data);

    const userImg = await loadImage(media);
    const template = await loadImage(Buffer.from(templateBuffer));

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(template, 0, 0);

    const bubbleX = 36;
    const bubbleY = 363;
    const bubbleW = 616;
    const bubbleH = 860;
    const radius = 21;

    const imgRatio = userImg.width / userImg.height;
    const bubbleRatio = bubbleW / bubbleH;
    let drawW, drawH;

    if (imgRatio > bubbleRatio) {
      drawH = bubbleH;
      drawW = drawH * imgRatio;
    } else {
      drawW = bubbleW;
      drawH = drawW / imgRatio;
    }

    const offsetX = bubbleX - (drawW - bubbleW) / 2;
    const offsetY = bubbleY - (drawH - bubbleH) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(bubbleX + radius, bubbleY);
    ctx.lineTo(bubbleX + bubbleW - radius, bubbleY);
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY, bubbleX + bubbleW, bubbleY + radius);
    ctx.lineTo(bubbleX + bubbleW, bubbleY + bubbleH - radius);
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY + bubbleH, bubbleX + bubbleW - radius, bubbleY + bubbleH);
    ctx.lineTo(bubbleX + radius, bubbleY + bubbleH);
    ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleH, bubbleX, bubbleY + bubbleH - radius);
    ctx.lineTo(bubbleX, bubbleY + radius);
    ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + radius, bubbleY);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(userImg, offsetX, offsetY, drawW, drawH);
    ctx.restore();

    const buffer = await canvas.encode("png");
    await sock.sendMessage(m.chat, { image: buffer, caption: "📱 *iOS Style*" }, { quoted: m });
    await m.react("✅");

  } catch (err) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
