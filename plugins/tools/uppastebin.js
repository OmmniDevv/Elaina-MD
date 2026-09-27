/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from 'axios';
const PASTEBIN_API_KEY = 'PXckLHLn4g-XTbETtJ6uRH0dQh6khXRB'; // API Key Dev Pastebin

const pluginConfig = {
  name: "up-pb",
  alias: ["uppastebin"],
  category: "tools",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Harap masukkan kode yang ingin diunggah ke Pastebin!');
  await conn.sendMessage(m.chat, { text: wait }, { quoted: m });

  try {
    const data = {
      api_dev_key: PASTEBIN_API_KEY,
      api_option: 'paste',
      api_paste_code: text,
      api_paste_private: '0', // 1 = Unlisted, 0 = Public, 2 = Private
      api_paste_name: wm,
      api_paste_expire_date: 'N',
      api_paste_format: 'javascript'
    };

    const res = await axios.post('https://pastebin.com/api/api_post.php', new URLSearchParams(data));
    const pasteUrl = res.data;
    const message = `${pasteUrl}\n\n`;

    await conn.sendMessage(m.chat, { text: message }, { quoted: m });

  } catch (error) {
    console.error('Error saat mengunggah ke Pastebin:', error.message);
    await conn.sendMessage(m.chat, { text: `❗ Gagal mengunggah ke Pastebin: ${error.message}` }, { quoted: m });
  }
};

export { pluginConfig as config, handler };
