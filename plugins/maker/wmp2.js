/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const pluginConfig = {
  name: "wmp2",
  alias: ["canvaswmp2", "wmpmeme"],
  category: "maker",
  description: "Membuat gambar Canvas WMP2 dengan teks custom",
  usage: ".wmp2 <teks1|teks2|teks3|teks4>",
  example: ".wmp2 ngapain cemburu|kan|cuman sebatas|teman",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, args }) {
  const prefix = m.prefix || '.';
  const command = m?.command || 'wmp2';

  const text = args.join(' ').trim();

  if (!text) {
    if (m.react) await m.react("❌");
    return m.reply(
      `📌 *Cara Penggunaan:*\n` +
      `Ketik *${prefix + command} teks1|teks2|teks3|teks4*\n\n` +
      `Contoh: *${prefix + command} ngapain cemburu|kan|cuman sebatas|teman*`
    );
  }

  if (m.react) await m.react("⏳");

  try {
    // Format URL API Nexadev WMP2
    const apiUrl = `https://apii.nexadev.my.id/wmp2?text=${encodeURIComponent(text)}`;

    // Ambil hasil gambar berupa Buffer
    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
      timeout: 20000
    });

    const imageBuffer = Buffer.from(response.data, 'binary');

    // Kirim gambar ke WhatsApp
    await sock.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `🎨 *WMP2 Canvas Generator*\n\n💬 *Teks:* ${text}`
    }, { quoted: m });

    if (m.react) await m.react("✅");

  } catch (e) {
    console.error('[CANVAS WMP2 ERROR]', e);
    if (m.react) await m.react("❌");
    
    const errMsg = e.response?.data?.message || e.message;
    return m.reply(`❌ *Gagal membuat gambar WMP2:* ${errMsg}`);
  }
}

export { pluginConfig as config, handler };
