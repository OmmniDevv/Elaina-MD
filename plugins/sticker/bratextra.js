/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import te from "../../src/lib/elaina-error.js";
import config from "../../config.js";
import axios from "axios";

const pluginConfig = {
  name: "bratextra",
  alias: ["bratanime", "bratbahlil", "brathd", "bratpatrick", "bratsquidward", "bratwhite", "bratchika", "bratkobato", "bratmenhera", "bratnezuko", "bratqiqi", "bratruromiya", "bratumaru"],
  category: "sticker",
  description: "Bikin brat versi custom",
  usage: ".bratanime <teks>",
  example: ".bratanime Halo",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

const BRAT_FONT_URL = "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Poppins.ttf";
let isFontLoaded = false;

const TEMPLATES = {
  bratanime: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772989415819.jpeg",
    areaX: 170, areaW: 460, areaCY: 530, areaMaxH: 210, fontSize: 72, minFontSize: 20
  },
  bratbahlil: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772229450331.jpeg",
    centerX: 460, centerY: 840, maxWidth: 660, maxHeight: 140, fontSize: 110, minFontSize: 40
  },
  bratpatrick: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772794292812.jpeg",
    centerX: 460, centerY: 599, maxWidth: 260, maxHeight: 160, fontSize: 70, minFontSize: 8
  },
  bratsquidward: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772794955890.jpeg",
    centerX: 370, centerY: 370, maxWidth: 230, maxHeight: 110, fontSize: 50, minFontSize: 10
  },
  bratwhite: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771727655279.jpeg",
    centerX: (w) => w / 2 + 10, centerY: (w, h) => h / 2 + 285, maxWidth: 480, maxHeight: 280, rotationAngle: -7.5 * Math.PI / 180, fontSize: 130, minFontSize: 10
  },
  bratchika: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771527351581.jpeg",
    centerX: 500, centerY: 810, maxWidth: 450, maxHeight: 250, fontSize: 75, minFontSize: 15, lineHeightMultiplier: 1.2
  },
  bratkobato: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771728510134.jpeg",
    centerX: (w) => w / 2 + 175, centerY: (w, h) => h / 2 + 75, maxWidth: 350, maxHeight: 250, fontSize: 120, minFontSize: 10, lineHeightMultiplier: 1.2
  },
  bratmenhera: {
    url: "https://c.termai.cc/i145/qJsN.jpg",
    centerX: (w) => w / 2 + 25, centerY: 260, maxWidth: 480, maxHeight: 310, fontSize: 400, minFontSize: 25, lineHeightMultiplier: 0.92
  },
  bratnezuko: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772793912974.jpeg",
    centerX: (w) => w / 2, centerY: 1245, maxWidth: 820, maxHeight: 480, fontSize: 140, minFontSize: 20, lineHeightMultiplier: 1.25
  },
  bratqiqi: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771532869746.jpeg",
    centerX: (w) => w / 2 + 5, centerY: (w, h) => h / 2 + 108, maxWidth: 210, maxHeight: 95, fontSize: 40, minFontSize: 5, rotationAngle: -7.5 * Math.PI / 180, lineHeightMultiplier: 1.1
  },
  bratruromiya: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771827988894.jpeg",
    centerX: 810, centerY: 1310, maxWidth: 650, maxHeight: 450, fontSize: 120, minFontSize: 15, lineHeightMultiplier: 1.2
  },
  bratumaru: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771524973616.jpeg",
    centerX: 375, centerY: 565, maxWidth: 450, maxHeight: 250, fontSize: 75, minFontSize: 15, lineHeightMultiplier: 1.2
  }
};

function toUnified(str) {
  return Array.from(str)
    .map(e => e.codePointAt(0).toString(16))
    .join("-")
    .toLowerCase();
}

