/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const pluginConfig = {
    name: 'buatquotes',
    alias: ['bq', 'quoteanime', 'animequote'],
    category: 'canvas',
    description: 'Membuat gambar quote bertema anime secara custom.',
    usage: '.buatquotes [id background] | <teks> | [nama pembuat]',
    example: '.buatquotes 2 | Tetaplah hidup walaupun tidak berguna | Maman',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true
};

const FONT_QUOTE = {
  family: 'arialn',
  url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Font/ARIALN.ttf',
  localName: 'ARIALN.ttf'
};

const FONT_USERNAME = {
  family: 'Inter',
  url: 'https://github.com/rsms/inter/raw/refs/heads/master/docs/font-files/Inter-Medium.woff2',
  localName: 'Inter-Medium.woff2'
};

const BACKGROUNDS = {
  1: {
    name: 'l',
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/qca/L.png',
    textZone: { x: 775, y: 56, w: 456, h: 1102 },
    usernameZone: { x: 890, y: 1167, w: 228, h: 50 },
    usernameFontSize: 28
  },
  2: {
    name: 'gojo',
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/qca/gok.png',
    textZone: { x: 755, y: 68, w: 466, h: 1027 },
    usernameZone: { x: 863, y: 1108, w: 249, h: 50 },
    usernameFontSize: 28
  },
  3: {
    name: 'yuji',
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/qca/cc.png',
    textZone: { x: 35, y: 68, w: 466, h: 1027 },
    usernameZone: { x: 133, y: 1108, w: 249, h: 50 },
    usernameFontSize: 28
  },
  4: {
    name: 'denji',
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/qca/denji.png',
    textZone: { x: 655, y: 68, w: 512, h: 1083 },
    usernameZone: { x: 795, y: 1152, w: 249, h: 50 },
    usernameFontSize: 28
  },
  5: {
    name: 'thorfin',
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/qca/thorfin.png',
    textZone: { x: 65, y: 54, w: 489, h: 992 },
    usernameZone: { x: 162, y: 1042, w: 249, h: 50 },
    usernameFontSize: 28
  },
  6: {
    name: 'naruto',
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/qca/Naruto.png',
    textZone: { x: 40, y: 56, w: 481, h: 1065 },
    usernameZone: { x: 170, y: 1126, w: 228, h: 50 },
    usernameFontSize: 28
  },
  7: {
    name: 'light',
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/qca/LIghtyagami.png',
    textZone: { x: 38, y: 56, w: 493, h: 941 },
    usernameZone: { x: 170, y: 1025, w: 228, h: 50 },
    usernameFontSize: 28
  },
  8: {
    name: 'higuruma',
    url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/qca/higuruma.png',
    textZone: { x: 755, y: 68, w: 424, h: 920 },
    usernameZone: { x: 840, y: 993, w: 249, h: 50 },
    usernameFontSize: 28
  }
};

const TEXT_STYLE = {
  fontWeight: 400,
  fontFamily: 'arialn, sans-serif',
  color: '#111111',
  align: 'justify',
  initialSize: 75,
  minFontSize: 24
};

const USERNAME_STYLE = {
  fontWeight: 500,
  fontFamily: 'Inter, sans-serif',
  color: '#121212',
  align: 'left',
  gap: 40
};

const CANVAS_SIZE = { width: 1254, height: 1254 };

let fontsLoaded = false;
const bgCache = new Map();

