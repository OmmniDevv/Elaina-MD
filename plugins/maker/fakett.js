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
  name: "fakett",
  alias: ["faketiktok", "fakettprofile"],
  category: "maker",
  description: "Buat gambar tampilan profil TikTok palsu",
  usage: ".fakett nama|username|verified|mengikuti|pengikut|suka|bio (sambil kirim/reply gambar)",
  example: ".fakett Tes|Tes1|false|10|100|1000|Bio Saya",
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

  // 2. Parse argumen dari teks (Pemisah tanda '|')
  if (!text) {
    return m.reply(
      `⚠️ *Format Salah*\n\n` +
      `Kirim atau reply gambar dengan caption/teks:\n` +
      `\`.fakett nama|username|verified|mengikuti|pengikut|suka|bio\`\n\n` +
      `Contoh:\n` +
      `\`.fakett Geto|getosuguru|true|15|10.5K|1M|Suguru Geto Official\``
    );
  }

  const [nama, username, verified, mengikuti, pengikut, suka, bio] = text.split('|').map(v => v ? v.trim() : '');

  if (!nama || !username) {
    return m.reply(`⚠️ Nama dan Username minimal harus diisi!\nContoh: \`.fakett Geto|getosuguru|true|10|100|1000|Bio Saya\``);
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
      return m.reply("❌ Pastikan kamu men-reply atau mengirim **gambar**!");
    }

    if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
      await m.react('❌');
      return m.reply("❌ Gagal mengambil buffer gambar dari pesan.");
    }

    // 4. Buat Form Data Multipart
    const formData = new FormData();
    formData.append('apikey', '4ZtwE');
    formData.append('image', imageBuffer, { filename: 'tiktok_profile.jpg', contentType: 'image/jpeg' });
    formData.append('nama', nama);
    formData.append('username', username);
    formData.append('verified', verified || 'false');
    formData.append('mengikuti', mengikuti || '0');
    formData.append('pengikut', pengikut || '0');
    formData.append('suka', suka || '0');
    formData.append('bio', bio || '');

    // 5. Kirim Request POST ke API
    const response = await fetch('https://api.theresav.biz.id/canvas/faketiktok', {
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
        caption: `✨ *Fake TikTok Profile Generated!*`
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    // Jika Response JSON
    const resJson = await response.json();
    if (resJson.result && typeof resJson.result === 'string' && resJson.result.startsWith('http')) {
      await sock.sendMessage(m.chat, {
        image: { url: resJson.result },
        caption: `✨ *Fake TikTok Profile Generated!*`
      }, { quoted: m });
      await m.react('✅');
    } else {
      await m.react('❌');
      m.reply(`❌ *Gagal generate:* ${resJson.message || 'Terjadi kesalahan pada server API.'}`);
    }

  } catch (err) {
    console.error('[FAKE TIKTOK ERROR]', err);
    await m.react('❌');
    await m.reply(`❌ *Terjadi Kesalahan:* ${err.message}`);
  }
}

export { pluginConfig as config, handler };
