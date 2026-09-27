/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";

const pluginConfig = {
  name: "topanime",
  alias: ["top-anime", "waifutop"],
  category: "anime",
  description: "Melihat daftar karakter anime / waifu terpopuler",
  usage: ".topanime",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  await m.react("🕕");
  
  try {
    const response = await axios.get("https://my.izuka-api.xyz/api/anime/top-anime");
    const data = response.data;
    
    if (!data.status || !data.result || !data.result.result) {
      await m.react("❌");
      return m.reply(`Maaf, sistem gagal mengambil daftar Top Anime.`);
    }

    const list = data.result.result;
    
    let txt = `🏆 *TOP ANIME CHARACTERS (WAIFU LIST)* 🏆\n\n`;
    txt += `Berikut adalah daftar karakter terpopuler dan paling dicintai saat ini:\n\n`;
    
    const maxItems = Math.min(list.length, 10);
    
    for (let i = 0; i < maxItems; i++) {
      const char = list[i];
      txt += `*${char.rank} - ${char.name}*\n`;
      txt += `- *Jepang:* ${char.japanese}\n`;
      txt += `- *Anime:* ${char.anime}\n`;
      txt += `- *Favorit:* ${char.favorites} | *Votes:* ${char.votes}\n\n`;
    }
    
    txt += `_Menampilkan ${maxItems} karakter teratas._`;
    
    await m.react("✅");
    
    if (list.length > 0 && list[0].image) {
      await sock.sendMessage(m.chat, { image: { url: list[0].image }, caption: txt }, { quoted: m });
    } else {
      await m.reply(txt);
    }
    
  } catch (error) {
    console.error("[TOPANIME Plugin Error]", error);
    await m.react("❌");
    m.reply(`Maaf, terjadi kesalahan saat menghubungi server. Silakan coba lagi.`);
  }
}

export { pluginConfig as config, handler };
