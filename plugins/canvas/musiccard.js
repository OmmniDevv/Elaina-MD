/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { downloadMediaMessage, getContentType } from '@rexxhayanasi/elaina-baileys';
import { uploadImage } from "../../src/lib/elaina-uploader.js";
import axios from "axios";

const pluginConfig = {
  name: "musiccard",
  alias: ["mcard", "spotifycard"],
  category: "maker",
  description: "Membuat kartu musik (music card) keren dari gambar yang dikirim.",
  usage: ".musiccard <judul>|<nama artis>",
  example: ".musiccard Rewrite The Stars|James Arthur",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.text?.trim();

  let mediaBuffer = null;
  let mimetype = null;

  if (m.quoted?.message) {
    const type = getContentType(m.quoted.message);
    if (type !== "imageMessage") {
      return m.reply("❌ *Waduh, itu bukan gambar!*\n\nKamu harus me-reply (membalas) pesan berupa *gambar* dengan format `.musiccard <judul>|<nama>`.\n\nContoh: \nBalas gambar temanmu, lalu ketik: `.musiccard Perfect|Ed Sheeran`");
    }
    try {
      mediaBuffer = await downloadMediaMessage(
        { key: m.quoted.key, message: m.quoted.message },
        "buffer",
        {}
      );
      mimetype = m.quoted.message[type]?.mimetype;
    } catch (e) {
      return m.reply("😔 *Gagal mendownload gambar.* Coba kirim ulang gambarnya ya.");
    }
  } else if (m.message) {
    const type = getContentType(m.message);
    if (type !== "imageMessage") {
      return m.reply("❌ *Waduh, gambarnya mana nih?*\n\nKamu harus mengirim sebuah gambar dengan caption (teks pelengkap) `.musiccard <judul>|<nama>` atau reply gambar yang sudah ada.\n\nContoh: \nKirim gambar dengan caption: `.musiccard Perfect|Ed Sheeran`");
    }
    try {
      mediaBuffer = await downloadMediaMessage(
        { key: m.key, message: m.message },
        "buffer",
        {}
      );
      mimetype = m.message[type]?.mimetype;
    } catch (e) {
      return m.reply("😔 *Gagal mendownload gambar.* Coba kirim ulang gambarnya ya.");
    }
  }

  if (!mediaBuffer) {
    return m.reply("❌ *Gambar tidak terdeteksi!* Pastikan kamu mengirim gambar dengan benar.");
  }

  if (!text) {
    return m.reply("❌ *Judul lagu dan artis belum diisi!*\n\nFormat penulisan yang benar adalah: `.musiccard <judul>|<nama>`\nPisahkan judul dan nama artis dengan simbol pita ( | ).");
  }

  let judul = text;
  let nama = "Unknown Artist";

  if (text.includes("|")) {
    const parts = text.split("|");
    judul = parts[0].trim();
    nama = parts[1].trim() || m.pushName;
  }

  await m.react("🕕");

  try {

    const directLink = await uploadImage(mediaBuffer);
    if (!directLink) {
      await m.react("❌");
      return m.reply("⚠️ *Gagal mengunggah gambar!* Pastikan ukuran gambarnya tidak terlalu besar dan coba lagi ya.");
    }

    const apiUrl = `https://api.nexray.eu.cc/canvas/musiccard?judul=${encodeURIComponent(judul)}&nama=${encodeURIComponent(nama)}&image_url=${encodeURIComponent(directLink)}`;

    const res = await axios.get(apiUrl, {
      responseType: "arraybuffer",
      timeout: 30000
    });

    if (res.headers["content-type"] && !res.headers["content-type"].includes("image")) {
      await m.react("❌");
      return m.reply("⚠️ *Gagal membuat Music Card.* Server merespon dengan format yang salah.");
    }

    const cardBuffer = Buffer.from(res.data);

    await sock.sendMessage(m.chat, {
      image: cardBuffer,
      caption: `✨ *MUSIC CARD BERHASIL DIBUAT!* ✨\n\n🎧 *Judul*: ${judul}\n🎤 *Artis*: ${nama}\n\nKeren banget kan hasilnya? Pamerin ke teman-temanmu yuk! 🚀`
    }, { quoted: m });

    await m.react("✅");

  } catch (err) {
    console.error("[Music Card]", err.message);
    await m.react("☢");
    m.reply("😔 *Terjadi masalah di sistem kami.* \n\nSistem gagal menghubungi server pembuat kartu. Silakan coba beberapa saat lagi ya.");
  }
}

export { pluginConfig as config, handler };
