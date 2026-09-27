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
  name: "fakeff3",
  alias: ["fffake3", "fakecardff3", "profileff3"],
  category: "maker",
  description: "Membuat kartu profil/lobby Free Fire palsu (v3)",
  usage: ".fakeff3 username|lobby",
  example: ".fakeff3 AlwaysCodex|1",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, text }) {
  const input = (text || m.text?.split(' ').slice(1).join(' ') || '').trim();

  // Jika input kosong, tampilkan panduan & daftar pilihan lobby
  if (!input) {
    let guide = `🔫 *FAKEFF3 - FREE FIRE CARD MAKER* 🔫\n\n`;
    guide += `Format penggunaan:\n`;
    guide += `\`${m.prefix || '.'}fakeff3 username|lobby\`\n\n`;

    guide += `🏕️ *Pilihan Lobby:* \n`;
    guide += `• Angka \`1\` sampai \`30\`\n\n`;

    guide += `📌 *Contoh Penggunaan:*\n`;
    guide += `• \`${m.prefix || '.'}fakeff3 AlwaysCodex|1\`\n`;
    guide += `• \`${m.prefix || '.'}fakeff3 ZennzXD|22\`\n`;

    return m.reply(guide.trim());
  }

  const [usernameInput, lobbyInput] = input.split('|').map(v => v ? v.trim() : '');

  if (!usernameInput) {
    return m.reply(`⚠️ Username harus diisi!\nContoh: \`${m.prefix || '.'}fakeff3 AlwaysCodex|1\``);
  }

  const username = usernameInput;
  const lobby = lobbyInput || '1'; // Default ke lobby 1 jika kosong

  await m.react('⏳');

  try {
    const apiUrl = `https://api.nexray.web.id/maker/fakelobyff?username=${encodeURIComponent(username)}&lobby=${encodeURIComponent(lobby)}`;

    const response = await withNetworkRetry(() => axios.get(apiUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }));

    await sock.sendMessage(m.chat, {
      image: Buffer.from(response.data),
      caption: `🔫 *Fake FF Profile Card Generated (v3)!*\n\n👤 *Username:* ${username}\n🏕️ *Lobby:* ${lobby}`
    }, { quoted: m });

    await m.react('✅');

  } catch (error) {
    console.error('[FAKEFF3 ERROR]', error);
    await m.react('❌');
    await m.reply(`❌ *Gagal:* ${formatNetworkError(error, 'AlwaysCodex Fake FF')}`);
  }
}

export { pluginConfig as config, handler };
