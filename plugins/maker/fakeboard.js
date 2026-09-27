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
  name: "fakeboard",
  alias: ["boardquote", "quoteboard", "papanquote"],
  category: "maker",
  description: "Membuat gambar papan quote/kutipan dengan author custom",
  usage: ".fakeboard <teks>|<author>",
  example: ".fakeboard Tetap semangat walau codingan error|Alwayscodex",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, text }) {
  const input = text || m.text?.split(' ').slice(1).join(' ') || '';
  const [teks, author] = input.split('|').map(v => v ? v.trim() : '');

  if (!teks) {
    return m.reply(
      `⚠️ *Format Salah*\n\n` +
      `Penggunaan:\n\`.fakeboard <teks>|<author>\`\n\n` +
      `Contoh:\n\`.fakeboard Tetap semangat walau codingan error|Alwayscodex\``
    );
  }

  // Gunakan nama pengirim jika author tidak diisi
  const authorName = author || m.pushName || 'Anonymous';

  await m.react('⏳');

  try {
    const apiUrl = `https://api.nexray.web.id/maker/fakeboard?teks=${encodeURIComponent(teks)}&author=${encodeURIComponent(authorName)}`;

    const response = await withNetworkRetry(() => axios.get(apiUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }));

    await sock.sendMessage(m.chat, {
      image: Buffer.from(response.data),
      caption: `🎨 *Fake Board Quote Generated!*`
    }, { quoted: m });

    await m.react('✅');

  } catch (error) {
    console.error('[FAKEBOARD ERROR]', error);
    await m.react('❌');
    await m.reply(`❌ *Gagal:* ${formatNetworkError(error, 'AlwaysCodex FakeBoard')}`);
  }
}

export { pluginConfig as config, handler };
