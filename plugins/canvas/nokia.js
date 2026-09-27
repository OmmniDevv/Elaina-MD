/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage } from "@napi-rs/canvas";
import te from "../../src/lib/elaina-error.js";
import axios from "axios";

const pluginConfig = {
  name: "nokia",
  alias: ["nokia"],
  category: "canvas",
  description: "Buat meme nokia",
  usage: ".nokia <nama> | <pesan>",
  example: ".nokia Bot | Halo dunia",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const input = m.text?.trim();

  if (!input || !input.includes("|")) {
    return m.reply(`⚠️ Harap masukkan nama dan pesan dipisah dengan tanda |\nContoh: \`${m.prefix}${m.command} Bot|Halo semuanya\``);
  }

  const [nama, text] = input.split("|").map((v) => v.trim());

  if (!nama || !text) {
    return m.reply(`⚠️ Harap lengkapi nama dan pesan!\nContoh: \`${m.prefix}${m.command} Bot|Halo\``);
  }

  await m.react("🕕");

  try {
    const bgUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771087955018.jpeg";
    const response = await axios.get(bgUrl, { responseType: 'arraybuffer' });
    const bg = await loadImage(Buffer.from(response.data));

    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 52px "Arial Black", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fillText(nama, 342, 222);
    ctx.fillStyle = "#e1e5eb";
    ctx.shadowBlur = 3;
    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
    ctx.fillText(nama, 340, 220);
    ctx.shadowBlur = 0;

    ctx.font = '32px "Arial Black", sans-serif';
    ctx.fillStyle = "rgba(20, 20, 20, 0.8)";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.shadowBlur = 1;
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";

    const maxWidth = 580;
    const x = 90;
    let y = 300;
    const lineHeight = 38;

    const words = text.split(" ");
    let line = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);

    const buffer = await canvas.encode("jpeg");
    
    await sock.sendMessage(m.chat, {
      image: buffer,
      caption: `📱 Pesan nokia dari ${nama}`
    }, { quoted: m });

    await m.react("✅");
  } catch (error) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
