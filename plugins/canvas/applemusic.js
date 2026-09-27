/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import FormData from "form-data";

const pluginConfig = {
  name: "applemusic-canvas",
  alias: ["applemusic", "applecanvas"],
  category: "canvas",
  description: "Buat gambar pemutar Apple Music dari foto",
  usage: ".applemusic-canvas judul | artis (reply gambar)",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

async function uploadImage(buffer) {
  const form = new FormData();
  form.append('file', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' });
  
  const response = await axios.post('https://c.termai.cc/api/upload?key=AIzaBj7z2z3xBjsk', form, {
      headers: form.getHeaders(),
      timeout: 30000
  });
  
  if (response.data?.path) {
      return response.data.path;
  } else if (response.data?.files && response.data.files[0]?.url) {
      return response.data.files[0].url;
  }
  
  throw new Error('Upload gagal');
}

async function handler(m, { sock, text }) {
  const isImage = m.isImage || (m.quoted && m.quoted.type === "imageMessage");
  
  if (!isImage || !text || !text.includes("|")) {
    let help = `🎵 *APPLE MUSIC CANVAS*\n\n`
    help += `Fitur ini digunakan untuk membuat desain pemutar lagu Apple Music yang keren dari gambarmu!\n\n`
    help += `*Cara Penggunaan:*\n`
    help += `- Kirim gambar dengan caption *${m.prefix}applemusic-canvas Judul Lagu | Nama Artis*\n`
    help += `- Atau balas (reply) gambar dengan pesan *${m.prefix}applemusic-canvas Judul Lagu | Nama Artis*\n\n`
    help += `*Contoh:* ${m.prefix}applemusic-canvas Glimpse of Us | Joji`
    return m.reply(help);
  }
  
  await m.react("🕕");
  
  try {
    let [title, artist] = text.split("|").map(s => s.trim());
    
    let buffer;
    if (m.quoted && m.quoted.isMedia) {
      buffer = await m.quoted.download();
    } else if (m.isMedia) {
      buffer = await m.download();
    }
    
    if (!buffer) {
      await m.react("❌");
      return m.reply(`Maaf, sistem gagal mengunduh gambar cover yang kamu berikan.`);
    }

    const coverUrl = await uploadImage(buffer);
    
    const apiUrl = `https://my.izuka-api.xyz/api/canvas/apple-music?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}&coverUrl=${encodeURIComponent(coverUrl)}`;
    
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    
    await sock.sendMessage(m.chat, { image: Buffer.from(response.data) }, { quoted: m });
    await m.react("✅");

  } catch (error) {
    console.error("[APPLEMUSIC Plugin Error]", error);
    await m.react("❌");
    m.reply(`Maaf, gagal membuat canvas Apple Music. Coba lagi beberapa saat.`);
  }
}

export { pluginConfig as config, handler };
