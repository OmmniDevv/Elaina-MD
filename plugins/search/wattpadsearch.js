/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const pluginConfig = {
  name: 'wattpadsearch',
  alias: ['wattpad'],
  category: 'search',
  description: 'Mencari cerita Wattpad',
  usage: '.wattpadsearch <query>',
  example: '.wattpadsearch cinta',
  cooldown: 8,
  energi: 1,
  isEnabled: true,
};

function compactNumber(value) {
  const n = Number(value || 0);
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

async function handler(m, { text }) {
  const query = (text || '').trim();
  if (!query) return m.reply(`📖 *ᴡᴀᴛᴛᴘᴀᴅ sᴇᴀʀᴄʜ*\n\nContoh: ${m.prefix}wattpadsearch cinta`);

  if (m.react) await m.react('📖');
  try {
    const { data } = await axios.get(
      `https://api.lolhuman.xyz/api/wattpadsearch?apikey=none&query=${encodeURIComponent(query)}`,
      { timeout: 30000 }
    );

    if (data?.status !== 200 || !Array.isArray(data?.result) || !data.result.length) {
      throw new Error('Cerita tidak ditemukan');
    }

    const rows = data.result.slice(0, 5).map((s, i) =>
      `${i + 1}. *${s.title || '-'}*\n` +
      `   ✍️ ${s.author || '-'} | 👁️ ${compactNumber(s.readCount)} | ⭐ ${compactNumber(s.voteCount)}\n` +
      `   📝 ${(s.description || '-').slice(0, 100)}${(s.description || '').length > 100 ? '...' : ''}\n` +
      `${s.url ? `   🔗 ${s.url}\n` : ''}`
    ).join('\n');

    if (m.react) await m.react('✅');
    return m.reply(`📖 *ᴡᴀᴛᴛᴘᴀᴅ sᴇᴀʀᴄʜ*\n\n> Query: *${query}*\n━━━━━━━━━━━━━━━\n\n${rows}`.trim());
  } catch (e) {
    if (m.react) await m.react('❌');
    return m.reply(`❌ *Wattpad Search gagal:* ${String(e.message).slice(0, 160)}`);
  }
}

export { pluginConfig as config, handler };
