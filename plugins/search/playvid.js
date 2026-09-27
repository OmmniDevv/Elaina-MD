/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import yts from "yt-search";
import ytdl from "../../src/scraper/ytdl.js";

const pluginConfig = {
  name: "playvid",
  alias: ["playvideo", "playmp4"],
  category: "search",
  description: "Cari dan putar video dari YouTube",
  usage: ".playvid <query>",
  example: ".playvid windah basudara",
  cooldown: 15,
  energi: 2,
  isEnabled: true,
};

function formatViews(n) {
  if (!n) return "0";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toString();
}

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

async function handler(m, { sock, text }) {
  const query = m.text?.trim();
  if (!query) {
    return m.reply(`Halo *${m.pushName}* 👋\n\nUntuk mencari dan memutar video dari YouTube, silakan gunakan format:\n- \`${m.prefix}playvid <judul video>\`\n\nContoh:\n- \`${m.prefix}playvid windah basudara\``);
  }

  m.react("🕕");

  try {
    const search = await yts(query);
    if (!search.videos.length) throw new Error("Video tidak ditemukan");
    const video = search.videos[0];

    let info = `Halo *${m.pushName}*, ini video yang kamu cari:\n\n`;
    info += `📌 *Judul:* ${video.title}\n`;
    info += `👤 *Channel:* ${video.author.name}\n`;
    info += `⏱️ *Durasi:* ${video.duration.timestamp}\n`;
    info += `👀 *Views:* ${formatViews(video.views)}\n`;
    info += `📅 *Upload:* ${video.ago}\n\n`;
    info += `_⏳ Sedang mengunduh video, harap tunggu sebentar ya..._`;

    await sock.sendPreview(
      m.chat,
      {
        caption: video.url + "\n" + info,
        url: video.url,
        title: video.title,
        description: "YouTube Video",
        image: video.thumbnail,
        previewType: 1,
      },
      {
        quoted: m,
      },
    );

    const downloadUrl = await getVideoDownloadUrl(video.url);

    await sock.sendMedia(m.chat, downloadUrl, null, m, {
      type: "video",
    });

    m.react("✅");
  } catch (err) {
    console.error("[PlayVid]", err);
    m.react("❌");
    m.reply(
      `Maaf *${m.pushName}*, fitur putar videonya sedang ada kendala atau video tersebut terlalu besar. Silakan coba lagi nanti ya!`,
    );
  }
}

export { pluginConfig as config, handler };
