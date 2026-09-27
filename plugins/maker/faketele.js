/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fetch from 'node-fetch';
import FormData from 'form-data';

const pluginConfig = {
  name: "faketg",
  alias: ["faketele", "faketelegram"],
  category: "maker",
  description: "Buat gambar tampilan profil Telegram palsu",
  usage: ".faketg name|number|bio|username (sambil kirim/reply gambar)",
  example: ".faketg Geto|6285135853836|Suguru|Geto suguru",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock, text }) {
  // 1. Ambil target pesan (Pesan yang di-reply ATAU pesan itu sendiri)
  const q = m.quoted ? m.quoted : m;

  // 2. Parse argumen dari teks
  if (!text) {
    return m.reply(`⚠️ *Format Salah*\n\nKirim atau reply gambar dengan caption/teks:\n\`.faketg nama|nomor|bio|username\`\n\nContoh:\n\`.faketg Geto|6285135853836|Suguru|Geto suguru\``);
  }

  const [name, number, bio, username] = text.split('|').map(v => v ? v.trim() : '');

  if (!name) {
    return m.reply(`⚠️ Nama minimal harus diisi!\nContoh: \`.faketg Geto|6285135853836|Suguru|Geto suguru\``);
  }

  await m.react('⏳');

  try {
    // 3. Download Buffer Gambar menggunakan fungsi download bawaan pesan
    let imageBuffer;
    if (typeof q.download === 'function') {
      imageBuffer = await q.download();
    } else if (typeof m.download === 'function') {
      imageBuffer = await m.download();
    } else {
      await m.react('❌');
      return m.reply("❌ Pastikan kamu men-reply **gambar** / foto!");
    }

    if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
      await m.react('❌');
      return m.reply("❌ Gagal mengambil buffer gambar dari pesan.");
    }

    // 4. Buat Form Data Multipart
    const formData = new FormData();
    formData.append('apikey', '4ZtwE');
    formData.append('image', imageBuffer, { filename: 'profile.jpg', contentType: 'image/jpeg' });
    formData.append('name', name || 'Telegram User');
    formData.append('number', number || '');
    formData.append('bio', bio || '');
    formData.append('username', username || '');

    // 5. Kirim Request POST ke API
    const response = await fetch('https://api.theresav.biz.id/canvas/telegram', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    const contentType = response.headers.get('content-type') || '';

    // Jika Response Gambar Buffer/Binary
    if (contentType.includes('image')) {
      const resultBuffer = await response.buffer();
      await sock.sendMessage(m.chat, {
        image: resultBuffer,
        caption: `✨ *Fake Telegram Profile Generated!*`
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    // Jika Response JSON
    const resJson = await response.json();
    if (resJson.result && typeof resJson.result === 'string' && resJson.result.startsWith('http')) {
      await sock.sendMessage(m.chat, {
        image: { url: resJson.result },
        caption: `✨ *Fake Telegram Profile Generated!*`
      }, { quoted: m });
      await m.react('✅');
    } else {
      await m.react('❌');
      m.reply(`❌ *Gagal generate:* ${resJson.message || 'Terjadi kesalahan pada server API.'}`);
    }

  } catch (err) {
    console.error('[FAKE TG ERROR]', err);
    await m.react('❌');
    await m.reply(`❌ *Terjadi Kesalahan:* ${err.message}`);
  }
}

export { pluginConfig as config, handler };
