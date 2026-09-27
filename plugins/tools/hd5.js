/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import sharp from 'sharp';

const pluginConfig = {
  name: "hd5",
  alias: ["upscale5", "hdlocal"],
  category: "tools",
  description: "Memperjelas resolusi gambar (Local Sharp Engine)",
  usage: ".hd5 <reply/kirim gambar atau dokumen foto>",
  example: ".hd5",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

// Engine HD Lokal (Proses internal server tanpa butuh API/Internet luar)
async function processHDLocal(imageBuffer) {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    
    // Hitung resolusi baru (perbesar 3x lipat)
    const newWidth = Math.round((metadata.width || 1000) * 3);
    const newHeight = Math.round((metadata.height || 1000) * 3);

    // Filter peningkatan kualitas gambar
    const enhancedBuffer = await sharp(imageBuffer)
      .resize(newWidth, newHeight, {
        kernel: sharp.kernel.lanczos3, // Algoritma resize paling tajam
        fit: 'fill'
      })
      .sharpen({
        sigma: 1.5,
        m1: 1.0,
        m2: 2.0
      })
      .modulate({
        brightness: 1.02,
        saturation: 1.05
      })
      .jpeg({ quality: 95 })
      .toBuffer();

    return enhancedBuffer;
  } catch (error) {
    throw new Error('Gagal memproses gambar secara lokal: ' + error.message);
  }
}

// Helper Deteksi Gambar
function checkImageMedia(msg) {
  if (!msg) return false;
  if (msg.isImage) return true;
  const rawMsg = msg.message || msg.msg || msg;
  const mimetype = msg.mimetype || rawMsg?.mimetype || rawMsg?.documentMessage?.mimetype || rawMsg?.imageMessage?.mimetype || "";
  return mimetype.startsWith("image/");
}

async function hd5(m, { sock }) {
  const isDirectImage = checkImageMedia(m);
  const isQuotedImage = m.quoted ? checkImageMedia(m.quoted) : false;

  if (!isDirectImage && !isQuotedImage) {
    return m.reply(`❌ Kirim atau balas gambar/dokumen foto dengan perintah \`${m.prefix}${m.command}\``);
  }

  await m.react('⏳');

  try {
    // 1. Download Gambar
    let mediaBuffer;
    if (isQuotedImage) {
      mediaBuffer = await m.quoted.download().catch(() => sock.downloadMediaMessage(m.quoted));
    } else {
      mediaBuffer = await m.download().catch(() => sock.downloadMediaMessage(m));
    }

    if (!mediaBuffer || !Buffer.isBuffer(mediaBuffer)) {
      await m.react('❌');
      return m.reply("❌ Gagal mengunduh berkas gambar dari WhatsApp.");
    }

    // 2. Olah Gambar secara Lokal
    const resultBuffer = await processHDLocal(mediaBuffer);

    // 3. Kirim Hasil
    await sock.sendMessage(m.chat, { 
      image: resultBuffer, 
      caption: `✨ *H D 5 - L O C A L  E N G I N E*\n\n> Gambar berhasil diperjelas & dinaikkan resolusinya 3x.`
    }, { quoted: m });

    await m.react('✅');

  } catch (error) {
    console.error("[HD5 Error]", error);
    await m.react('❌');
    m.reply(`❌ *Proses HD5 Gagal:*\n${error.message}`);
  }
}

export { pluginConfig as config, hd5 as handler };
