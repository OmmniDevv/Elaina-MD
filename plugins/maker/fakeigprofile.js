/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/*
By : ZenzzXD
Canvas Fake Instagram Profile
Source bahan : https://whatsapp.com/channel/RIMURU_CHANNEL
*/

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import te from "../../src/lib/elaina-error.js";

const config = {
  name: "fakeig",
  alias: ["fakeigprofile", "igprofilememe"],
  category: "maker",
  description: "Membuat gambar Fake Profile Instagram",
  usage: ".fakeig Username | Bio | Postingan | Pengikut | Mengikuti (reply foto)",
  example: ".fakeig King Jenn 👑 | Halo semuanyahh | 12 | 1.123 | 12",
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

const APPLE_EMOJI_JSON_URL = 'https://media.githubusercontent.com/media/Ditzzx-vibecoder/entahlah/main/emoji-apple.json';
let appleEmojiMap = null;
const emojiImageCache = new Map();
const EMOJI_REGEX = /(\p{Emoji_Modifier_Base}\p{Emoji_Modifier}|\p{Emoji_Presentation}\uFE0F?|\p{Emoji}\uFE0F|[\u{1F1E0}-\u{1F1FF}]{2}|\p{Extended_Pictographic}\uFE0F?)/gu;

async function getbufer(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } });
  return Buffer.from(res.data);
}

function drawcircleimg(ctx, img, x, y, size) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, x, y, size, size);
  ctx.restore();
}

async function loadAssets() {
  const ASSETS_DIR = path.join(process.cwd(), 'assets', 'fakeig');
  if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

  const fontPath = path.join(ASSETS_DIR, 'InstagramFont.woff2');
  if (!fs.existsSync(fontPath)) {
    const buf = await getbufer('https://github.com/rsms/inter/raw/refs/heads/master/docs/font-files/Inter-Bold.woff2');
    fs.writeFileSync(fontPath, buf);
  }
  GlobalFonts.registerFromPath(fontPath, 'InstagramBold');
}

function emojiToUnicode(emoji) {
  return [...emoji].map(c => c.codePointAt(0).toString(16).padStart(4, '0')).join('-');
}

async function loadAppleEmojiMap() {
  if (appleEmojiMap) return appleEmojiMap;
  const ASSETS_DIR = path.join(process.cwd(), 'assets', 'fakeig');
  const localJson = path.join(ASSETS_DIR, 'emoji-apple.json');
  if (!fs.existsSync(localJson)) {
    const buf = await getbufer(APPLE_EMOJI_JSON_URL);
    fs.writeFileSync(localJson, buf);
  }
  const raw = fs.readFileSync(localJson, 'utf-8');
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
  ctx.font = `${fontSize}px InstagramBold`;
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
  // 1. Deteksi Foto Profil
  let q = m.quoted ? m.quoted : m;
  const mime = q.mimetype || q.mediaType || q.msg?.mimetype || q.mtype || '';
  const isImage = 
    /image/.test(mime) || 
    q.mtype === "imageMessage" || 
    q.type === "imageMessage" || 
    m.isImage ||
    m.quoted?.isImage;

  if (!isImage) {
    return m.reply(`*Format salah!*\n\nKirim/reply foto profil dengan caption:\n.${m.command} Username | Bio | Postingan | Pengikut | Mengikuti`);
  }

  // 2. Ambil Input Text
  let inputTeks = text || m.text?.replace(new RegExp(`^\\${m.prefix || ''}${m.command}\\s*`, 'i'), '') || '';

  if (!inputTeks || !inputTeks.includes('|')) {
    return m.reply(`*Format salah!*\n\nGunakan tanda garis (|) sebagai pemisah!\nContoh:\n.${m.command} King Jenn 👑 | Halo semuanyahh | 12 | 1.123 | 12`);
  }

  const args = inputTeks.split('|').map(v => v.trim());
  const username = args[0] || 'InstagramUser';
  const bio = args[1] || 'Welcome to my profile';
  const postingan = args[2] || '0';
  const pengikut = args[3] || '0';
  const mengikuti = args[4] || '0';

  m.react("⏳");

  try {
    await loadAssets();

    const bagroundUrl = 'https://uploader.zenzxz.dpdns.org/uploads/1783850965107.png';
    const plusiconUrl = 'https://uploader.zenzxz.dpdns.org/uploads/1783844204892.png';

    // Unduh profil foto
    let ppBuffer = await q.download?.() || await sock.downloadMediaMessage(q);
    if (!ppBuffer) throw new Error("Gagal mengunduh foto profil.");

    const [bgBuffer, plusBuffer] = await Promise.all([
      getbufer(bagroundUrl),
      getbufer(plusiconUrl)
    ]);

    const bg = await loadImage(bgBuffer);
    const ppImg = await loadImage(ppBuffer);
    const plusImg = await loadImage(plusBuffer);

    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');

    // Render Background
    ctx.drawImage(bg, 0, 0, bg.width, bg.height);

    // Render Foto Profil (Circle)
    const ppSize = 145;
    const ppX = 35;
    const ppY = 145;
    drawcircleimg(ctx, ppImg, ppX, ppY, ppSize);

    // Render Badge Plus Icon
    const plusSize = 70;
    const plusX = ppX + ppSize - plusSize + 5;
    const plusY = ppY + ppSize - plusSize + 5;
    ctx.drawImage(plusImg, plusX, plusY, plusSize, plusSize);

    ctx.fillStyle = '#f9fdfe';

    // Render Username
    const usernameFontSize = 25;
    ctx.font = `${usernameFontSize}px InstagramBold`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const usernameX = 190;
    const usernameY = 150;
    await drawTextWithEmojis(ctx, username, usernameX, usernameY, usernameFontSize);

    // Render Statistik (Post, Follower, Following)
    ctx.font = '30px InstagramBold';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    const statY = 210;
    const postinganX = 260;
    const pengikutX = 550;
    const mengikutiX = 850;

    ctx.fillText(postingan.toString(), postinganX, statY);
    ctx.fillText(pengikut.toString(), pengikutX, statY);
    ctx.fillText(mengikuti.toString(), mengikutiX, statY);

    // Render Bio
    const bioX = 35;
    const bioY = 320;
    const bioFontSize = 22;
    const maxBioWidth = 950;

    ctx.font = `${bioFontSize}px InstagramBold`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const bioLines = wrapText(ctx, bio, maxBioWidth, bioFontSize);
    for (let i = 0; i < bioLines.length; i++) {
      await drawTextWithEmojis(ctx, bioLines[i].trim(), bioX, bioY + (i * 30), bioFontSize);
    }

    const hasilBuffer = canvas.toBuffer('image/png');

    m.react("✅");

    await sock.sendMessage(m.chat, {
      image: hasilBuffer,
      caption: `📸 *FAKE INSTAGRAM PROFILE*\n\n👤 *Username:* ${username}\n📝 *Bio:* ${bio}`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.react("☢");
    if (typeof te === "function") {
      m.reply(te(m.prefix, m.command, m.pushName));
    } else {
      m.reply("❌ Gagal membuat fake IG profile:\n" + e.message);
    }
  }
}

export { config, handler };
