/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import FormData from "form-data";
import config from "../../config.js";
import te from "../../src/lib/elaina-error.js";
import _sharp from 'sharp';

const pluginConfig = {
  name: "hd2",
  alias: ["enhance2", "upscale2", "aienhancer"],
  category: "tools",
  description: "Enhance gambar menjadi HD dengan AI (V3)",
  usage: ".hd2 (reply gambar)",
  example: ".hd2",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 30,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const isImage = m.isImage || (m.quoted && m.quoted.type === "imageMessage");

  if (!isImage) {
    let help = `✨ *FITUR HD ENHANCE V2*\n\n`
    help += `Tingkatkan resolusi gambar kamu menjadi jauh lebih HD dan tajam menggunakan AI!\n\n`
    help += `*Cara Penggunaan:*\n`
    help += `- Kirim gambar dan tambahkan pesan *${m.prefix}hd2*\n`
    help += `- Atau balas (reply) gambar yang sudah terkirim dengan perintah *${m.prefix}hd2*\n\n`
    help += `_Proses rendering mungkin memerlukan waktu beberapa detik hingga satu menit._`
    return m.reply(help);
  }

  await m.react("🕕");

  try {
    let buffer;
    if (m.quoted && m.quoted.isMedia) {
      buffer = await m.quoted.download();
    } else if (m.isMedia) {
      buffer = await m.download();
    }

    if (!buffer) {
      await m.react("❌");
      return m.reply(`Maaf, sistem gagal mengunduh gambar yang kamu berikan. Silakan coba kirim ulang gambarnya!`);
    }

    const form = new FormData();
    form.append("image", buffer, { filename: "image.jpg", contentType: "image/jpeg" });
    form.append("type", "upscale");
    form.append("scale", "2");

    const response = await axios.post("https://my.izuka-api.xyz/api/tools/imglarger", form, {
      headers: form.getHeaders(),
      timeout: 60000
    });

    const data = response.data;
    if (!data || !data.status || !data.result) {
      await m.react("❌");
      return m.reply(`Maaf, AI gagal memproses gambarmu kali ini. Silakan coba lagi dalam beberapa saat!`);
    }

    await m.react("✅");

    const thumbBuffer = await _sharp(buffer).resize(50, 50).jpeg({ quality: 30 }).toBuffer();

    await sock.sendMessage(
      m.chat,
      {
        document: { url: data.result },
        mimetype: "image/jpeg",
        jpegThumbnail: thumbBuffer,
        fileName: `HD_BY_${config.bot.name}.jpg`,
      },
      { quoted: m },
    );

  } catch (error) {
    console.error("[HD2 Plugin Error]", error);
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
