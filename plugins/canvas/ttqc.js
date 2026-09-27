/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

// Ditxzz
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import https from 'node:https';
import http from 'node:http';
import te from "../../src/lib/elaina-error.js";

const TEMPLATE_URL  = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/qyzwa.png';

const FONT_ASSETS = [
  { name: 'Plus Jakarta Sans', url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/PlusJakartaSans-Regular.ttf' },
  { name: 'Plus Jakarta Sans', url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/PlusJakartaSans-Medium.ttf' },
  { name: 'Plus Jakarta Sans', url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/PlusJakartaSans-Bold.ttf' },
  { name: 'Font Awesome 6 Free', url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/fa-solid-900.ttf' },
  { name: 'Noto Color Emoji', url: 'https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf' },
];

const MENU_ICONS = [
  { unicode: '\uf3e5', text: 'Balas',           color: '#000000' },
  { unicode: '\uf064', text: 'Teruskan',         color: '#000000' },
  { unicode: '\uf0c5', text: 'Salin',            color: '#000000' },
  { unicode: '\uf1ab', text: 'Terjemahkan',      color: '#000000' },
  { unicode: '\uf2ed', text: 'Hapus untuk saya', color: '#000000' },
  { unicode: '\uf024', text: 'Laporkan',         color: '#ea4335' },
];

const canvasConfig = {
  topPPX: 183, topPPY: 83, topPPRadius: 42,
  topNameX: 250, topNameY: 82, topNameSize: 34,
  chatPPX: 75, chatPPRadius: 38,
  textX: 175, textY: 962,
  bubbleWidth: 520, textSize: 30,
  bubbleBgColor: '#ffffff', textColor: '#161823',
};

// Cache di Global Object agar tidak ter-reset saat hot-reload
global.ttqcCache = global.ttqcCache || {
  fontsLoaded: false,
  templateImage: null
};

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} → ${url}`));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function prepareAssets() {
  if (!global.ttqcCache.templateImage) {
    const buffer = await fetchBuffer(TEMPLATE_URL);
    global.ttqcCache.templateImage = await loadImage(buffer);
  }

  if (!global.ttqcCache.fontsLoaded) {
    // Gunakan Promise.all agar 5 font di download secara bersamaan (paralel), tidak satu-satu (mempercepat waktu loading 5x lipat)
    await Promise.all(FONT_ASSETS.map(async (font) => {
      try {
        const buffer = await fetchBuffer(font.url);
        GlobalFonts.register(buffer, font.name);
      } catch (err) {
        console.error(`[TTQC] Gagal load font ${font.name}:`, err.message);
      }
    }));
    global.ttqcCache.fontsLoaded = true;
  }
}

async function loadImageSmart(src) {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    try {
        return await loadImage(await fetchBuffer(src));
    } catch {
        return await loadImage("https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/6b71d84a580f385bd7ee36402df5341ead4770a0/Image/artworks-gWLRE6HyPH3DgVMG-ZFFxtg-t500x500.jpg");
    }
  }
  return await loadImage(src);
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/(\s+)/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if (!word) continue;
    if (word.trim() === '' && currentLine === '') continue;

    const testLine = currentLine + word;
    if (ctx.measureText(testLine).width > maxWidth) {
      if (currentLine !== '') {
        lines.push(currentLine.trimEnd());
        currentLine = word.trimStart();
      } else {
        lines.push(testLine);
        currentLine = '';
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trimEnd());
  }
  return lines;
}

function drawRoundedRect(ctx, x, y, w, h, r, fill, stroke = null, shadow = false) {
  ctx.save();
  if (shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.05)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 12;
  }
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.restore();
}

function drawCircleImage(ctx, img, cx, cy, r) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

async function render(username, chatText, avatarSrc) {
  await prepareAssets();

  const templateImage = global.ttqcCache.templateImage;
  const avatarImage   = await loadImageSmart(avatarSrc);

  const canvas = createCanvas(1080 * 2, 2280 * 2);
  const ctx    = canvas.getContext('2d');

  ctx.scale(2, 2);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.clearRect(0, 0, 1080, 2280);
  if (templateImage) {
    ctx.drawImage(templateImage, 0, 0, 1080, 2280);
  }

  drawCircleImage(ctx, avatarImage, canvasConfig.topPPX, canvasConfig.topPPY, canvasConfig.topPPRadius);

  ctx.font = `bold ${canvasConfig.topNameSize}px 'Plus Jakarta Sans', 'Noto Color Emoji'`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(username, canvasConfig.topNameX, canvasConfig.topNameY);

  ctx.font = `500 ${canvasConfig.textSize}px 'Plus Jakarta Sans', 'Noto Color Emoji'`;
  
  const lines = wrapText(ctx, chatText, canvasConfig.bubbleWidth - 52);
  const lineH = canvasConfig.textSize * 1.45;

  let maxW = 0;
  for (const l of lines) {
    const w = ctx.measureText(l).width;
    if (w > maxW) maxW = w;
  }

  const padX = 30, padY = 24;
  const bubbleW = Math.max(maxW + padX * 2, 180);
  const bubbleH = lines.length * lineH + padY * 2;
  const bubbleX = canvasConfig.textX - padX;
  const bubbleY = canvasConfig.textY - padY;

  drawCircleImage(ctx, avatarImage, canvasConfig.chatPPX, bubbleY + bubbleH / 2, canvasConfig.chatPPRadius);
  drawRoundedRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 35, canvasConfig.bubbleBgColor);

  ctx.fillStyle = canvasConfig.textColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  lines.forEach((line, i) => {
    const lineY = canvasConfig.textY + i * lineH + canvasConfig.textSize / 2;
    ctx.fillText(line, canvasConfig.textX, lineY);
  });

  const menuX = 90, menuY = bubbleY + bubbleH + 28;
  drawRoundedRect(ctx, menuX, menuY, 565, 580, 40, '#ffffff', 'rgba(0,0,0,0.02)', true);

  const itemH = 90, iconX = menuX + 60, labelX = menuX + 130;
  MENU_ICONS.forEach((item, i) => {
    const cy = menuY + 25 + i * itemH + itemH / 2;
    ctx.fillStyle = item.color;
    ctx.font = `900 34px 'Font Awesome 6 Free'`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.unicode, iconX, cy);
    ctx.font = `500 34px 'Plus Jakarta Sans'`;
    ctx.textAlign = 'left';
    ctx.fillText(item.text, labelX, cy);
  });

  ctx.restore();

  return await canvas.encode('png');
}

const pluginConfig = {
  name: "ttqc",
  alias: ["tiktokquote", "ttq"],
  category: "canvas",
  description: "Buat fake quote chat ala TikTok",
  usage: ".ttqc <teks> (atau reply teks)",
  example: ".ttqc Hallo Dunia",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  let text = m.args.join(" ");
  let targetJid = m.sender;
  let targetName = m.pushName;

  if (m.quoted && m.quoted.text) {
    if (!text) text = m.quoted.text;
    targetJid = m.quoted.sender;
    targetName = m.quoted.pushName || (await sock.getName(targetJid)) || "User";
  }

  if (!text) {
    return m.reply(
      `💬 *ᴛɪᴋᴛᴏᴋ ǫᴜᴏᴛᴇ*\n\n> Masukkan teks atau reply pesan yang ingin dijadikan quote.\n\n\`Contoh: ${m.prefix}ttqc Hallo Dunia\``,
    );
  }

  m.react("🕕");

  try {
    let ppUrl;
    try {
      ppUrl = await sock.profilePictureUrl(targetJid, "image");
    } catch {
      ppUrl = "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/6b71d84a580f385bd7ee36402df5341ead4770a0/Image/artworks-gWLRE6HyPH3DgVMG-ZFFxtg-t500x500.jpg";
    }

    const imageBuffer = await render(targetName, text, ppUrl);

    m.react("✅");
    await sock.sendMessage(m.chat, { 
      image: imageBuffer, 
      caption: `💬 *TikTok Quote*` 
    }, { quoted: m });
  } catch (error) {
    console.error(error);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
