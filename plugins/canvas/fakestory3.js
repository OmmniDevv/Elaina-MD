/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";
import config from "../../config.js";
import fs from 'fs'
import * as _canvas from '@napi-rs/canvas'


import axios from "axios";
import te from "../../src/lib/elaina-error.js";
const pluginConfig = {
  name: "fakestory3",
  alias: ["fstory3", "igstory3", "quotestory"],
  category: "canvas",
  description: "Fake Instagram story dengan text overlay",
  usage: ".fakestory3 <nama>|<text1>|<text2>",
  example: ".fakestory3 Misaki|Tersenyumlah|untuk menutupi kesedihan",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};
const canvasConfig = {
  width: 720,
  cardBg: "#121212",
  textColor: "#ffffff",
  cornerRadius: 35,
};
const icons = {
  heart:
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  comment:
    "M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z",
  share: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z",
  options:
    "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
};
function roundedRectPath(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
function drawAvatar(ctx, img, x, y, size) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, x, y, size, size);
  ctx.restore();
}
function drawCoverImage(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const canvasRatio = w / h;
  let drawW, drawH, drawX, drawY;
  if (imgRatio > canvasRatio) {
    drawH = h;
    drawW = h * imgRatio;
    drawX = x - (drawW - w) / 2;
    drawY = y;
  } else {
    drawW = w;
    drawH = w / imgRatio;
    drawX = x;
    drawY = y - (drawH - h) / 2;
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();
}
function drawBlurredBackground(ctx, canvas, imgTop, imgBottom) {
  const w = canvas.width;
  const h = canvas.height;
  ctx.save();
  ctx.filter = "blur(30px) brightness(30%)";
  const bleed = 40;
  drawCoverImage(ctx, imgTop, -bleed, -bleed, w + bleed * 2, h / 2 + bleed);
  drawCoverImage(ctx, imgBottom, -bleed, h / 2, w + bleed * 2, h / 2 + bleed);
  ctx.restore();
}
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine + (currentLine ? " " : "") + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}
async function createFakeStory(
  username,
  avatarBuffer,
  imageTopBuffer,
  imageBottomBuffer,
  text1,
  text2,
) {
  const { createCanvas, loadImage, Path2D } = _canvas;
  const height = 1150;
  const canvas = createCanvas(canvasConfig.width, height);
  const ctx = canvas.getContext("2d");
  const avatar = await loadImage(avatarBuffer);
  const imgTop = await loadImage(imageTopBuffer);
  const imgBottom = await loadImage(imageBottomBuffer);
  drawBlurredBackground(ctx, canvas, imgTop, imgBottom);
  const cardMarginX = 25;
  const cardMarginY = 60;
  const cardW = canvasConfig.width - cardMarginX * 2;
  const cardH = height - cardMarginY * 2;
  const cardX = cardMarginX;
  const cardY = cardMarginY;
  ctx.save();
  roundedRectPath(ctx, cardX, cardY, cardW, cardH, canvasConfig.cornerRadius);
  ctx.fillStyle = canvasConfig.cardBg;
  ctx.fill();
  ctx.clip();
  const headerHeight = 90;
  const avatarSize = 45;
  drawAvatar(ctx, avatar, cardX + 20, cardY + 22, avatarSize);
  ctx.font = "bold 18px Arial";
  ctx.fillStyle = canvasConfig.textColor;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(username, cardX + 80, cardY + 45);
  ctx.save();
  ctx.translate(cardX + cardW - 40, cardY + 45);
  ctx.rotate((90 * Math.PI) / 180);
  const pOpts = new Path2D(icons.options);
  ctx.fillStyle = "white";
  ctx.fill(pOpts);
  ctx.restore();
  const footerHeight = 70;
  const contentAvailableHeight = cardH - headerHeight - footerHeight;
  const singleImageHeight = contentAvailableHeight / 2;
  drawCoverImage(
    ctx,
    imgTop,
    cardX,
    cardY + headerHeight,
    cardW,
    singleImageHeight,
  );
  if (text1) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 8;
    const lines1 = wrapText(ctx, text1, cardW - 60);
    const textY1 =
      cardY + headerHeight + singleImageHeight - 30 - lines1.length * 24;
    lines1.forEach((line, i) => {
      ctx.fillText(line, cardX + cardW / 2, textY1 + i * 24);
    });
    ctx.shadowBlur = 0;
  }
  drawCoverImage(
    ctx,
    imgBottom,
    cardX,
    cardY + headerHeight + singleImageHeight,
    cardW,
    singleImageHeight,
  );
  if (text2) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 8;
    const lines2 = wrapText(ctx, text2, cardW - 60);
    const textY2 =
      cardY + headerHeight + singleImageHeight * 2 - 30 - lines2.length * 24;
    lines2.forEach((line, i) => {
      ctx.fillText(line, cardX + cardW / 2, textY2 + i * 24);
    });
    ctx.shadowBlur = 0;
  }
  const iconY = cardY + cardH - footerHeight / 2;
  function drawSvgOutline(pathData, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.translate(-12, -12);
    const p = new Path2D(pathData);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1.8;
    ctx.stroke(p);
    ctx.restore();
  }
  drawSvgOutline(icons.heart, cardX + 40, iconY, 1.3);
  drawSvgOutline(icons.comment, cardX + 100, iconY, 1.2);
  drawSvgOutline(icons.share, cardX + 160, iconY, 1.2);
  ctx.restore();
  return await canvas.encode("png");
}
const DEFAULT_PP_PATH = getAssetBuffer("pp-kosong");
async function getProfilePicture(sock, jid) {
  try {
    const pp = await sock.profilePictureUrl(jid, "image");
    return pp || null;
  } catch {
    return null;
  }
}
async function downloadImage(url) {
  const res = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 15000,
  });
  return Buffer.from(res.data);
}
async function getAvatarBuffer(sock, jid) {
  try {
    const ppUrl = await getProfilePicture(sock, jid);
    if (ppUrl) {
      return await downloadImage(ppUrl);
    }
  } catch {}
  if (fs.existsSync(DEFAULT_PP_PATH)) {
    return fs.readFileSync(DEFAULT_PP_PATH);
  }
  throw new Error("Tidak dapat mengambil foto profil");
}
async function handler(m, { sock }) {
  const input = m.args.join(" ");
  if (!input || !input.includes("|")) {
    return m.reply(
      `📷 *ꜰᴀᴋᴇ sᴛᴏʀʏ 3*\n\n` +
        `> Reply gambar dengan format:\n` +
        `> \`${m.prefix}fakestory3 nama|text1|text2\`\n\n` +
        `> Contoh:\n` +
        `> \`${m.prefix}fakestory3 Misaki|Tersenyumlah|untuk menutupi kesedihan\``,
    );
  }
  const parts = input.split("|").map((s) => s.trim());
  const username = parts[0] || m.pushName || "User";
  const text1 = parts[1] || "";
  const text2 = parts[2] || "";
  m.react("🕕");
  try {
    const avatarBuffer = await getAvatarBuffer(sock, m.sender);
    const isImage = m.isImage || (m.quoted && m.quoted.isImage);
    if (!isImage) {
      m.react("❌");
      return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Reply gambar untuk membuat fake story!`);
    }
    let imageBuffer;
    if (m.isImage && m.download) {
      imageBuffer = await m.download();
    } else if (m.quoted && m.quoted.isImage && m.quoted.download) {
      imageBuffer = await m.quoted.download();
    }
    if (!imageBuffer) {
      m.react("❌");
      return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Tidak bisa download gambar`);
    }
    const resultBuffer = await createFakeStory(
      username,
      avatarBuffer,
      imageBuffer,
      imageBuffer,
      text1,
      text2,
    );
    await sock.sendMessage(
      m.chat,
      {
        image: resultBuffer,
        caption: `📷 *ꜰᴀᴋᴇ sᴛᴏʀʏ*\n\n> ᴜsᴇʀɴᴀᴍᴇ: \`${username}\``,
      },
      { quoted: m },
    );
    m.react("✅");
  } catch (error) {
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}
export { pluginConfig as config, handler };
