/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fetch from "node-fetch";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "izen",
  alias: ["skiplink", "izen"],
  category: "tools",
  description: "Bypass shortlink / skiplink menggunakan izen",
  usage: ".izen link",
  example: ".izen https://sfl.gl/xxxxx",
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
    let txt = `🔗 *SKIPLINK BYPASS* 🔗\n\n`;
    txt += `Halo kak! Punya link yang ribet ngelewatin iklan? Sini aku bantu lewatin biar langsung ke tujuan akhir!\n\n`;
    txt += `*Cara Pakai:*\n`;
    txt += `👉 \`${m.prefix}izen <link>\`\n\n`;
    txt += `*Contoh:*\n`;
    txt += `👉 \`${m.prefix}izen https://sfl.gl/xxxxx\``;
    return m.reply(txt);
  }

  await m.react("⏳");
  
  try {
    const res = await fetch(`https://anabot.my.id/api/tools/izenLOL?url=${encodeURIComponent(args[0])}&apikey=freeApikey`);
    const json = await res.json();
    
    if (!json.data?.result?.result) {
       return m.reply("❌ Waduh kak, gagal ngelewatin link-nya nih! Coba link lain ya.");
    }
    
    let txt = `✅ *BERHASIL BYPASS LINK!* ✅\n\n`;
    txt += `*Link Asli:* \n`;
    txt += `🔗 ${args[0]}\n\n`;
    txt += `*Hasil Bypass:* \n`;
    txt += `🚀 ${json.data.result.result}\n\n`;
    txt += `Semoga ngebantu ya kak! ✨`;
    
    await m.reply(txt);
    await m.react("✅");
  } catch (e) {
    m.reply(`❌ Maaf kak, terjadi kesalahan sistem! 😭\nError: ${e.message}`);
  }
}

export { pluginConfig as config, handler };
