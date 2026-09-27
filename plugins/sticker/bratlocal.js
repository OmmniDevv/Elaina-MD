/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import fetch from "node-fetch";
import te from "../../src/lib/elaina-error.js";
import config from "../../config.js";

const execFileAsync = promisify(execFile);

const pluginConfig = {
  name: "bratlocal",
  alias: ["bratgojo", "bratgojovid", "bratvermeil", "bratvermeilvid"],
  category: "canvas",
  description: "Bikin brat versi lokal (Gojo & Vermeil)",
  usage: ".bratgojo <teks>",
  example: ".bratgojo Halo",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 2,
  isEnabled: true,
};

const BRAT_FONT_URL = "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Poppins.ttf";
let isFontLoaded = false;

const TEMPLATES = {
  vermeil: {
    url: "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Vermile.jpg",
    safeZone: { a: 655, b: 1118, c: 282, d: 993 }
  },
  gojo: {
    url: "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Gojo.jpeg",
    safeZone: { a: 660, b: 1180, c: 270, d: 990 }
  }
};

const CANVAS = { width: 1254, height: 1254 };

const TEXT_STYLE = {
  fontFamily: "Poppins",
  maxFontSize: 90,
  minFontSize: 22,
  lineHeight: 1.18,
  color: "#111111",
  align: "center"
};

const VIDEO_CONFIG = {
  outputFormat: "mp4",
  fast_progress: true,
  fps: 15,
  width: 512,
  height: 512,
  lyric: {
    maxWordPerLayer: 5,
    frameDuration: 0.7,
    lastFrameDuration: 1.5
  }
};

async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Gagal download: ${res.status} ${res.statusText}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