function tokenize(text) {
  const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
  const raw = [];
  let lastIndex = 0;
  let match;

  while ((match = emojiRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      raw.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    raw.push({ type: "emoji", value: match[0] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    raw.push({ type: "text", value: text.slice(lastIndex) });
  }

  const tokens = [];
  for (const seg of raw) {
    if (seg.type === "emoji") {
      tokens.push(seg);
    } else {
      const words = seg.value.split(/\s+/).filter(w => w.length > 0);
      words.forEach(w => {
        if (tokens.length > 0) tokens.push({ type: "space" });
        tokens.push({ type: "text", value: w });
      });
    }
  }

  return tokens;
}

async function getEmojiImage(emoji) {
  const unified = toUnified(emoji);
  const filePath = path.join(
    process.cwd(),
    "node_modules",
    "emoji-datasource-apple",
    "img",
    "apple",
    "64",
    `${unified}.png`
  );
  if (!fs.existsSync(filePath)) return null;
  return await loadImage(fs.readFileSync(filePath));
}

function getTokenWidth(ctx, token, fontSize) {
  if (token.type === "space") return ctx.measureText(" ").width;
  if (token.type === "emoji") return fontSize * 1.15;
  return ctx.measureText(token.value).width;
}

function buildLines(ctx, tokens, fontSize, maxW) {
  ctx.font = `bold ${fontSize}px sans-serif`;
  const lines = [];
  let line = [];
  let lineW = 0;

  for (const token of tokens) {
    const w = getTokenWidth(ctx, token, fontSize);

    if (token.type === "space") {
      if (line.length > 0) {
        line.push({ ...token, w });
        lineW += w;
      }
      continue;
    }

    if (line.length > 0 && lineW + w > maxW) {
      while (line.length > 0 && line[line.length - 1].type === "space") {
        lineW -= line[line.length - 1].w;
        line.pop();
      }
      lines.push({ items: line, width: lineW });
      line = [{ ...token, w }];
      lineW = w;
    } else {
      line.push({ ...token, w });
      lineW += w;
    }
  }

  if (line.length > 0) {
    while (line.length > 0 && line[line.length - 1].type === "space") {
      lineW -= line[line.length - 1].w;
      line.pop();
    }
    lines.push({ items: line, width: lineW });
  }

  return lines;
}

async function fetchBuffer(url) {
  const res = await fetch(url);
  return Buffer.from(await res.arrayBuffer());
}

async function handler(m, { sock }) {
  const text = m.text;
  if (!text) {
    return m.reply(`⚠️ Harap masukkan teksnya!\nContoh: \`${m.prefix}${m.command} Halo semuanya\``);
  }

  await m.react("🕕");

  try {
    const cmd = m.command.toLowerCase();
    
    if (cmd === "brathd") {
      const url = `https://aqul-brat.hf.space/?text=${encodeURIComponent(text)}`;
      const response = await axios.get(url, {
          responseType: 'arraybuffer',
          headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'image/png,image/*,*/*;q=0.8',
              'Referer': 'https://aqul-brat.hf.space/',
              'Connection': 'keep-alive'
          }
      });
      await sock.sendImageAsSticker(m.chat, Buffer.from(response.data), m, {
        packname: config.sticker.packname,
        author: config.sticker.author
      });
      await m.react("✅");
      return;
    }

    const template = TEMPLATES[cmd];
    if (!template) {
      throw new Error("Template tidak ditemukan");
    }

    if (!isFontLoaded) {
      const fontBuffer = await fetchBuffer(BRAT_FONT_URL);
      GlobalFonts.register(fontBuffer, "Poppins");
      isFontLoaded = true;
    }

    const bgBuffer = await fetchBuffer(template.url);
    const bg = await loadImage(bgBuffer);

    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    const tokens = tokenize(text);
    let fontSize = template.fontSize;
    let lines = [];
    
    let areaW = template.areaW || template.maxWidth;
    let areaMaxH = template.areaMaxH || template.maxHeight;
    const lhMult = template.lineHeightMultiplier || 1.45;

    lines = buildLines(ctx, tokens, fontSize, areaW);

    while (fontSize > template.minFontSize) {
      lines = buildLines(ctx, tokens, fontSize, areaW);
      const totalH = lines.length * fontSize * lhMult;
      if (totalH <= areaMaxH) break;
      fontSize -= 2;
    }

    const lineHeight = fontSize * lhMult;
    const totalHeight = lines.length * lineHeight;
    
    let startY = 0;
    
    ctx.fillStyle = "#000000";
    ctx.textBaseline = "middle";

    if (cmd === "bratanime") {
        let y = template.areaCY - totalHeight / 2 + fontSize * 0.85;
        ctx.textBaseline = "alphabetic";
        
        for (const line of lines) {
          ctx.font = `bold ${fontSize}px sans-serif`;
          let x = template.areaX + (template.areaW - line.width) / 2;
    
          for (const token of line.items) {
            if (token.type === "text") {
              ctx.fillText(token.value, x, y);
              x += token.w;
            } else if (token.type === "space") {
              x += token.w;
            } else if (token.type === "emoji") {
              const img = await getEmojiImage(token.value);
              const size = fontSize * 1.15;
              if (img) ctx.drawImage(img, x, y - size * 0.85, size, size);
              x += token.w;
            }
          }
          y += lineHeight;
        }
    } else {
        const centerX = typeof template.centerX === 'function' ? template.centerX(canvas.width) : template.centerX;
        const centerY = typeof template.centerY === 'function' ? template.centerY(canvas.width, canvas.height) : template.centerY;
        
        if (template.rotationAngle) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(template.rotationAngle);
            
            startY = -(totalHeight / 2) + (lineHeight / 2);
            
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              const y = startY + i * lineHeight;
              ctx.font = `bold ${fontSize}px sans-serif`;
              let currentX = -line.width / 2;
        
              for (const token of line.items) {
                if (token.type === "text") {
                  ctx.fillText(token.value, currentX, y);
                  currentX += token.w;
                } else if (token.type === "space") {
                  currentX += token.w;
                } else if (token.type === "emoji") {
                  const img = await getEmojiImage(token.value);
                  const size = fontSize * 1.15;
                  if (img) ctx.drawImage(img, currentX, y - size / 2, size, size);
                  currentX += token.w;
                }
              }
            }
            ctx.restore();
        } else {
            startY = centerY - totalHeight / 2 + lineHeight / 2;
    
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const y = startY + i * lineHeight;
          
                ctx.font = `bold ${fontSize}px sans-serif`;
                let currentX = centerX - line.width / 2;
          
                for (const token of line.items) {
                  if (token.type === "text") {
                    ctx.fillText(token.value, currentX, y);
                    currentX += token.w;
                  } else if (token.type === "space") {
                    currentX += token.w;
                  } else if (token.type === "emoji") {
                    const img = await getEmojiImage(token.value);
                    const size = fontSize * 1.15;
                    if (img) ctx.drawImage(img, currentX, y - size / 2, size, size);
                    currentX += token.w;
                  }
                }
            }
        }
    }

    const buffer = await canvas.encode("png");
    await sock.sendImageAsSticker(m.chat, buffer, m, {
        packname: config.sticker.packname,
        author: config.sticker.author
    });
    
    await m.react("✅");
  } catch (error) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
