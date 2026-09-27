/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import yts from "yt-search";
import config from "../../config.js";

const pluginConfig = {
  name: "play",
  alias: ["playaudio"],
  category: "search",
  description: "Putar musik dari YouTube",
  usage: ".play <query>",
  example: ".play komang",
  cooldown: 15,
  energi: 1,
  isEnabled: true,
};

function formatViews(n) {
  if (!n) return "0";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toString();
}

async function handler(m, { sock, text }) {
  const query = m.text?.trim();
  if (!query)
    return m.reply(`🎵 *ᴘʟᴀʏ*\n\n> Contoh:\n\`${m.prefix}play komang\``);

  m.react("🕐");

  try {
    const search = await yts(query);
    if (!search.videos.length) throw new Error("Video tidak ditemukan");
    const video = search.videos[0];

    const res = await axios.get(`https://api.azbry.com/api/download/ytmp3?url=${encodeURIComponent(video.url)}`, { timeout: 60000 });
    const data = res.data;
    
    if (!data.status || !data.result || !data.result.download) {
       throw new Error("Gagal mengambil audio dari API");
    }

    let info = `🎵 *NOW PLAYING*\n\n`;
    info += `📌 *Judul:* ${video.title}\n\n`;
    info += `*DETAIL*\n`;
    info += `👤 Channel: *${video.author.name}*\n`;
    info += `⏱️ Durasi: *${video.duration.timestamp}*\n`;
    info += `👀 Views: *${formatViews(video.views)}*\n`;
    info += `📅 Upload: *${video.ago}*\n`;
    info += `🆔 ID: \`${video.videoId}\`\n\n`;
    if (video.description) {
      const desc = video.description.substring(0, 150).replace(/\n/g, " ");
      info += `*Deskripsi:*\n_${desc}${video.description.length > 150 ? "..." : ""}_\n\n`;
    }
    info += `🔗 ${video.url}\n\n`;
    info += `_⏳ mengirim audio, harap tunggu..._`;

    await sock.sendPreview(
      m.chat,
      {
        caption: `${info}`,
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

    const audioRes = await axios.get(data.result.download, { responseType: "arraybuffer", timeout: 60000 });
    const audioBuffer = Buffer.from(audioRes.data);

    await sock.sendMessage(
      m.chat,
      {
        audio: audioBuffer,
        mimetype: "audio/mpeg",
        ptt: false,
        fileName: `${video.title}.mp3`,
      },
      { quoted: m },
    );

    m.react("✅");
  } catch (err) {
    console.error("[Play]", err);
    m.react("😭");
    m.reply(
      `Wahhh, fitur putar musiknya lagi ada kendala kak, coba lagi nanti yak, jangan spam`,
    );
  }
}

export { pluginConfig as config, handler };
