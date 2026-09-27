/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fetch from 'node-fetch';
import { withNetworkRetry, formatNetworkError } from '../../src/lib/elaina-network.js';

const pluginConfig = {
  name: "sertifikatnasa",
  alias: ["nasacert", "sertifnasa", "sertifikat-nasa"],
  category: "maker",
  description: "Generate gambar Sertifikat NASA dengan nama custom",
  usage: ".sertifikatnasa <nama>",
  example: ".sertifikatnasa John Doe",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, text }) {
  // Ambil nama dari input atau gunakan pushName pengirim jika tidak diisi
  const nameQuery = text ? text.trim() : m.pushName;

  if (!nameQuery) {
    return m.reply(`⚠️ *Format Salah*\n\nPenggunaan:\n\`.sertifikatnasa <nama>\`\n\nContoh:\n\`.sertifikatnasa John Doe\``);
  }

  const apiUrl = `https://api.nexray.web.id/maker/sertifikat-nasa?nama=${encodeURIComponent(nameQuery)}`;

  await m.react('⏳');

  try {
    const response = await withNetworkRetry(() => fetch(apiUrl, { timeout: 30000 }));
    const contentType = response.headers.get('content-type') || '';

    // Jika API mengembalikan gambar langsung (Buffer)
    if (contentType.includes('image')) {
      const imageBuffer = await response.buffer();
      await sock.sendMessage(m.chat, {
        image: imageBuffer,
        caption: `📜 *SERTIFIKAT NASA GENERATED* 🚀\n\n👤 *Atas Nama:* ${nameQuery}`
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    // Jika API mengembalikan JSON
    const resJson = await response.json();
    if ((resJson.status || resJson.success) && resJson.result) {
      const imageUrl = typeof resJson.result === 'string' ? resJson.result : resJson.result.url;
      await sock.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: `📜 *SERTIFIKAT NASA GENERATED* 🚀\n\n👤 *Atas Nama:* ${nameQuery}`
      }, { quoted: m });
      await m.react('✅');
    } else {
      await m.react('❌');
      m.reply(`❌ *Gagal generate:* ${resJson.message || 'Terjadi kesalahan pada server API.'}`);
    }

  } catch (err) {
    console.error('[SERTIFIKAT NASA ERROR]', err);
    await m.react('❌');
    await m.reply(`❌ *Gagal:* ${formatNetworkError(err, 'AlwaysCodex Sertifikat NASA')}`);
  }
}

export { pluginConfig as config, handler };
