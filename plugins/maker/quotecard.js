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
  name: "quotecard",
  alias: ["qcard", "cardquote", "makerquote"],
  category: "maker",
  description: "Generate quote card dengan background gradient dan tipografi elegan",
  usage: ".quotecard teks|author",
  example: ".quotecard Jangan ragu menggapai bintang|@AlwaysCodex",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, text }) {
  if (!text) {
    return m.reply(
      `⚠️ *Format Salah*\n\n` +
      `Penggunaan:\n\`.quotecard teks|author\`\n\n` +
      `Contoh:\n\`.quotecard Jangan ragu menggapai bintang|@AlwaysCodex\``
    );
  }

  // Parse argumen teks dan author (pemisah menggunakan "|")
  let [quoteText, authorName] = text.split('|').map(v => v ? v.trim() : '');

  if (!quoteText) {
    return m.reply(`⚠️ Masukkan teks quote yang ingin dibuat!\n\nContoh:\n\`.quotecard Tetap semangat mencapai mimpi|@Geto\``);
  }

  // Jika author tidak diisi, otomatis menggunakan pushname / nama pengirim
  const authorQuery = authorName || m.pushName || 'Anonymous';
  const apiUrl = `https://api.nexray.web.id/maker/quotecard?text=${encodeURIComponent(quoteText)}&author=${encodeURIComponent(authorQuery)}`;

  await m.react('⏳');

  try {
    const response = await withNetworkRetry(() => fetch(apiUrl, { timeout: 30000 }));
    const contentType = response.headers.get('content-type') || '';

    // Jika API mengembalikan gambar langsung (Buffer)
    if (contentType.includes('image')) {
      const imageBuffer = await response.buffer();
      await sock.sendMessage(m.chat, {
        image: imageBuffer,
        caption: `✨ *Quote Card Generated!*`
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
        caption: `✨ *Quote Card Generated!*`
      }, { quoted: m });
      await m.react('✅');
    } else {
      await m.react('❌');
      m.reply(`❌ *Gagal generate:* ${resJson.message || 'Terjadi kesalahan pada server API.'}`);
    }

  } catch (err) {
    console.error('[QUOTE CARD ERROR]', err);
    await m.react('❌');
    await m.reply(`❌ *Gagal:* ${formatNetworkError(err, 'AlwaysCodex Quote Card')}`);
  }
}

export { pluginConfig as config, handler };
