/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage } from "@napi-rs/canvas";

function getTokenWidth(ctx, token, fontSize) {
  if (token.type === "space") return ctx.measureText(" ").width;
  if (token.type === "emoji") return fontSize * 1.15;
  return ctx.measureText(token.value || "").width;
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

export function tokenize(text) {
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

export async function drawBrat({
  text,
  bgUrl,
  bgColor,
  width,
  height,
  centerX,
  centerY,
  maxWidth,
  maxHeight,
  rotationAngle = 0,
  maxFontSize = 130,
  minFontSize = 10,
  fontDecrement = 2,
  lineHeightMult = 1.2,
  textColor = "#000000",
  align = "center",
  textBaseline = "middle"
}) {
  let bg = null;
  if (bgUrl) {
    bg = await loadImage(bgUrl);
    width = width || bg.width;
    height = height || bg.height;
  }
  
  const canvas = createCanvas(width || 512, height || 512);
  const ctx = canvas.getContext("2d");

  if (bg) {
    ctx.drawImage(bg, 0, 0, width, height);
  } else if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  const tokens = tokenize(text);
  let fontSize = maxFontSize;
  let lines = buildLines(ctx, tokens, fontSize, maxWidth);

  while (fontSize > minFontSize) {
    lines = buildLines(ctx, tokens, fontSize, maxWidth);
    const totalH = lines.length * fontSize * lineHeightMult;
    if (totalH <= maxHeight) break;
    fontSize -= fontDecrement;
  }

  const lineHeight = fontSize * lineHeightMult;
  const totalHeight = lines.length * lineHeight;

  const cx = typeof centerX === 'function' ? centerX(width, height) : (centerX || width / 2);
  const cy = typeof centerY === 'function' ? centerY(width, height) : (centerY || height / 2);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotationAngle);
  ctx.fillStyle = textColor;
  ctx.textBaseline = textBaseline;

  let startY = -(totalHeight / 2) + (lineHeight / 2);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const y = startY + i * lineHeight;
    ctx.font = `bold ${fontSize}px sans-serif`;

    let currentX = align === "center" ? -line.width / 2 : -(maxWidth / 2);

    for (const token of line.items) {
      if (token.type === "text") {
        ctx.fillText(token.value, currentX, y);
        currentX += token.w;
      } else if (token.type === "space") {
        currentX += token.w;
      }
    }
  }

  ctx.restore();
  return canvas.encode("png");
}
