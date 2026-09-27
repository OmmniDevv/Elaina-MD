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
  name: "jmk48",
  alias: [],
  category: "canvas",
  description: "Bikin gambarmu jadi member JMK48",
  usage: ".jmk48 (reply/kirim foto)",
  example: ".jmk48",
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
    return m.reply(`⚠️ Harap kirim atau reply foto profil dengan perintah \`${m.prefix}${m.command}\``);
  }

  await m.react("🕕");
  
  try {
    media = await downloadMediaMessage(msgObj, "buffer", {});
    if (!media) throw new Error("Gagal membaca media");

    const frameURL = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772230335511.png";
    const frameBuffer = await axios.get(frameURL, { responseType: "arraybuffer" }).then(r => r.data);

    const userImg = await loadImage(media);
    const frameImg = await loadImage(Buffer.from(frameBuffer));

    const canvas = createCanvas(frameImg.width, frameImg.height);
    const ctx = canvas.getContext("2d");

    const centerX = canvas.width / 2;
    const centerY = Math.round(canvas.height * 0.5);
    const radius = Math.round(canvas.width * 0.4);

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    // Sesuaikan posisi jika rasio foto bukan 1:1, potong ke tengah
    const minSide = Math.min(userImg.width, userImg.height);
    const cropX = (userImg.width - minSide) / 2;
    const cropY = (userImg.height - minSide) / 2;
    
    ctx.drawImage(userImg, cropX, cropY, minSide, minSide, centerX - radius, centerY - radius, radius * 2, radius * 2);
    ctx.restore();

    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

    const buffer = await canvas.encode("png");
    await sock.sendMessage(m.chat, { image: buffer, caption: "🎤 *JMK48 Member*" }, { quoted: m });
    await m.react("✅");

  } catch (err) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
