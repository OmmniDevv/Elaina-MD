/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { CookieJar } from 'tough-cookie';
import makeFetchCookie from 'fetch-cookie';

export const config = {
  name: "tinypng",
  alias: ["compress", "presgambar", "tiny"],
  category: "tools",
  description: "Mengompresi dan mengecilkan ukuran gambar (PNG/JPG/WEBP) baik foto biasa maupun dokumen",
  usage: ".tinypng (kirim/reply gambar)",
  example: ".tinypng (reply gambar)",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function compressTinyPng(buffer, mimeType) {
  const jar = new CookieJar();
  const fetchCookie = makeFetchCookie(globalThis.fetch, jar);

  // 1. Inisialisasi Sesi
  await fetchCookie('https://tinypng.com/', {
    headers: {
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });

  // 2. Unggah Buffer Gambar
  const upload = await fetchCookie('https://tinypng.com/backend/opt/store', {
    method: 'POST',
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/octet-stream',
      origin: 'https://tinypng.com',
      referer: 'https://tinypng.com/',
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36'
    },
    body: buffer
  });

  if (!upload.ok) throw new Error(await upload.text());
  const uploaded = await upload.json();

  // 3. Proses Kompresi
  const processRes = await fetchCookie('https://tinypng.com/backend/opt/process', {
    method: 'POST',
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
      origin: 'https://tinypng.com',
      referer: 'https://tinypng.com/',
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36'
    },
    body: JSON.stringify({
      key: uploaded.key,
      originalType: mimeType,
      originalSize: buffer.length
    })
  });

  if (!processRes.ok) throw new Error(await processRes.text());
  return await processRes.json();
}

// Fungsi pembantu format ukuran file
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function handler(m, { usedPrefix, prefix, command, sock, conn }) {
  const client = sock || conn;
  const pfx = usedPrefix || prefix || '/';

  // Deteksi Quoted Message / Media
  const q = m.quoted ? m.quoted : m;
  const mtype = q.mtype || q.mediaType || '';
  
  // Ambil Mimetype dari berbagai kemungkinan tipe objek pesan (Foto / Dokumen)
  const mime = 
    q.mimetype || 
    q.msg?.mimetype || 
    q.message?.imageMessage?.mimetype || 
    q.message?.documentMessage?.mimetype || 
    '';

  // Cek apakah mimetype mengandung kata 'image' ATAU ekstensi file dokumen bernuansa gambar
  const isImage = /image/.test(mime) || Boolean(q.message?.imageMessage);

  if (!isImage) {
    return m.reply(
      `*Format Salah!*\n\n` +
      `📌 *Cara Penggunaan:*\n` +
      `Kirim atau reply **Gambar/Dokumen Gambar (JPG/PNG/WEBP)** dengan mengetikkan:\n` +
      `👉 \`${pfx}${command}\``
    );
  }

  await m.react('⏳');

  try {
    // 1. Download Gambar/Dokumen dari WhatsApp
    const imgBuffer = await q.download();
    if (!imgBuffer) throw new Error("Gagal mengunduh gambar dari WhatsApp.");

    const cleanMime = mime.split(';')[0] || 'image/jpeg';

    // 2. Jalankan Kompresi TinyPNG
    const result = await compressTinyPng(imgBuffer, cleanMime);

    if (!result.url) {
      throw new Error("Gagal mendapatkan URL gambar hasil kompresi.");
    }

    // 3. Download Hasil Gambar
    const resImage = await fetch(result.url);
    const compressedBuffer = Buffer.from(await resImage.arrayBuffer());

    // Hitung Penghematan Ukuran
    const originalSize = formatBytes(result.input?.size || imgBuffer.length);
    const compressedSize = formatBytes(result.output?.size || compressedBuffer.length);
    const ratio = result.output?.ratio ? (result.output.ratio * 100).toFixed(1) : '0';

    let caption = `🖼️ *TINYPNG COMPRESSOR*\n\n`;
    caption += `📊 *Ukuran Awal:* ${originalSize}\n`;
    caption += `📉 *Ukuran Hasil:* ${compressedSize}\n`;
    caption += `⚡ *Tingkat Kompresi:* -${ratio}%`;

    // 4. Jika inputnya Dokumen, kirim balik sebagai Dokumen. Jika Gambar biasa, kirim sebagai Gambar biasa.
    if (mtype === 'documentMessage' || Boolean(q.message?.documentMessage)) {
      const fileName = q.filename || q.msg?.filename || `compressed_image.${cleanMime.split('/')[1] || 'jpg'}`;
      await client.sendMessage(
        m.chat,
        {
          document: compressedBuffer,
          mimetype: cleanMime,
          fileName: fileName,
          caption: caption.trim()
        },
        { quoted: m }
      );
    } else {
      await client.sendMessage(
        m.chat,
        {
          image: compressedBuffer,
          caption: caption.trim()
        },
        { quoted: m }
      );
    }

    await m.react('✅');

  } catch (err) {
    console.error(err);
    await m.react('❌');
    m.reply(`❌ *Gagal mengompresi gambar:*\n${err.message || String(err)}`);
  }
}
