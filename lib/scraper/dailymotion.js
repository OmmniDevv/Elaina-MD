/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";

const getRndIP = () =>
  Array.from({ length: 4 }, () => Math.floor(Math.random() * 255)).join(".");

async function DailymotionDL(url) {
  const fakeIP = getRndIP();

  const response = await axios({
    method: "post",
    url: "https://vidomon.com/wp-json/aio-dl/video-data/",
    data: `url=${encodeURIComponent(url)}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 Chrome/148.0.0.0 Mobile Safari/537.36",
      Referer: `https://vidomon.com/dailymotion-video-downloader/#url=${url}`,
      "X-Forwarded-For": fakeIP,
      "X-Real-IP": fakeIP,
    },
  });

  const data = response.data;

  if (!data.medias || data.medias.length === 0) {
    return {
      status: false,
      error: "Tidak ada media yang tersedia",
    };
  }

  const best = data.medias
    .filter((m) => m.videoAvailable && m.extension === "mp4")
    .sort((a, b) => parseInt(b.quality) - parseInt(a.quality))[0];

  return {
    status: true,
    title: data.title,
    thumbnail: data.thumbnail,
    duration: data.duration,
    source: data.source,
    video: best ? best.url : data.medias[0].url,
    quality: best ? best.quality : data.medias[0].quality,
    medias: data.medias,
  };
}

export { DailymotionDL };
