/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fetch from 'node-fetch';

const pluginConfig = {
  name: "iqc3",
  alias: ["canvasiqc3", "iqc3maker"],
  category: "maker",
  description: "Membuat gambar Canvas IQC dari teks",
  usage: ".iqc3 <teks>",
  example: ".iqc3 Tes1",
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
    return m.reply(`⚠️ *Format Salah*\n\nPenggunaan:\n\`.iqc3 <teks>\`\n\nContoh:\n\`.iqc3 Tes1\``);
  }

  const queryText = text.trim();
  const apiKey = "4ZtwE";
  const apiUrl = `https://api.theresav.biz.id/canvas/iqc?teks=${encodeURIComponent(queryText)}&apikey=${apiKey}`;

  await m.react('⏳');

  try {
    const response = await fetch(apiUrl);
    const contentType = response.headers.get('content-type') || '';

    // Jika API langsung mengembalikan gambar (Buffer)
    if (contentType.includes('image')) {
      const imageBuffer = await response.buffer();
      await sock.sendMessage(m.chat, {
        image: imageBuffer,
        caption: `✨ *Canvas IQC Generated!*`
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    // Jika API mengembalikan JSON
    const resJson = await response.json();
    if (resJson.status && resJson.result) {
      const imageUrl = typeof resJson.result === 'string' ? resJson.result : resJson.result.url;
      await sock.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: `✨ *Canvas IQC Generated!*`
      }, { quoted: m });
      await m.react('✅');
    } else {
      await m.react('❌');
      m.reply(`❌ *Gagal generate:* ${resJson.message || 'Terjadi kesalahan pada server API.'}`);
    }

  } catch (err) {
    console.error('[IQC3 ERROR]', err);
    await m.react('❌');
    await m.reply(`❌ *Terjadi Kesalahan:* ${err.message}`);
  }
}

export { pluginConfig as config, handler };
