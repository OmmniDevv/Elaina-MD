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
  name: "afinitasml",
  alias: ["afinitas", "mlafinitas"],
  category: "canvas",
  description: "Bikin card afinitas ML dari fotomu",
  usage: ".afinitasml (reply/kirim foto) [bgNum]",
  example: ".afinitasml 2",
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

    const bgNum = m.text?.trim() || "";

    const backgrounds = [
      "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772225640136.png",
      "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772225645439.png",
      "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772225653904.png",
      "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772225659927.png",
      "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772225664898.png",
      "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772225669507.png"
    ];

    let index = Math.floor(Math.random() * backgrounds.length);
    if (bgNum) {
      const n = parseInt(bgNum);
      if (!isNaN(n) && n >= 1 && n <= backgrounds.length) {
        index = n - 1;
      }
    }

    const [bgBuffer, avatarBorderBuffer] = await Promise.all([
      axios.get(backgrounds[index], { responseType: "arraybuffer" }).then(r => r.data),
      axios.get("https://c.termai.cc/i128/BOc3D5a.png", { responseType: "arraybuffer" }).then(r => r.data)
    ]);

    const userImage = await loadImage(media);
    const bg = await loadImage(Buffer.from(bgBuffer));
    const avatarBorder = await loadImage(Buffer.from(avatarBorderBuffer));

    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    const frame = { x: 444, y: 847, w: 205, h: 205 };
    const avatarSize = 300;

    const avatarX = frame.x + (frame.w - avatarSize) / 2;
    const avatarY = frame.y + (frame.h - avatarSize) / 2;

    const minSide = Math.min(userImage.width, userImage.height);
    const cropX = (userImage.width - minSide) / 2;
    const cropY = (userImage.height - minSide) / 2;

    ctx.drawImage(
      userImage,
      cropX,
      cropY,
      minSide,
      minSide,
      avatarX,
      avatarY,
      avatarSize,
      avatarSize
    );

    const pad = 55;
    ctx.drawImage(
      avatarBorder,
      avatarX - pad,
      avatarY - pad,
      avatarSize + pad * 2,
      avatarSize + pad * 2
    );

    const buffer = await canvas.encode("png");
    await sock.sendMessage(m.chat, { image: buffer, caption: "📱 *Afinitas ML*" }, { quoted: m });
    await m.react("✅");

  } catch (err) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
