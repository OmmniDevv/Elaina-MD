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
import _sharp from "sharp";

const pluginConfig = {
  name: "hd3",
  alias: ["enhance3", "upscale3", "unblur"],
  category: "tools",
  description: "Memperjelas gambar blur menjadi tajam dengan AI (Unblur)",
  usage: ".hd3 (reply gambar)",
  example: ".hd3",
  cooldown: 20,
  energi: 2,
  isEnabled: true,
};

async function uploadToCatbox(buffer) {
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", buffer, { filename: "image.jpg", contentType: "image/jpeg" });

  const response = await axios.post("https://catbox.moe/user/api.php", form, {
    headers: form.getHeaders(),
    timeout: 30000,
    maxBodyLength: Infinity,
  });

  const url = String(response.data || "").trim();
  if (!url.startsWith("http")) throw new Error("Gagal mendapatkan URL gambar sementara.");
  return url;
}

async function getUnblurResult(imageUrl) {
  const apiUrl = `https://api.nexray.eu.cc/tools/unblur?url=${encodeURIComponent(imageUrl)}`;
  const response = await axios.get(apiUrl, {
    timeout: 60000,
    responseType: "arraybuffer",
    validateStatus: () => true,
    headers: { Accept: "image/*,application/json,text/plain;q=0.9,*/*;q=0.8" },
  });

  const contentType = String(response.headers["content-type"] || "").toLowerCase();
  if (response.status < 200 || response.status >= 300) {
    let detail = `HTTP ${response.status}`;
    try {
      const text = Buffer.from(response.data).toString("utf8");
      const json = JSON.parse(text);
      detail = json?.message || detail;
    } catch {}
    throw new Error(`API unblur gagal (${detail})`);
  }

  if (contentType.includes("image")) {
    return Buffer.from(response.data);
  }

  const raw = Buffer.from(response.data).toString("utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("API unblur mengembalikan respons yang tidak valid");
  }

  const resultUrl =
    (typeof data?.result === "string" && data.result) ||
    data?.result?.url ||
    data?.result?.output_url ||
    data?.url ||
    data?.image;

  if (!resultUrl) throw new Error(data?.message || "Hasil unblur tidak ditemukan");

  const imageResponse = await axios.get(resultUrl, {
    responseType: "arraybuffer",
    timeout: 60000,
  });
  return Buffer.from(imageResponse.data);
}

async function handler(m, { sock }) {
  const isImage = m.isImage || (m.quoted && m.quoted.type === "imageMessage");

  if (!isImage) {
    let help = `✨ *FITUR HD ENHANCE V3 (UNBLUR)*\n\n`;
    help += `Fitur canggih untuk memperbaiki gambar yang buram (blur) menjadi jelas dan tajam kembali menggunakan kecerdasan buatan!\n\n`;
    help += `*Cara Penggunaan:*\n`;
    help += `- Kirim gambar dan tambahkan pesan *${m.prefix}hd3*\n`;
    help += `- Atau balas (reply) gambar yang sudah terkirim dengan perintah *${m.prefix}hd3*\n\n`;
    help += `_Proses rendering mungkin memerlukan waktu beberapa saat._`;
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

    // Nexray's current unblur endpoint expects a public image URL.
    const imageUrl = await uploadToCatbox(buffer);
    const resultBuffer = await getUnblurResult(imageUrl);

    await m.react("✅");

    const thumbBuffer = await _sharp(buffer).resize(50, 50).jpeg({ quality: 30 }).toBuffer();

    await sock.sendMessage(
      m.chat,
      {
        image: resultBuffer,
        jpegThumbnail: thumbBuffer,
        caption: `✨ *UNBLUR / HD ENHANCE*\n\nDibuat dengan ${config.bot?.name || "Rimuru MD"}`,
      },
      { quoted: m },
    );
  } catch (error) {
    console.error("[HD3 Plugin Error]", error);
    await m.react("❌");
    return m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
