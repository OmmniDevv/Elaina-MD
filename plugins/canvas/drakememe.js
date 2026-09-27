/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const config = {
  name: "drakememe",
  alias: ["drake", "drakedislike"],
  category: "canvas",
  description: "Membuat meme Drake Hotline Bling dengan dua teks kustom",
  usage: ".drakememe teks1|teks2",
  example: ".drakememe Femboy|Tomboy",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

const FONTS = [
  { family: 'ARIAL', url: 'https://cdn.jsdelivr.net/gh/wolfsonliu/web_typography/fonts/arial.ttf', localName: 'arial.ttf' }
];

const BG_URL = "https://imgflip.com/s/meme/Drake-Hotline-Bling.jpg";
const CANVAS_SIZE = { width: 1200, height: 1200 };

const ASSETS_DIR = join(process.cwd(), 'assets', 'drakememe');
const FONTS_DIR = join(ASSETS_DIR, 'fonts');

async function download(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  if (!res.ok) throw new Error(`Fetch failed ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function prepareAssets() {
  await mkdir(FONTS_DIR, { recursive: true });

  for (const font of FONTS) {
    const fontLocal = join(FONTS_DIR, font.localName);
    if (!existsSync(fontLocal)) {
      await writeFile(fontLocal, await download(font.url));
    }
    GlobalFonts.registerFromPath(fontLocal, font.family);
  }

  const bgLocal = join(ASSETS_DIR, 'Drake-Hotline-Bling.jpg');
  if (!existsSync(bgLocal)) {
    await writeFile(bgLocal, await download(BG_URL));
  }
  return bgLocal;
}

function drawTextInSafeZone(ctx, text, zone, initialFontSize, fontFamily, align) {
  let fontSize = initialFontSize;
  let lh = fontSize * 1.2;
  let out = [];
  let minSize = 10;
  
  while (fontSize >= minSize) {
    ctx.font = `400 ${fontSize}px ${fontFamily}`;
    lh = fontSize * 1.2;
    out = [];

    text.split('\n').forEach(p => {
      let cur = '';
      p.split(' ').forEach(w => {
        const t = cur ? cur + ' ' + w : w;
        if (ctx.measureText(t).width > zone.w && cur) { 
          out.push(cur); 
          cur = w; 
        } else {
          cur = t;
        }
      });
      out.push(cur);
    });

    let fitsWidth = true;
    for (const line of out) {
      if (ctx.measureText(line).width > zone.w) {
        fitsWidth = false;
        break;
      }
    }

    if (fitsWidth && (out.length * lh) <= zone.h) {
      break;
    }
    fontSize -= 2;
  }

  if (fontSize < minSize) {
    fontSize = minSize;
    ctx.font = `400 ${fontSize}px ${fontFamily}`;
    lh = fontSize * 1.2;
  }

  const drawX = align === 'center' ? zone.x + zone.w / 2 : align === 'right' ? zone.x + zone.w : zone.x;
  
  ctx.save();
  ctx.beginPath();
  ctx.rect(zone.x, zone.y, zone.w, zone.h);
  ctx.clip();
  
  const startY = zone.y + zone.h / 2 - (out.length * lh) / 2 + lh / 2;
  out.forEach((l, i) => {
    ctx.fillText(l, drawX, startY + i * lh);
  });
  ctx.restore();
}

export async function handler(m, { text, usedPrefix, command, sock, conn }) {
  const client = sock || conn;

  if (!text) {
    return m.reply(`*Format salah!*\n\nContoh penggunaan:\n${usedPrefix + command} Femboy|Tomboy`);
  }

  const [teks1, teks2] = text.split('|');
  if (!teks1 || !teks2) {
    return m.reply(`*Format salah!*\n\nPastikan menggunakan pemisah tanda garis (|)\nContoh:\n${usedPrefix + command} Femboy|Tomboy`);
  }

  await m.react('⏳');

  try {
    const bgLocal = await prepareAssets();
    const canvas = createCanvas(CANVAS_SIZE.width, CANVAS_SIZE.height);
    const ctx = canvas.getContext('2d');

    const bgImg = await loadImage(bgLocal);
    ctx.drawImage(bgImg, 0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);

    // Teks Atas (Drake Menolak)
    ctx.save();
    const safeZone_el1 = { x: 615, y: 22, w: 571, h: 564 };
    ctx.fillStyle = '#111111';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    drawTextInSafeZone(ctx, teks1.trim(), safeZone_el1, 110, 'ARIAL, sans-serif', 'center');
    ctx.restore();

    // Teks Bawah (Drake Menyukai)
    ctx.save();
    const safeZone_el2 = { x: 615, y: 623, w: 571, h: 561 };
    ctx.fillStyle = '#111111';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    drawTextInSafeZone(ctx, teks2.trim(), safeZone_el2, 110, 'ARIAL, sans-serif', 'center');
    ctx.restore();

    const canvasBuffer = await canvas.encode('png');

    await client.sendMessage(m.chat, {
      image: canvasBuffer,
      caption: `✨ *Drake Meme Generator*`
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply('❌ Gagal merender meme Drake.');
  }
}