async function download(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
    }
  });
  if (!res.ok) throw new Error(`Gagal download ${url}: ${res.status} ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
}

async function setupEnv(bg) {
  let bgBuffer = bgCache.get(bg.name);
  if (!bgBuffer) {
    bgBuffer = await download(bg.url);
    bgCache.set(bg.name, bgBuffer);
  }

  if (!fontsLoaded) {
    GlobalFonts.register(await download(FONT_QUOTE.url), FONT_QUOTE.family);
    GlobalFonts.register(await download(FONT_USERNAME.url), FONT_USERNAME.family);
    fontsLoaded = true;
  }

  return bgBuffer;
}

function wrapText(ctx, text, maxWidth) {
  const out = [];
  text.split('\n').forEach(p => {
    let cur = '';
    p.split(' ').forEach(w => {
      const t = cur ? cur + ' ' + w : w;
      if (ctx.measureText(t).width > maxWidth && cur) { out.push(cur); cur = w; }
      else cur = t;
    });
    out.push(cur);
  });
  return out;
}

function fitTextInZone(ctx, text, zone, opts) {
  const { fontWeight, fontFamily, initialSize, minSize = 10, step = 2 } = opts;
  let fontSize = initialSize;
  let lines, lh;

  while (fontSize >= minSize) {
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    lines = wrapText(ctx, text, zone.w);
    lh = fontSize * 1.2;
    if (lines.length * lh <= zone.h) break;
    fontSize -= step;
  }
  if (fontSize < minSize) {
    fontSize = minSize;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    lines = wrapText(ctx, text, zone.w);
    lh = fontSize * 1.2;
  }
  return { fontSize, lines, lh };
}

function drawJustifiedLine(ctx, line, x, y, targetWidth) {
  const words = line.split(' ');
  if (words.length === 1) {
    ctx.textAlign = 'center';
    ctx.fillText(line, x + targetWidth / 2, y);
    return;
  }
  const wordWidths = words.map(w => ctx.measureText(w).width);
  const totalWordsWidth = wordWidths.reduce((a, b) => a + b, 0);
  const spaceWidth = (targetWidth - totalWordsWidth) / (words.length - 1);

  ctx.textAlign = 'left';
  let cx = x;
  words.forEach((w, i) => {
    ctx.fillText(w, cx, y);
    cx += wordWidths[i] + spaceWidth;
  });
}

function drawQuoteText(ctx, text, zone, opts) {
  const { fontSize, lines, lh } = fitTextInZone(ctx, text, zone, opts);
  ctx.font = `${opts.fontWeight} ${fontSize}px ${opts.fontFamily}`;

  ctx.save();
  ctx.beginPath();
  ctx.rect(zone.x, zone.y, zone.w, zone.h);
  ctx.clip();
  const startY = zone.y + zone.h / 2 - (lines.length * lh) / 2 + lh / 2;

  if (opts.align === 'justify') {
    lines.forEach((l, i) => {
      const y = startY + i * lh;
      const isLastLine = i === lines.length - 1;
      if (isLastLine) {
        ctx.textAlign = 'center';
        ctx.fillText(l, zone.x + zone.w / 2, y);
      } else {
        drawJustifiedLine(ctx, l, zone.x, y, zone.w);
      }
    });
  } else {
    const drawX = opts.align === 'center' ? zone.x + zone.w / 2 : opts.align === 'right' ? zone.x + zone.w : zone.x;
    ctx.textAlign = opts.align;
    lines.forEach((l, i) => ctx.fillText(l, drawX, startY + i * lh));
  }
  ctx.restore();

  return startY + (lines.length - 1) * lh + lh / 2;
}

function drawUsernameText(ctx, text, x, y, opts, fontSize, maxWidth) {
  ctx.font = `${opts.fontWeight} ${fontSize}px ${opts.fontFamily}`;
  ctx.textAlign = 'center';
  const lh = fontSize * 1.2;
  const lines = wrapText(ctx, text, maxWidth);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
}

async function drawScene(bgId, quoteText, usernameStr, outFile) {
  const bg = BACKGROUNDS[bgId];
  if (!bg) throw new Error(`Background nomor ${bgId} tidak ditemukan`);

  const bgBuffer = await setupEnv(bg);

  const canvas = createCanvas(CANVAS_SIZE.width, CANVAS_SIZE.height);
  const ctx = canvas.getContext('2d');

  const bgImg = await loadImage(bgBuffer);
  ctx.drawImage(bgImg, 0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);

  ctx.save();
  ctx.fillStyle = TEXT_STYLE.color;
  ctx.textBaseline = 'middle';
  const quoteEndY = drawQuoteText(ctx, `"${quoteText}"`, bg.textZone, TEXT_STYLE);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = USERNAME_STYLE.color;
  ctx.textBaseline = 'middle';
  const usernameX = bg.textZone.x + bg.textZone.w / 2;
  const usernameY = quoteEndY + USERNAME_STYLE.gap;
  drawUsernameText(ctx, usernameStr, usernameX, usernameY, USERNAME_STYLE, bg.usernameFontSize, bg.textZone.w);
  ctx.restore();

  const pngData = await canvas.encode('png');
  await writeFile(outFile, pngData);
  return outFile;
}

async function handler(m, { sock, text }) {
    if (!text) {
        return m.reply(
            `🎨 *FITUR BUAT QUOTES ANIME*\n\n` +
            `Fitur ini akan membantumu merangkai kata-kata mutiara dengan latar belakang karakter anime favorit yang sangat keren!\n\n` +
            `*CARA PENGGUNAAN:*\n` +
            `- \`${m.prefix}buatquotes <teks>\`\n` +
            `- \`${m.prefix}buatquotes <id_background> | <teks>\`\n` +
            `- \`${m.prefix}buatquotes <id_background> | <teks> | <namamu>\`\n\n` +
            `*DAFTAR BACKGROUND PENDUKUNG (ID 1-8):*\n` +
            `- 1: L (Death Note)\n` +
            `- 2: Gojo Satoru\n` +
            `- 3: Yuji Itadori\n` +
            `- 4: Denji (Chainsaw Man)\n` +
            `- 5: Thorfinn\n` +
            `- 6: Naruto\n` +
            `- 7: Light Yagami\n` +
            `- 8: Higuruma\n\n` +
            `_Contoh: ${m.prefix}buatquotes 2 | Tetaplah hidup walaupun tidak berguna | Maman_`
        );
    }

    try {
        await m.react('🕕');

        let bgId = null;
        let qText = "";
        let qName = "";

        const parts = text.split('|').map(v => v.trim());
        if (parts.length >= 3) {
            bgId = parseInt(parts[0]);
            qText = parts[1];
            qName = parts[2];
        } else if (parts.length === 2) {
            if (!isNaN(parseInt(parts[0])) && BACKGROUNDS[parseInt(parts[0])]) {
                bgId = parseInt(parts[0]);
                qText = parts[1];
            } else {
                qText = parts[0];
                qName = parts[1];
            }
        } else {
            qText = text;
        }

        if (!bgId || !BACKGROUNDS[bgId]) {
            bgId = Math.floor(Math.random() * 8) + 1;
        }
        
        let finalName = qName || m.pushName || 'Someone';
        if (!finalName.startsWith('-')) {
            finalName = '- ' + finalName;
        }

        const tempDir = join(process.cwd(), 'temp');
        if (!existsSync(tempDir)) await mkdir(tempDir, { recursive: true });
        
        const outPath = join(tempDir, `quoteanime_${Date.now()}.png`);
        
        await drawScene(bgId, qText, finalName, outPath);

        await sock.sendMessage(m.chat, { image: { url: outPath } }, { quoted: m });

        if (existsSync(outPath)) unlinkSync(outPath);
        await m.react('✅');

    } catch (e) {
        bgCache.clear();
        fontsLoaded = false;
        console.error(e);
        await m.react('❌');
        m.reply(`❌ *GAGAL MEMBUAT QUOTE*\n\nMaaf, sistem mengalami gangguan saat mencoba membuat gambar quote. Silakan coba lagi nanti.`);
    }
}

export { pluginConfig as config, handler };
