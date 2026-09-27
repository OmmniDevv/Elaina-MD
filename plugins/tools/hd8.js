/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const pluginConfig = {
  name: "hd8",
  alias: ["remini8", "upscale1", "enhance8"],
  category: "tools",
  description: "Meningkatkan resolusi gambar hingga 4x lipat (Upscale v1)",
  usage: ".hd8 [resolusi 2|4] (balas/kirim gambar)",
  example: ".hd8 4",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock, args }) {
  const prefix = m.prefix || '.';
  const command = m?.command || 'hd8';

  // Deteksi angka resolusi dari argument user (default resolusi = 4)
  const resolution = args[0] && ['2', '4', '8'].includes(args[0]) ? args[0] : '4';

  // Deteksi gambar dari pesan yang dikirim atau di-reply
  const quoted = m.quoted ? m.quoted : m;
  const mime = (quoted.msg || quoted).mimetype || '';

  if (!/image\/(png|jpe?g|webp)/.test(mime)) {
    if (m.react) await m.react("❌");
    return m.reply(
      `📌 *Cara Penggunaan:*\n` +
      `Kirim atau balas/reply gambar dengan caption *${prefix + command} [resolusi]*\n\n` +
      `Contoh: *${prefix + command} 4*`
    );
  }

  if (m.react) await m.react("⏳");

  try {
    // 1. Download gambar dari WhatsApp
    const mediaBuffer = await quoted.download();

    // 2. Upload media sementara ke catbox untuk mendapatkan URL publik
    const FormData = (await import('form-data')).default;
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', mediaBuffer, { filename: 'image.jpg' });

    const uploadRes = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders(),
      timeout: 30000
    });

    const imageUrl = uploadRes.data.trim();

    if (!imageUrl.startsWith('http')) {
      throw new Error("Gagal mengunggah gambar ke server media.");
    }

    // 3. Panggil API Nexadev Upscale1
    const apiUrl = `https://api.nexadev.my.id/api/upscale1?url=${encodeURIComponent(imageUrl)}&resolusi=${resolution}`;

    // Ambil hasil gambar HD berupa Buffer
    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
      timeout: 45000
    });

    const imageBuffer = Buffer.from(response.data, 'binary');

    // Kirim gambar hasil upscale ke WhatsApp
    await sock.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `✨ *IMAGE UPSCALE v1 HD*\n\n📐 *Resolusi:* ${resolution}x`
    }, { quoted: m });

    if (m.react) await m.react("✅");

  } catch (e) {
    console.error('[HD8 UPSCALE1 ERROR]', e);
    if (m.react) await m.react("❌");
    
    const errMsg = e.response?.data?.message || e.message;
    return m.reply(`❌ *Gagal meng-upscale gambar:* ${errMsg}`);
  }
}

export { pluginConfig as config, handler };
