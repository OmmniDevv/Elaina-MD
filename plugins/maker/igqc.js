/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';
import te from "../../src/lib/elaina-error.js";

const config = {
  name: "igqc",
  alias: ["igquote", "qcinstagram"],
  category: "maker",
  description: "Membuat gambar Instagram Quote Chat / IGQC",
  usage: ".igqc <teks> (opsional reply/kirim foto)",
  example: ".igqc Ini tuh namanya pap dari my mbg yh 🌹🌹",
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

const __dirname = dirname(fileURLToPath(import.meta.url));

const FONTS = [
  { family: 'InterRegular', url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2', localName: 'Inter-Regular.ttf' }
];

const BG_URL = "https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets@main/Image/igqc.png";
const CANVAS_SIZE = { width: 878, height: 1791 };

const ASSETS_DIR = join(process.cwd(), 'assets', 'igqc');
const FONTS_DIR = join(ASSETS_DIR, 'fonts');
const APPLE_EMOJI_JSON_URL = 'https://media.githubusercontent.com/media/Ditzzx-vibecoder/entahlah/main/emoji-apple.json';
const APPLE_EMOJI_JSON_LOCAL = join(FONTS_DIR, 'emoji-apple-image.json');

let appleEmojiMap = null;
const emojiImageCache = new Map();
const EMOJI_REGEX = /(\p{Emoji_Modifier_Base}\p{Emoji_Modifier}|\p{Emoji_Presentation}\uFE0F?|\p{Emoji}\uFE0F|[\u{1F1E0}-\u{1F1FF}]{2}|\p{Extended_Pictographic}\uFE0F?)/gu;

async function downloadBuffer(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } });
  return Buffer.from(res.data);
}

async function prepareAssets() {
  await mkdir(FONTS_DIR, { recursive: true });

  for (const font of FONTS) {
    const fontLocal = join(FONTS_DIR, font.localName);
    if (!existsSync(fontLocal)) {
      await writeFile(fontLocal, await downloadBuffer(font.url));
    }
    GlobalFonts.registerFromPath(fontLocal, font.family);
  }

  const bgLocal = join(ASSETS_DIR, 'igqc.png');
  if (!existsSync(bgLocal)) {
    await writeFile(bgLocal, await downloadBuffer(BG_URL));
  }
  return bgLocal;
}

function emojiToUnicode(emoji) {
  return [...emoji].map(c => c.codePointAt(0).toString(16).padStart(4, '0')).join('-');
}

async function loadAppleEmojiMap() {
  if (appleEmojiMap) return appleEmojiMap;
  if (!existsSync(APPLE_EMOJI_JSON_LOCAL)) {
    const buf = await downloadBuffer(APPLE_EMOJI_JSON_URL);
    await writeFile(APPLE_EMOJI_JSON_LOCAL, buf);
  }
  const raw = await readFile(APPLE_EMOJI_JSON_LOCAL, 'utf-8');
  appleEmojiMap = JSON.parse(raw);
  return appleEmojiMap;
}

async function getEmojiImage(emoji) {
  if (emojiImageCache.has(emoji)) return emojiImageCache.get(emoji);
  const map = await loadAppleEmojiMap();
  const base = emojiToUnicode(emoji);
  const variants = [
    base,
    base.replace(/-fe0f/gi, ''),
    `${base.replace(/-fe0f/gi, '')}-fe0f`,
    base.toUpperCase(),
    base.replace(/-fe0f/gi, '').toUpperCase(),
    base.replace(/-fe0f/gi, '').toUpperCase() + '-FE0F',
  ];
  let b64 = null;
  for (const v of variants) {
    if (map[v]) { b64 = map[v]; break; }
  }
  if (!b64) return null;
  const buf = Buffer.from(b64, 'base64');
  const img = await loadImage(buf);
  emojiImageCache.set(emoji, img);
  return img;
}

async function drawAppleEmoji(ctx, emoji, x, y, size) {
  const img = await getEmojiImage(emoji);
  if (!img) {
    ctx.fillText(emoji, x, y);
    return;
  }
  ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
}

function measureTextCustom(ctx, text, fontSize) {
  const parts = text.split(EMOJI_REGEX);
  let totalWidth = 0;
  for (const part of parts) {
    if (!part) continue;
    EMOJI_REGEX.lastIndex = 0;
    if (EMOJI_REGEX.test(part)) {
      totalWidth += fontSize * 1.05;
    } else {
      totalWidth += ctx.measureText(part).width;
    }
    EMOJI_REGEX.lastIndex = 0;
  }
  return totalWidth;
}

async function drawTextWithEmojis(ctx, text, x, y, fontSize) {
  const parts = text.split(EMOJI_REGEX);
  let currentX = x;
  for (const part of parts) {
    if (!part) continue;
    EMOJI_REGEX.lastIndex = 0;
    if (EMOJI_REGEX.test(part)) {
      const emojiSize = fontSize * 1.05;
      const emojiCX = currentX + emojiSize / 2;
      const emojiCY = y;
      await drawAppleEmoji(ctx, part, emojiCX, emojiCY, emojiSize);
      currentX += emojiSize;
    } else {
      ctx.fillText(part, currentX, y);
      currentX += ctx.measureText(part).width;
    }
    EMOJI_REGEX.lastIndex = 0;
  }
}

