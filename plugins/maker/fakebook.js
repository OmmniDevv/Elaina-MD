/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import { withNetworkRetry, formatNetworkError } from '../../src/lib/elaina-network.js';

const pluginConfig = {
  name: "fakebook",
  alias: ["bookquote", "quotebuku", "fakebuku"],
  category: "maker",
  description: "Membuat gambar quote estetis gaya halaman buku",
  usage: ".fakebook <teks>",
  example: ".fakebook Mencintaimu adalah hal terindah yang pernah ada.",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, text }) {
  const inputTeks = text || m.text?.split(' ').slice(1).join(' ') || '';

  if (!inputTeks) {
    return m.reply(
      `⚠️ *Format Salah*\n\n` +
      `Penggunaan:\n\`.fakebook <teks>\`\n\n` +
      `Contoh:\n\`.fakebook Mencintaimu adalah hal terindah yang pernah ada.\``
    );
  }

  await m.react('⏳');

  try {
    const apiUrl = `https://api.nexray.web.id/maker/fakebook?teks=${encodeURIComponent(inputTeks.trim())}`;

    const response = await withNetworkRetry(() => axios.get(apiUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }));

    await sock.sendMessage(m.chat, {
      image: Buffer.from(response.data),
      caption: `📖 *Fake Book Quote Generated!*`
    }, { quoted: m });

    await m.react('✅');

  } catch (error) {
    console.error('[FAKEBOOK ERROR]', error);
    await m.react('❌');
    await m.reply(`❌ *Gagal:* ${formatNetworkError(error, 'AlwaysCodex FakeBook')}`);
  }
}

export { pluginConfig as config, handler };