function normalizeText(text) {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function tokenize(text) {
  return normalizeText(text)
    .replace(/[,，]/g, " ")
    .split(/\s+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function splitIntoLayers(tokens, maxWordPerLayer) {
  if (!Number.isFinite(maxWordPerLayer) || maxWordPerLayer <= 0) {
    return [tokens];
  }
  const layers = [];
  for (let i = 0; i < tokens.length; i += maxWordPerLayer) {
    layers.push(tokens.slice(i, i + maxWordPerLayer));
  }
  return layers;
}

function resolveDurations(frames, lyric) {
  return frames.map((frame) => {
    return frame.isLastInLayer
      ? Math.max(0.05, lyric.lastFrameDuration)
      : Math.max(0.05, lyric.frameDuration);
  });
}

function buildRevealFrames(text, configObj) {
  const tokens = tokenize(text);
  const layers = splitIntoLayers(tokens, configObj.lyric.maxWordPerLayer);
  const frames = [];

  for (const layer of layers) {
    let current = "";
    for (let i = 0; i < layer.length; i++) {
      current += (current ? " " : "") + layer[i];
      frames.push({
        text: current,
        isLastInLayer: i === layer.length - 1
      });
    }
  }

  const durations = resolveDurations(frames, configObj.lyric);
  return frames.map((frame, index) => ({
    ...frame,
    duration: durations[index]
  }));
}

function getSafeRect(zone) {
  return {
    x: zone.c,
    y: zone.a,
    w: zone.d - zone.c,
    h: zone.b - zone.a,
    centerX: (zone.c + zone.d) / 2,
    centerY: (zone.a + zone.b) / 2
  };
}

function setFont(ctx, size) {
  ctx.font = `${size}px ${TEXT_STYLE.fontFamily}`;
}

function splitLongWord(ctx, word, maxWidth) {
  const chars = [...word];
  const parts = [];
  let current = "";

  for (const char of chars) {
    const test = current + char;
    if (ctx.measureText(test).width <= maxWidth || !current) {
      current = test;
    } else {
      parts.push(current);
      current = char;
    }
  }

  if (current) {
    parts.push(current);
  }
  return parts;
}

function wrapParagraph(ctx, paragraph, maxWidth) {
  const words = paragraph.split(" ").filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
      continue;
    }

    if (current) {
      lines.push(current);
      current = "";
    }

    if (ctx.measureText(word).width <= maxWidth) {
      current = word;
    } else {
      const parts = splitLongWord(ctx, word, maxWidth);
      lines.push(...parts.slice(0, -1));
      current = parts.at(-1) || "";
    }
  }

  if (current) {
    lines.push(current);
  }
  return lines;
}

function wrapText(ctx, text, maxWidth) {
  return text
    .split("\n")
    .flatMap((paragraph) => {
      const clean = paragraph.trim();
      if (!clean) {
        return [""];
      }
      return wrapParagraph(ctx, clean, maxWidth);
    });
}

function fitText(ctx, text, rect) {
  for (let size = TEXT_STYLE.maxFontSize; size >= TEXT_STYLE.minFontSize; size--) {
    setFont(ctx, size);
    const lineHeight = Math.ceil(size * TEXT_STYLE.lineHeight);
    const lines = wrapText(ctx, text, rect.w);
    const totalHeight = lines.length * lineHeight;

    if (totalHeight <= rect.h) {
      return { size, lines, lineHeight, totalHeight };
    }
  }

  const size = TEXT_STYLE.minFontSize;
  setFont(ctx, size);
  const lineHeight = Math.ceil(size * TEXT_STYLE.lineHeight);
  const lines = wrapText(ctx, text, rect.w);
  const maxLines = Math.max(1, Math.floor(rect.h / lineHeight));
  const clipped = lines.slice(0, maxLines);

  if (lines.length > maxLines && clipped.length) {
    let last = clipped[clipped.length - 1];
    while (last.length > 0 && ctx.measureText(`${last}...`).width > rect.w) {
      last = last.slice(0, -1);
    }
    clipped[clipped.length - 1] = `${last}...`;
  }

  return {
    size,
    lines: clipped,
    lineHeight,
    totalHeight: clipped.length * lineHeight
  };
}

function drawCenteredText(ctx, text, zone) {
  const rect = getSafeRect(zone);
  const fitted = fitText(ctx, text, rect);
  const startY = rect.y + (rect.h - fitted.totalHeight) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();

  setFont(ctx, fitted.size);
  ctx.fillStyle = TEXT_STYLE.color;
  ctx.textAlign = TEXT_STYLE.align;
  ctx.textBaseline = "top";

  fitted.lines.forEach((line, index) => {
    const y = startY + index * fitted.lineHeight;
    ctx.fillText(line, rect.centerX, y);
  });

  ctx.restore();
}

async function createBratImage(text, template) {
  if (!isFontLoaded) {
    const fontBuffer = await downloadBuffer(BRAT_FONT_URL);
    GlobalFonts.register(fontBuffer, TEXT_STYLE.fontFamily);
    isFontLoaded = true;
  }

  const imageBuffer = await downloadBuffer(template.url);
  const image = await loadImage(imageBuffer);
  const canvas = createCanvas(CANVAS.width, CANVAS.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0, CANVAS.width, CANVAS.height);
  drawCenteredText(ctx, text, template.safeZone);

  return await canvas.encode("png");
}

async function createFrame(image, text, filePath, template) {
  const canvas = createCanvas(CANVAS.width, CANVAS.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0, CANVAS.width, CANVAS.height);
  drawCenteredText(ctx, text, template.safeZone);

  fs.writeFileSync(filePath, await canvas.encode("png"));
}

function escapeConcatPath(filePath) {
  return filePath.replace(/'/g, "'\\''");
}

function buildManifest(frames, framePaths) {
  const lines = [];
  for (let i = 0; i < frames.length; i++) {
    lines.push(`file '${escapeConcatPath(framePaths[i])}'`);
    lines.push(`duration ${frames[i].duration}`);
  }
  lines.push(`file '${escapeConcatPath(framePaths[framePaths.length - 1])}'`);
  return lines.join("\n");
}

async function encodeVideo(concatPath, outputPath, configObj) {
  if (configObj.outputFormat !== "mp4") {
    throw new Error("Saat ini output hanya support mp4");
  }

  const args = [
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concatPath,
    "-vf", `fps=${configObj.fps},scale=${configObj.width}:${configObj.height}:flags=lanczos`,
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "32",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    outputPath
  ];

  await execFileAsync("ffmpeg", args, { maxBuffer: 1024 * 1024 * 10 });
}

async function createBratVideo(text, template) {
  const frames = buildRevealFrames(text, VIDEO_CONFIG);
  if (!frames.length) {
    throw new Error("Teks kosong");
  }

  const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), "bratvid-"));
  const outputPath = path.join(tmpDir, "output.mp4");

  try {
    if (!isFontLoaded) {
      const fontBuffer = await downloadBuffer(BRAT_FONT_URL);
      GlobalFonts.register(fontBuffer, TEXT_STYLE.fontFamily);
      isFontLoaded = true;
    }

    const imageBuffer = await downloadBuffer(template.url);
    const image = await loadImage(imageBuffer);

    const framePaths = frames.map((_, index) => {
      return path.join(tmpDir, `frame-${String(index + 1).padStart(4, "0")}.png`);
    });

    if (VIDEO_CONFIG.fast_progress) {
      const batchSize = 5;
      for (let start = 0; start < frames.length; start += batchSize) {
        const batch = frames.slice(start, start + batchSize);
        await Promise.all(batch.map((frame, i) => {
          const index = start + i;
          return createFrame(image, frame.text, framePaths[index], template);
        }));
      }
    } else {
      for (let i = 0; i < frames.length; i++) {
        await createFrame(image, frames[i].text, framePaths[i], template);
      }
    }

    const concatPath = path.join(tmpDir, "concat.txt");
    fs.writeFileSync(concatPath, buildManifest(frames, framePaths));

    await encodeVideo(concatPath, outputPath, VIDEO_CONFIG);

    const videoBuffer = fs.readFileSync(outputPath);
    return videoBuffer;
  } finally {
    await fsp.rm(tmpDir, { recursive: true, force: true }).catch(() => { });
  }
}

