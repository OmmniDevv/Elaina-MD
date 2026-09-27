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
  name: "spongebob",
  alias: ["spongebob"],
  category: "canvas",
  description: "Buat meme SpongeBob",
  usage: ".spongebob <teks>",
  example: ".spongebob Wahai kerang ajaib",
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
    return m.reply(`⚠️ Harap masukkan teksnya!\nContoh: \`${m.prefix}${m.command} Halo semua\``);
  }

  await m.react("🕕");

  try {
    const imageUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772230812753.jpeg";
    
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const img = await loadImage(Buffer.from(response.data));

    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, img.width, img.height);

    const boardX = img.width * 0.55;
    const boardY = img.height * 0.18;
    const boardW = img.width * 0.35;
    const boardH = img.height * 0.42;

    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    function wrapText(context, txt, x, y, maxWidth, lineHeight, fill) {
        const words = txt.split(" ");
        let line = "";
        let lines = [];

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " ";
            const metrics = context.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
                lines.push(line);
                line = words[i] + " ";
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        if (fill) {
            lines.forEach((l, i) => context.fillText(l, x, y + i * lineHeight));
        }
        return lines.length * lineHeight;
    }

    let fontSize = 52;
    let textHeight = Infinity;

    while (fontSize > 16) {
        ctx.font = `bold ${fontSize}px sans-serif`;
        const lineHeight = fontSize + 6;
        textHeight = wrapText(ctx, text, -9999, -9999, boardW, lineHeight, false);
        if (textHeight <= boardH) break;
        fontSize--;
    }

    ctx.font = `bold ${fontSize}px sans-serif`;
    wrapText(ctx, text, boardX + boardW / 2, boardY, boardW, fontSize + 6, true);

    const buffer = await canvas.encode("png");
    
    await sock.sendMessage(m.chat, {
      image: buffer,
      caption: "🧽 Ini meme buatanmu!"
    }, { quoted: m });

    await m.react("✅");
  } catch (error) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
