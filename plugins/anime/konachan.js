/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import searchKonachan from '../../src/scraper/konachan.js';

const pluginConfig = {
  name: "konachan",
  alias: ["konasearch", "kona", "konaimg"],
  category: "anime",
  description: "Cari gambar anime dari konachan",
  usage: ".konachan <tags>",
  example: ".konachan long_hair blue_eyes",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { args, sock }) {
  if (!args[0]) {
    let txt = `🌸 *KONACHAN SEARCH* 🌸\n\n`;
    txt += `Halo kak! Lagi nyari referensi gambar anime keren? Sini aku carikan dari Konachan!\n\n`;
    txt += `*Cara Pakai:*\n`;
    txt += `👉 \`${m.prefix}konachan <tag1> <tag2>\`\n\n`;
    txt += `*Contoh:*\n`;
    txt += `\`${m.prefix}konachan long_hair\`\n`;
    txt += `\`${m.prefix}konachan naruto\`\n`;
    txt += `\`${m.prefix}konachan blue_eyes smile\`\n\n`;
    txt += `*Tags populer:*\n`;
    txt += `long_hair, blue_eyes, smile, school_uniform, nekomimi`;
    return m.reply(txt);
  }

  await m.react("🕕");

  try {
    const query = args.join(" ");
    const results = await searchKonachan(query);

    if (results.error) {
      await m.react("❌");
      return m.reply(`❌ Maaf kak, ada masalah saat nyari gambarnya!\nError: ${results.message}`);
    }

    if (!results || results.length === 0) {
      await m.react("❌");
      return m.reply(`❌ Aduh kak, gambarnya nggak ketemu nih! Coba ganti tag pencariannya ya. 😭\n\n*Contoh tag:*\n${args[0]} → coba pake tag lain kayak "anime", "wallpaper", atau yang lebih spesifik`);
    }

    // Batasin maksimal hasil
    const maxResults = Math.min(results.length, 20);
    const randomIdx = Math.floor(Math.random() * maxResults);
    const image = results[randomIdx];

    if (!image || !image.images || !image.images.preview) {
      await m.react("❌");
      return m.reply(`❌ Waduh kak, gambarnya ga bisa dimuat! Coba cari dengan tag lain ya~`);
    }

    // Format caption
    let caption = `🌸 *KONACHAN SEARCH RESULT* 🌸\n\n`;
    caption += `🔍 *Query:* ${query}\n`;
    caption += `📊 *Total found:* ${results.length} gambar\n`;
    caption += `🎲 *Random ke-${randomIdx + 1}*\n\n`;
    caption += `🏷️ *Tags:*\n`;
    
    // Tampilkan tags (batasi biar ga kepanjangan)
    const tagDisplay = image.tags.slice(0, 15).join(", ");
    caption += `${tagDisplay}${image.tags.length > 15 ? '...' : ''}\n\n`;
    caption += `🔗 *Source:*\n${image.details_page || 'https://konachan.net'}\n\n`;
    caption += `💕 *Rimuru:* Selamat menikmati darling~ ♡`;

    // Kirim gambar pake sendMessage (bukan sendMedia)
    await sock.sendMessage(m.chat, {
      image: { url: image.images.preview },
      caption: caption
    }, { quoted: m });

    await m.react("✅");
    
  } catch (e) {
    console.error('[Konachan] Error:', e);
    await m.react("❌");
    await m.reply(`❌ Maaf kak, sistem error! 😭\n\nError: ${e.message}\n\nCoba lagi nanti ya darling~ 💕`);
  }
}

export { pluginConfig as config, handler };
