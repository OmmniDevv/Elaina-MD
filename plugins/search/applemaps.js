/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fetch from 'node-fetch';

const pluginConfig = {
  name: "applemaps",
  alias: ["maps", "applemap", "carilokasi"],
  category: "search",
  description: "Cari lokasi dan detail tempat menggunakan Apple Maps",
  usage: ".applemaps <nama_tempat/lokasi>",
  example: ".applemaps Indonesia",
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
    return m.reply(`⚠️ *Format Salah*\n\nPenggunaan:\n\`.applemaps <nama_tempat/lokasi>\`\n\nContoh:\n\`.applemaps Monas Jakarta\``);
  }

  const query = text.trim();
  const apiKey = "4ZtwE"; // API Key dari docs
  const apiUrl = `https://api.theresav.biz.id/search/applemaps?apikey=${apiKey}&q=${encodeURIComponent(query)}`;

  await m.react('⏳');

  try {
    const response = await fetch(apiUrl);
    const res = await response.json();

    if (!res.status || !res.result || !res.result.places || res.result.places.length === 0) {
      await m.react('❌');
      return m.reply(`❌ *Gagal:* Lokasi \`${query}\` tidak ditemukan.`);
    }

    // Mengambil data tempat pertama
    const place = res.result.places[0];

    // Format Kategori
    const categories = Array.isArray(place.categories) && place.categories.length > 0 
      ? place.categories.join(', ') 
      : '-';

    // Format Link Apple Maps & Google Maps berdasarkan Koordinat
    const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(place.name)}&ll=${place.latitude},${place.longitude}`;
    const googleMapsUrl = `https://www.google.com/maps?q=${place.latitude},${place.longitude}`;

    const captionText = 
      `🗺️ *APPLE MAPS SEARCH RESULT* 🗺️\n\n` +
      `📍 *Nama Tempat:* ${place.name || query}\n` +
      `🏢 *Kategori:* ${categories}\n` +
      `🏠 *Alamat:* ${place.address || '-'}\n` +
      `🏙️ *Kota:* ${place.city || '-'}\n` +
      `🇮🇩 *Negara:* ${place.country || '-'}\n\n` +
      `🌐 *Koordinat:* \`${place.latitude}, ${place.longitude}\`\n\n` +
      `🔗 *Apple Maps:* ${appleMapsUrl}\n` +
      `🔗 *Google Maps:* ${googleMapsUrl}`;

    // Cek apakah ada foto lokasi
    const firstPhoto = Array.isArray(place.photos) && place.photos.length > 0 ? place.photos[0].url : null;

    if (firstPhoto) {
      await sock.sendMessage(m.chat, {
        image: { url: firstPhoto },
        caption: captionText
      }, { quoted: m });
    } else {
      await sock.sendMessage(m.chat, { text: captionText }, { quoted: m });
    }

    await m.react('✅');

  } catch (err) {
    console.error('[APPLE MAPS ERROR]', err);
    await m.react('❌');
    await m.reply(`❌ *Terjadi Kesalahan:* ${err.message}`);
  }
}

export { pluginConfig as config, handler };
