/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from "fs";
import path from "path";
import cekfemboy from "../../src/scraper/lufemboy.js";
import { queueFFmpeg } from "../../src/lib/elaina-ffmpeg.js";
import { fetchBuffer } from "../../src/lib/elaina-utils.js";
import te from "../../src/lib/elaina-error.js";
const pluginConfig = {
  name: "cekfemboy",
  alias: ["femboy"],
  category: "cek",
  description: "Cek seberapa femboy kamu",
  usage: ".cekfemboy <nama>",
  example: ".cekfemboy Budi",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function convertGifToMp4(buffer) {
  const tempPath = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath, { recursive: true });

  const id = Date.now();
  const gifPath = path.join(tempPath, `cekfemboy-${id}.gif`);
  const mp4Path = path.join(tempPath, `cekfemboy-${id}.mp4`);

  try {
    fs.writeFileSync(gifPath, buffer);
    await queueFFmpeg(
      `ffmpeg -y -ignore_loop 0 -i "${gifPath}" -t 30 -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -pix_fmt yuv420p -movflags faststart -preset ultrafast -an "${mp4Path}"`,
    );
    if (!fs.existsSync(mp4Path)) throw new Error("Gagal convert GIF");
    return fs.readFileSync(mp4Path);
  } finally {
    try {
      if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath);
    } catch {}
    try {
      if (fs.existsSync(mp4Path)) fs.unlinkSync(mp4Path);
    } catch {}
  }
}

async function handler(m, { sock }) {
  const mentioned = m.mentionedJid[0] || m.sender;
  const inputName = m.text?.trim();
  const nama =
    mentioned === m.sender
      ? inputName || m.pushName || "Kamu"
      : `@${mentioned.split("@")[0]}`;

  try {
    const result = cekfemboy(nama);

    let buffer = null;
    try {
      buffer = await fetchBuffer(result.gif);
    } catch (e) {}

    let videoBuffer = null;
    if (buffer) {
      try {
        videoBuffer = await convertGifToMp4(buffer);
      } catch (e) {}
    }

    let txt =
      mentioned === m.sender
        ? `Hai @${mentioned.split("@")[0]}

${result.hasil}`
        : `Kamu ingin ngecek tingkat kefemboyan @${mentioned.split("@")[0]} yak? 

${result.hasil}`;

    if (videoBuffer) {
      return sock.sendMedia(m.chat, videoBuffer, txt, m, {
        type: "video",
        mimetype: "video/mp4",
        gifPlayback: true,
        mentions: [mentioned],
      });
    }

    await m.reply(txt, { mentions: [mentioned] });
  } catch (err) {
    return m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
