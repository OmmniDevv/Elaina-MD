/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import yts from "yt-search";
import { generateWAMessageFromContent, proto } from '@rexxhayanasi/elaina-baileys';
import axios from "axios";
import sharp from "sharp";
import config from "../../config.js";

const pluginConfig = {
  name: "yts",
  alias: ["ytsearch", "youtubesearch"],
  category: "search",
  description: "Mencari video di YouTube berdasarkan kata kunci dan menampilkan detail lengkap beserta thumbnail.",
  usage: ".yts <query>",
  example: ".yts lagu pop terbaru",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock, text }) {
  if (!text) {
    return m.reply("❌ *Waduh, kata kuncinya kosong!*\n\nKamu harus memasukkan kata kunci judul video yang ingin dicari ya. \n\nContoh penggunaan: `.yts lagu galau indonesia`");
  }

  await m.react("🕕");

  try {
    const searchResults = await yts(text);
    const videos = searchResults.videos;

    if (!videos || videos.length === 0) {
      await m.react("❌");
      return m.reply("⚠️ *Maaf banget, pencarian tidak menemukan hasil apa pun.* \n\nMungkin kata kuncinya terlalu spesifik. Coba gunakan kata kunci lain yang lebih umum ya!");
    }

    const firstVideo = videos[0];

    const imageResponse = await axios.get(firstVideo.thumbnail, { responseType: "arraybuffer" });
    const thumbnailBuffer = await sharp(imageResponse.data).resize(300, 170).jpeg().toBuffer();

    const contentText = `✨ *HASIL PENCARIAN YOUTUBE* ✨

Halo! Ini dia hasil pencarian teratas yang aku temukan berdasarkan kata kunci yang kamu berikan. 

🔎 *Kata Kunci Pencarian*: ${text}
🎬 *Judul Video*: ${firstVideo.title}
📺 *Nama Channel*: ${firstVideo.author.name}
⏱️ *Durasi Video*: ${firstVideo.timestamp}
👁️ *Jumlah Penonton*: ${firstVideo.views} views
📅 *Waktu Diunggah*: ${firstVideo.ago}
🔗 *Tautan Video*: ${firstVideo.url}

*Catatan Tambahan*: Thumbnail dari video ini sudah aku sematkan di bagian atas pesan (peta lokasi) sesuai permintaanmu. Keren kan? 😎

Pilih salah satu tombol di bawah ini untuk langsung mengunduh hasil video atau audio-nya!`;

    const content = {
      buttonsMessage: {
        buttons: [
          {
            buttonId: `.ytmp4 ${firstVideo.url}`,
            buttonText: { displayText: '🎥 Unduh Video' },
            type: 1,
          },
          {
            buttonId: `.ytmp3 ${firstVideo.url}`,
            buttonText: { displayText: '🎵 Unduh Audio' },
            type: 1,
          },
        ],
        locationMessage: {
          jpegThumbnail: thumbnailBuffer,
          name: firstVideo.title,
          address: `📺 Channel: ${firstVideo.author.name} | ⏱️ Durasi: ${firstVideo.timestamp}`
        },
        contentText: contentText,
        footerText: config.bot.name,
        headerType: 6,
      },
    };

    const msg = generateWAMessageFromContent(m.chat, content, {
      quoted: m,
    });

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    await m.react("✅");

  } catch (error) {
    console.error(error);
    await m.react("❌");
    m.reply("😔 *Aduh, sepertinya ada masalah di sistemku.* \n\nTerjadi kesalahan saat mencoba mencari video tersebut di YouTube. Mohon tunggu beberapa saat dan coba lagi nanti ya!");
  }
}

export { pluginConfig as config, handler };