function wrapText(ctx, text, maxWidth, fontSize) {
  ctx.font = `${fontSize}px InterRegular`;
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.includes('\n')) {
      const parts = word.split('\n');
      for (let j = 0; j < parts.length; j++) {
        const test = cur + (cur ? " " : "") + parts[j];
        if (measureTextCustom(ctx, test, fontSize) > maxWidth && cur) {
          lines.push(cur); cur = parts[j];
        } else { cur = test; }
        if (j < parts.length - 1) { lines.push(cur); cur = ""; }
      }
      continue;
    }
    const test = cur + (cur ? " " : "") + word;
    if (measureTextCustom(ctx, test, fontSize) > maxWidth && i > 0) {
      lines.push(cur); cur = word;
    } else { cur = test; }
  }
  if (cur) lines.push(cur);
  return lines;
}

async function handler(m, { sock, text }) {
  let q = m.quoted ? m.quoted : m;
  const mime = q.mimetype || q.mediaType || q.msg?.mimetype || q.mtype || '';
  const isImage = 
    /image/.test(mime) || 
    q.mtype === "imageMessage" || 
    q.type === "imageMessage" || 
    m.isImage ||
    m.quoted?.isImage;

  let inputTeks = text || m.text?.replace(new RegExp(`^\\${m.prefix || ''}${m.command}\\s*`, 'i'), '') || '';

  if (!inputTeks && !isImage) {
    return m.reply(`*Format salah!*\n\nMasukkan teks atau reply gambar dengan caption:\n.${m.command} <teks>`);
  }

  m.react("⏳");

  try {
    const bgLocal = await prepareAssets();
    await loadAppleEmojiMap();

    // Mengambil timestamp jam saat ini
    const now = new Date();
    const days = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
    const dayStr = days[now.getDay()];
    const hoursStr = String(now.getHours()).padStart(2, '0');
    const minsStr = String(now.getMinutes()).padStart(2, '0');
    const menuTimeStr = `${dayStr} ${hoursStr}.${minsStr}`;

    let imgObj = null;
    if (isImage) {
      const imgBuf = await q.download?.() || await sock.downloadMediaMessage(q);
      if (imgBuf) {
        imgObj = await loadImage(imgBuf);
      }
    }

    const canvas = createCanvas(CANVAS_SIZE.width, CANVAS_SIZE.height);
    const ctx = canvas.getContext('2d');

    const bgImg = await loadImage(bgLocal);
    ctx.drawImage(bgImg, 0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);

    const menuBoxTop = 985;
    ctx.fillStyle = "#a1a4a9";
    ctx.font = "20px InterRegular";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(menuTimeStr, 72, menuBoxTop + 35);

    const maxWidthLimit = 530;
    const maxImgWidthLimit = 420;
    const minBubbleWidth = 280;
    const paddingX = 30;
    const paddingY = 22;
    const fixedX = 38;
    const bubbleBottom = menuBoxTop - 20;

    const emCardH = 104;
    const minEmCardY = 60;

    const hasImg = !!imgObj;
    const hasTxt = !!inputTeks;

    let chatFontSize = 30;
    const minFontSize = 12;
    let imageScale = 1.0;

    let chatLines = [];
    let lineHeight = 0;
    let textBubbleH = 0;
    let imgDrawW = 0;
    let imgDrawH = 0;
    let bubbleW = 0;
    let textBubbleTop = 0;
    let imgBubbleTop = 0;
    let emCardY = 0;
    let topmostY = 0;

    while (chatFontSize >= minFontSize) {
      if (hasImg && hasTxt) {
        ctx.font = `${chatFontSize}px InterRegular`;
        chatLines = wrapText(ctx, inputTeks, maxWidthLimit, chatFontSize);
        lineHeight = chatFontSize + 14;
        textBubbleH = ((chatLines.length - 1) * lineHeight) + chatFontSize + (paddingY * 2);
        textBubbleTop = bubbleBottom - textBubbleH;

        const imgAspect = imgObj.width / imgObj.height;
        let baseImgW = Math.min(Math.max(imgObj.width, minBubbleWidth), maxImgWidthLimit);
        imgDrawW = Math.round(baseImgW * imageScale);
        imgDrawH = Math.round(imgDrawW / imgAspect);

        const bubbleGap = 12;
        imgBubbleTop = textBubbleTop - imgDrawH - bubbleGap;
        topmostY = imgBubbleTop;
      } else if (hasImg) {
        const imgAspect = imgObj.width / imgObj.height;
        let baseImgW = Math.min(Math.max(imgObj.width, minBubbleWidth), maxImgWidthLimit);
        imgDrawW = Math.round(baseImgW * imageScale);
        imgDrawH = Math.round(imgDrawW / imgAspect);
        imgBubbleTop = bubbleBottom - imgDrawH;
        topmostY = imgBubbleTop;
      } else {
        ctx.font = `${chatFontSize}px InterRegular`;
        chatLines = wrapText(ctx, inputTeks, maxWidthLimit, chatFontSize);
        lineHeight = chatFontSize + 14;
        textBubbleH = ((chatLines.length - 1) * lineHeight) + chatFontSize + (paddingY * 2);
        textBubbleTop = bubbleBottom - textBubbleH;
        topmostY = textBubbleTop;
      }

      emCardY = topmostY - emCardH - 20;

      if (emCardY >= minEmCardY) {
        break;
      }

      if (hasTxt) {
        chatFontSize -= 1;
      } else if (hasImg) {
        imageScale -= 0.05;
        if (imageScale < 0.3) break;
      }
    }

    if (hasImg) {
      const currentImgTop = hasTxt ? imgBubbleTop : topmostY;
      const radiusImage = 24;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(fixedX, currentImgTop, imgDrawW, imgDrawH, [radiusImage]);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(imgObj, fixedX, currentImgTop, imgDrawW, imgDrawH);
      ctx.restore();
    }

    if (hasTxt) {
      const currentTextTop = hasImg ? textBubbleTop : topmostY;
      const currentTextHeight = textBubbleH;

      ctx.font = `${chatFontSize}px InterRegular`;
      let longestW = 0;
      chatLines.forEach(l => {
        const w = measureTextCustom(ctx, l.trim(), chatFontSize);
        if (w > longestW) longestW = w;
      });

      bubbleW = longestW + (paddingX * 2);
      bubbleW = Math.max(bubbleW, 180);

      const rad = 25;
      ctx.fillStyle = "#262628";
      ctx.beginPath();
      ctx.moveTo(fixedX + 8, currentTextTop);
      ctx.lineTo(fixedX + bubbleW - rad, currentTextTop);
      ctx.quadraticCurveTo(fixedX + bubbleW, currentTextTop, fixedX + bubbleW, currentTextTop + rad);
      ctx.lineTo(fixedX + bubbleW, currentTextTop + currentTextHeight - rad);
      ctx.quadraticCurveTo(fixedX + bubbleW, currentTextTop + currentTextHeight, fixedX + bubbleW - rad, currentTextHeight + currentTextTop);
      ctx.lineTo(fixedX + rad, currentTextTop + currentTextHeight);
      ctx.quadraticCurveTo(fixedX, currentTextTop + currentTextHeight, fixedX, currentTextTop + currentTextHeight - rad);
      ctx.lineTo(fixedX, currentTextTop + 8);
      ctx.quadraticCurveTo(fixedX, currentTextTop, fixedX + 8, currentTextTop);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(fixedX + 4, currentTextTop + 20);
      ctx.quadraticCurveTo(fixedX - 10, currentTextTop + 4, fixedX - 16, currentTextTop);
      ctx.quadraticCurveTo(fixedX - 2, currentTextTop, fixedX + 14, currentTextTop + 2);
      ctx.closePath();
      ctx.fill();

      ctx.save();
      ctx.fillStyle = "#eff0f4";
      ctx.font = `${chatFontSize}px InterRegular`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      for (let i = 0; i < chatLines.length; i++) {
        const lineY = currentTextTop + paddingY + (i * lineHeight) + (chatFontSize / 2);
        await drawTextWithEmojis(ctx, chatLines[i].trim(), fixedX + paddingX, lineY, chatFontSize);
      }
      ctx.restore();
    }

    let emojis = ["❤️", "😂", "😮", "😢", "😡", "👍"];
    const emojiSize = 56;
    const emCardW = 600;
    const emCardX = fixedX - 6;

    ctx.fillStyle = "#222328";
    ctx.beginPath();
    ctx.roundRect(emCardX, emCardY, emCardW, emCardH, [emCardH / 2]);
    ctx.fill();

    const startX = emCardX + 52;
    const spacingX = 80;
    const emojiCY = emCardY + (emCardH / 2);

    for (let i = 0; i < Math.min(emojis.length, 6); i++) {
      await drawAppleEmoji(ctx, emojis[i], startX + (i * spacingX), emojiCY, emojiSize);
    }

    ctx.fillStyle = "#8e8e93";
    ctx.font = "42px InterRegular";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("+", startX + (6 * spacingX) - 2, emCardY + (emCardH / 2) - 2);

    const hasilBuffer = await canvas.encode('png');

    m.react("✅");

    await sock.sendMessage(m.chat, {
      image: hasilBuffer,
      caption: `✨ *IG QC MAKER*`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.react("☢");
    if (typeof te === "function") {
      m.reply(te(m.prefix, m.command, m.pushName));
    } else {
      m.reply("❌ Gagal membuat IGQC:\n" + e.message);
    }
  }
}

export { config, handler };
