/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from "axios";
import * as cheerio from "cheerio";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: ["tiklydown", "ttdl2", "tiktokalt"],
  alias: [],
  category: "elaina",
  description: "Downloader TikTok alternatif",
  usage: ".tiklydown <url>",
  example: ".tiklydown https://vt.tiktok.com/xxxx",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function fetchTikTok(url) {
  const { data: html } = await axios.post(
    "https://api.ttsave.app/",
    {
      id: url,
      hash: "eabd36f82466974a4527e6b997da38bf",
      mode: "video",
      locale: "id",
      loading_indicator_url: "https://ttsave.app/images/slow-down.gif",
      unlock_url: "https://ttsave.app/id/unlock",
    },
    {
      timeout: 45000,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/json",
      },
    }
  );

  const $ = cheerio.load(html);
  const video =
    $('a[type="no-watermark"]').attr("href") ||
    $('a[type="watermark"]').attr("href");

  if (!video) throw new Error("Video TikTok tidak ditemukan.");
  return video;
}

async function handler(m, { sock }) {
  const url = m.text?.trim();
  if (!url || !/tiktok\.com|vm\.tiktok|vt\.tiktok/i.test(url)) {
    return m.reply(`🎵 Masukkan link TikTok.\n\nContoh: ${m.prefix}${m.command} https://vt.tiktok.com/xxxx`);
  }

  await m.react("⬇️");
  try {
    const video = await fetchTikTok(url);
    await m.react("✅");
    return sock.sendMedia(m.chat, video, "🎵 *TIKTOK ALT DOWNLOADER*\n\nTanpa watermark jika tersedia.", m, { type: "video", mimetype: "video/mp4" });
  } catch (error) {
    await m.react("❌");
    return m.reply(`❌ *TikTok Alt Error*\n\n${te(m.prefix, m.command, error?.message || "Gagal mengunduh.")}`);
  }
}

export { pluginConfig as config, handler };
