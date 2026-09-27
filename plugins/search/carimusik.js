/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import config from '../../config.js';

export const musicSessions = new Map();

const pluginConfig = {
  name: 'carimusik',
  alias: ['searchmusik', 'musiksearch', 'cari lagu'],
  category: 'search',
  description: 'Cari lagu dan siapkan hasil untuk diunduh',
  usage: '.carimusik <judul lagu>',
  example: '.carimusik night dancer',
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

function getApiKey() {
  return config.zeroApi?.neoxr || '';
}

async function handler(m, { sock }) {
  const query = (m.text || m.args?.join(' ') || '').trim();
  if (!query) return m.reply(`🎵 Contoh: ${m.prefix}carimusik night dancer`);

  const key = getApiKey();
  if (!key) return m.reply('❌ API pencarian musik belum dikonfigurasi.');

  await m.react('🔎');
  try {
    const { data } = await axios.get('https://api.neoxr.eu/api/song', {
      params: { q: query, apikey: key },
      timeout: 30000,
    });

    const rows = Array.isArray(data?.data) ? data.data : [];
    if (!data?.status || rows.length === 0) {
      await m.react('❌');
      return m.reply('❌ Lagu tidak ditemukan.');
    }

    const songs = rows.slice(0, 10).map((item, index) => ({
      title: item.title || `Hasil ${index + 1}`,
      url: item.url || null,
      user: item.user || null,
      duration: item.duration || 0,
      artwork_url: item.artwork_url || null,
    }));

    musicSessions.set(m.sender, { query, songs, createdAt: Date.now() });

    const text = songs.map((song, i) => `${i + 1}. *${song.title}*${song.user?.username ? ` — ${song.user.username}` : ''}`).join('\n');
    await m.react('✅');
    return sock.sendMessage(m.chat, {
      text: `🎵 *HASIL PENCARIAN MUSIK*\n\n${text}\n\n> Gunakan *${m.prefix}getmusik <nomor>* untuk mengunduh.`,
    }, { quoted: m });
  } catch (error) {
    await m.react('❌').catch(() => {});
    return m.reply(`❌ Gagal mencari musik: ${error.message}`);
  }
}

export { pluginConfig as config, handler };
