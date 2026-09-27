/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
const pluginConfig = {
  name: "kasedaiki",
  alias: ["kasedai", "aiki"],
  category: "anime",
  description: "Kirim gambar random kasedaiki",
  usage: ".kasedaiki",
  example: ".kasedaiki",
  isOwner: false,
  isPremium: true,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  await m.react("💞");

  try {
    const response = await axios.get("https://api.ourin.my.id/api/kasedaiki", {
      responseType: "arraybuffer",
      timeout: 30000,
      headers: {
        'User-Agent': 'Rimuru-Bot/2.0'
      }
    });

    const buffer = Buffer.from(response.data);

    await sock.sendMessage(m.chat, {
      image: buffer,
      caption: `💞 *ᴋᴀsᴇᴅᴀɪᴋɪ*\n\n> Random image dari api.ourin.my.id\n> Enjoy darling~ 💕`
    }, { quoted: m });

    await m.react("✅");
  } catch (err) {
    console.error('[Kasedaiki] Error:', err.message);
    await m.react("☢");
    await m.reply(`☢ *Error Darling!*\n\n> ${err.message}\n\nCoba lagi nanti ya~ 💕`);
  }
}

export { pluginConfig as config, handler };
