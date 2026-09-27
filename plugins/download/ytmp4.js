/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import ytdl from "../../src/scraper/ytdl.js";
import config from "../../config.js";
const pluginConfig = {
  name: "ytmp4",
  alias: ["youtubemp4", "ytvideo"],
  category: "download",
  description: "Download video YouTube",
  usage: ".ytmp4 <url>",
  example: ".ytmp4 https://youtube.com/watch?v=xxx",
  cooldown: 20,
  energi: 2,
  isEnabled: true,
};


async function getVideoDownloadUrl(url) {
  try {
    const { data } = await axios.get(
      `https://my.izuka-api.xyz/api/downloader/ytmp4?url=${encodeURIComponent(url)}`
    );

    if (data?.status && data?.result?.video_normal) {
      const videos = data.result.video_normal.filter(v => v.ext === "mp4");
      if (videos.length > 0) {
        videos.sort((a, b) => parseInt(b.quality) - parseInt(a.quality));
        if (videos[0] && videos[0].url) {
          return videos[0].url;
        }
      }
    }
  } catch (e) {
    console.error("[YTMP4 Izuka API Error]", e.message);
  }

  const fallback = await ytdl(url, "mp4");
  if (fallback?.status && fallback?.dl) {
    return fallback.dl;
  }

  throw new Error(fallback?.mess || "Gagal mendapatkan video download URL");
}

async function handler(m, { sock }) {
  const url = m.text?.trim();
  if (!url)
    return m.reply(`Contoh: ${m.prefix}ytmp4 https://youtube.com/watch?v=xxx`);
  if (!url.includes("youtube.com") && !url.includes("youtu.be"))
    return m.reply("❌ URL harus YouTube");

  m.react("🕕");

  try {
    const downloadUrl = await getVideoDownloadUrl(url);

    await sock.sendMedia(m.chat, downloadUrl, null, m, {
      type: "video",
    });
    m.react("✅");
  } catch (err) {
    console.error("[YTMP4]", err);
    m.react("❌");
    m.reply("Gagal mengunduh video.");
  }
}

export { pluginConfig as config, handler };
