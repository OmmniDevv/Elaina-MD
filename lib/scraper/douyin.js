/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";

async function DouyinDL(douyinUrl) {
  const response = await axios.post(
    "https://snapvideotools.com/api/snap",
    { text: douyinUrl },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://snapvideotools.com/",
        Origin: "https://snapvideotools.com",
      },
    },
  );

  const data = response.data.data;

  if (!data || !data.mediaUrls) {
    return {
      status: false,
      error: "Data tidak ditemukan",
    };
  }

  const video = data.mediaUrls.find((m) => m.type === "video");
  const audio = data.mediaUrls.find((m) => m.type === "audio");

  return {
    status: true,
    title: data.title,
    platform: data.platformName,
    video: video ? video.url : null,
    audio: audio ? audio.url : null,
  };
}

export { DouyinDL };
