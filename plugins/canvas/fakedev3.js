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
  name: "fakedev3",
  alias: [],
  category: "canvas",
  description: "Bikin gambar fakedev 3 dari fotomu",
  usage: ".fakedev3 <teks> (reply/kirim foto)",
  example: ".fakedev3 developer",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

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

    const bgURL = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772226320613.jpeg";
    const blueTickURL = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772220719294.jpeg";

    const [bgRes, tickRes] = await Promise.all([
      axios.get(bgURL, { responseType: "arraybuffer" }).then(r => r.data),
      axios.get(blueTickURL, { responseType: "arraybuffer" }).then(r => r.data)
    ]);

    const userImage = await loadImage(media);
    const bgImg = await loadImage(Buffer.from(bgRes));
    const tickImg = await loadImage(Buffer.from(tickRes));

    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 263;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    // Potong tengah untuk avatar agar proporsional
    const minSide = Math.min(userImage.width, userImage.height);
    const cropX = (userImage.width - minSide) / 2;
    const cropY = (userImage.height - minSide) / 2;
    
    ctx.drawImage(userImage, cropX, cropY, minSide, minSide, centerX - radius, centerY - radius, radius * 2, radius * 2);
    ctx.restore();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    ctx.font = "bold 72px 'Segoe UI', 'Arial Black', Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const arcSpan = Math.PI * 0.55;
    const textRadius = radius + 75;
    const chars = text.toUpperCase().split("");
    const n = chars.length;
    const angleIncrement = n > 1 ? arcSpan / (n - 1) : 0;
    const start = Math.PI / 2 + arcSpan / 2;

    for (let i = 0; i < n; i++) {
        const angle = start - i * angleIncrement;
        const x = centerX + Math.cos(angle) * textRadius;
        const y = centerY + Math.sin(angle) * textRadius;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle - Math.PI / 2);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.strokeText(chars[i], 0, 0);
        ctx.fillText(chars[i], 0, 0);
        ctx.restore();
    }

    ctx.restore();

    // Selalu tambahkan verified tick
    ctx.drawImage(
        tickImg,
        centerX + Math.cos(0) * (radius + 60) - 35,
        centerY - 35,
        70,
        70
    );

    const buffer = await canvas.encode("png");
    await sock.sendMessage(m.chat, { image: buffer, caption: "👨‍💻 *Fake Dev v3*" }, { quoted: m });
    await m.react("✅");

  } catch (err) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
