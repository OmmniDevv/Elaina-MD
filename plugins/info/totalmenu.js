/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getCategories, getCommandsByCategory } from '../../src/lib/elaina-plugins.js';

const pluginConfig = {
  name: 'totalmenu',
  alias: ['menulist', 'listmenu', 'cekmenu', 'totalcase'],
  category: 'info',
  description: 'Menampilkan ringkasan menu aktif Rimuru MD',
  usage: '.totalmenu',
  example: '.totalmenu',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { db }) {
  const commands = getCommandsByCategory();
  const categories = getCategories().filter((cat) => (commands[cat] || []).length);
  const total = categories.reduce((n, cat) => n + (commands[cat]?.length || 0), 0);
  const owner = m.isOwner ? '\n• Owner: dapat melihat kategori Owner' : '';

  const text =
`╭─〔 ✦ 𝑹𝑰𝑴𝑼𝑹𝑼 𝑴𝑫 ✦ 〕─╮
│  𝑴𝒆𝒏𝒖 𝑨𝒌𝒕𝒊𝒇 : 𝑽𝟓 — 𝑳𝑽 𝟐
│  𝑲𝒂𝒕𝒆𝒈𝒐𝒓𝒊  : ${categories.length}
│  𝑭𝒊𝒕𝒖𝒓      : ${total}
│
│  Menu sudah dikunci ke tampilan V5 — LV 2.
│  Tampilan menu dikunci ke satu versi utama.
│  Pilih kategori melalui tombol 🌸 Pilih Menu.${owner}
╰────────────────────╯`;

  await m.reply(text);
}

export { pluginConfig as config, handler };