async function handler(m, { sock }) {
  const text = m.text;
  if (!text) {
    return m.reply(`⚠️ Harap masukkan teksnya!\nContoh: \`${m.prefix}${m.command} Halo semuanya\``);
  }

  await m.react("🕕");

  try {
    const cmd = m.command.toLowerCase();
    let template;
    let isVideo = false;

    if (cmd === "bratgojo") {
      template = TEMPLATES.gojo;
    } else if (cmd === "bratgojovid") {
      template = TEMPLATES.gojo;
      isVideo = true;
    } else if (cmd === "bratvermeil") {
      template = TEMPLATES.vermeil;
    } else if (cmd === "bratvermeilvid") {
      template = TEMPLATES.vermeil;
      isVideo = true;
    } else {
      throw new Error("Command tidak valid");
    }

    const inputText = normalizeText(text);

    if (isVideo) {
      const videoBuffer = await createBratVideo(inputText, template);
      const tempPath = path.join(os.tmpdir(), `bratvid-${Date.now()}.mp4`);
      fs.writeFileSync(tempPath, videoBuffer);

      await sock.sendVideoAsSticker(m.chat, tempPath, m, {
        packname: config.sticker.packname,
        author: config.sticker.author
      });

      try { fs.unlinkSync(tempPath); } catch (e) { }
    } else {
      const imageBuffer = await createBratImage(inputText, template);
      await sock.sendImageAsSticker(m.chat, imageBuffer, m, {
        packname: config.sticker.packname,
        author: config.sticker.author
      });
    }

    await m.react("✅");
  } catch (error) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
