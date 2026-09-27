/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";

export const config = {
  name: "removewm",
  alias: ["ezremove", "nobgwm", "delwm", "unwatermark"],
  category: "tools",
  description: "Menghapus watermark dari gambar (foto biasa maupun dokumen)",
  usage: ".removewm (kirim/reply gambar)",
  example: ".removewm (reply gambar berwatermark)",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

const UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";
const ORIGIN = "https://ezremove.ai";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function removeWatermark(buffer, mimeType) {
  const ext = mimeType.split('/')[1] || 'jpeg';
  const filename = `image.${ext}`;
  const boundary = `----FormBoundary${Math.random().toString(36).slice(2)}`;

  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image_file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`),
    buffer,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);

  // 1. Buat Job
  const create = await axios.post(
    "https://api.ezremove.ai/api/ez-remove/watermark-remove/create-job",
    body,
    {
      headers: {
        "User-Agent": UA,
        "Accept": "application/json, text/plain, */*",
        "Origin": ORIGIN,
        "Referer": `${ORIGIN}/`,
        "product-serial": `sr-${Date.now()}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": body.length
      },
      timeout: 30000,
      validateStatus: () => true,
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    }
  );

  if (create.status < 200 || create.status >= 300) {
    throw new Error(`Gagal membuat job watermark (HTTP ${create.status})`);
  }

  const jobId = create.data?.result?.job_id;
  if (!jobId) {
    throw new Error("Gagal mendapatkan Job ID dari server.");
  }

  // 2. Polling Status Job
  for (let i = 0; i < 30; i++) {
    await sleep(2000);

    const check = await axios.get(
      `https://api.ezremove.ai/api/ez-remove/watermark-remove/get-job/${jobId}`,
      {
        headers: {
          "User-Agent": UA,
          "Accept": "application/json, text/plain, */*",
          "Origin": ORIGIN,
          "Referer": `${ORIGIN}/`,
          "product-serial": `sr-${Date.now()}`
        },
        timeout: 15000,
        validateStatus: () => true
      }
    );

    if (check.status < 200 || check.status >= 300) {
      throw new Error(`Gagal memeriksa status job (HTTP ${check.status})`);
    }

    const resultUrl = check.data?.result?.output?.[0];

    if (check.data?.code === 100000 && resultUrl) {
      return resultUrl;
    }

    if (check.data?.code !== 300001) {
      throw new Error(check.data?.message || "Proses penghapusan watermark gagal.");
    }
  }

  throw new Error("Waktu tunggu habis (Timeout).");
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

  const isImage = /image/.test(mime) || Boolean(q.message?.imageMessage);

  if (!isImage) {
    return m.reply(
      `*Format Salah!*\n\n` +
      `📌 *Cara Penggunaan:*\n` +
      `Kirim atau reply **Gambar/Dokumen Gambar** berwatermark dengan mengetikkan:\n` +
      `👉 \`${pfx}${command}\``
    );
  }

  await m.react('⏳');

  try {
    // 1. Download Gambar dari WhatsApp
    const imgBuffer = await q.download();
    if (!imgBuffer) throw new Error("Gagal mengunduh gambar dari WhatsApp.");

    const cleanMime = mime.split(';')[0] || 'image/jpeg';

    // 2. Jalankan Proses Hapus Watermark
    const resultUrl = await removeWatermark(imgBuffer, cleanMime);

    // 3. Download Hasil Gambar Bersih
    const imageRes = await axios.get(resultUrl, { responseType: 'arraybuffer' });
    const resultBuffer = Buffer.from(imageRes.data);

    let caption = `✨ *WATERMARK REMOVED*\n\nBerhasil menghapus watermark dari gambar!`;

    // 4. Kirim Balik Sesuai Tipe Asal (Dokumen/Foto)
    if (mtype === 'documentMessage' || Boolean(q.message?.documentMessage)) {
      const fileName = q.filename || q.msg?.filename || `no_watermark.${cleanMime.split('/')[1] || 'jpg'}`;
      await client.sendMessage(
        m.chat,
        {
          document: resultBuffer,
          mimetype: cleanMime,
          fileName: fileName,
          caption: caption
        },
        { quoted: m }
      );
    } else {
      await client.sendMessage(
        m.chat,
        {
          image: resultBuffer,
          caption: caption
        },
        { quoted: m }
      );
    }

    await m.react('✅');

  } catch (err) {
    console.error(err);
    await m.react('❌');
    m.reply(`❌ *Gagal menghapus watermark:*\n${err.message || String(err)}`);
  }
}
