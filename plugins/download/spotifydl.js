/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";

const pluginConfig = {
  name: "spotifydl",
  alias: ["spdl", "spotify-dl", "spotdl"],
  category: "download",
  description: "Unduh lagu favoritmu langsung dari Spotify tanpa ribet!",
  usage: ".spdl <link>",
  example: ".spdl https://open.spotify.com/track/...",
  cooldown: 15,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.text?.trim();

  if (!text || !/open\.spotify\.com\/track/i.test(text)) {
    return m.reply("❌ *Waduh, link Spotify-nya mana nih atau kurang tepat!*\n\nKamu harus memasukkan tautan (link) lagu dari Spotify yang valid. Pastikan itu adalah link ke track/lagu ya! \n\nContoh: `.spdl https://open.spotify.com/track/3RY0NyQQXxuAiyk5eAS4fC`");
  }

  await m.react("🕕");

  try {
    const apiUrl = `https://api.nexray.eu.cc/downloader/spotify?url=${encodeURIComponent(text)}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data.status || !data.result || !data.result.url) {
      await m.react("❌");
      return m.reply("⚠️ *Gagal mengambil lagu!* \n\nServer tidak merespon dengan tautan unduhan yang valid.");
    }

    const { title, artist, url } = data.result;
    const filename = `${artist || "Spotify"} - ${title || "Audio"}.mp3`;

    await sock.sendMessage(m.chat, {
      audio: { url: url },
      mimetype: "audio/mpeg",
      fileName: filename,
      ptt: false
    }, { quoted: m });

    await m.react("✅");

  } catch (error) {
    console.error("[Spotify DL Error]", error);
    await m.react("❌");
    m.reply("😔 *Terjadi kesalahan sistem saat memproses tautan Spotify tersebut.* Mohon coba lagi nanti ya!");
  }
}

export { pluginConfig as config, handler };
