/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import os from "os";
import path from "path";
import { DailymotionDL } from "../../src/scraper/dailymotion.js";

const exec = promisify(execFile);

const pluginConfig = {
  name: "dailymotiondl",
  alias: ["dailymotion", "dmdl"],
  category: "download",
  description: "Download video dari Dailymotion",
  usage: ".dailymotiondl <url>",
  example: ".dailymotiondl https://www.dailymotion.com/video/xxx",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.text?.trim();
  if (!text) {
    m.react("❌");
    return m.reply(
      `🎬 *Dailymotion Downloader*\n\n` +
        `Download video dari Dailymotion, otomatis dikonversi ke MP4.\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}dailymotiondl <link>*\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}dailymotiondl https://www.dailymotion.com/video/xxx*\n\n` +
        `_Proses konversi mungkin agak lama_`,
    );
  }

  m.react("🕕");

  try {
    const result = await DailymotionDL(text);

    if (!result.status) {
      m.react("☢");
      return m.reply(`❌ *Dailymotion Gagal*\n\n> ${result.error}`);
    }

    let caption =
      `🎬 *Dailymotion*\n\n` +
      `> 📌 ${result.title}\n` +
      `> ⏱️ Durasi: ${result.duration}\n` +
      `> 📺 Kualitas: ${result.quality}`;

    if (result.thumbnail) {
      await sock.sendMedia(m.chat, result.thumbnail, caption, m, {
        type: "image",
      });
    }

    if (result.video) {
      const tmpFile = path.join(os.tmpdir(), `dm_${Date.now()}.mp4`);

      await exec(
        "ffmpeg",
        [
          "-y",
          "-i",
          result.video,
          "-c",
          "copy",
          "-bsf:a",
          "aac_adtstoasc",
          tmpFile,
        ],
        { timeout: 120000 },
      );

      const buffer = fs.readFileSync(tmpFile);
      fs.unlinkSync(tmpFile);

      await sock.sendMessage(
        m.chat,
        {
          document: buffer,
          mimetype: "video/mp4",
          fileName:
            (result.title || "video").replace(/[<>:"/\\|?*]/g, "") + ".mp4",
          caption,
        },
        { quoted: m },
      );
    }

    m.react("✅");
  } catch (e) {
    console.error(e);
    m.react("☢");
    m.reply("❌ Gagal mengambil data Dailymotion, coba lagi nanti");
  }
}

export { pluginConfig as config, handler };
