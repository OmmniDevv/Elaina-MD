/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fetch from 'node-fetch';
import { withNetworkRetry, formatNetworkError } from '../../src/lib/elaina-network.js';

const pluginConfig = {
  name: "cekplat",
  alias: ["plat", "cekplatnomor", "platnomor"],
  category: "tools",
  description: "Cek informasi asal wilayah dan jenis kendaraan dari plat nomor",
  usage: ".cekplat <plat_nomor>",
  example: ".cekplat B 1234 XYZ",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, text }) {
  if (!text) {
    return m.reply(`⚠️ *Format Salah*\n\nPenggunaan:\n\`.cekplat <plat_nomor>\`\n\nContoh:\n\`.cekplat B 1234 XYZ\` atau \`.cekplat D 1234 ABC\``);
  }

  const queryPlate = text.trim();
  const apiUrl = `https://api.nexray.web.id/tools/cekplat?plate=${encodeURIComponent(queryPlate)}`;

  await m.react('⏳');

  try {
    const response = await withNetworkRetry(() => fetch(apiUrl, { timeout: 30000 }));
    const res = await response.json();

    if (!res.status || !res.result) {
      await m.react('❌');
      return m.reply(`❌ *Gagal:* Informasi untuk plat nomor \`${queryPlate}\` tidak ditemukan.`);
    }

    const data = res.result;

    const resultText = 
      `🚘 *INFORMASI PLAT NOMOR KENDARAAN* 🚘\n\n` +
      `🏷️ *Plat Nomor:* \`${data.raw || queryPlate}\`\n` +
      `📍 *Provinsi:* ${data.province || '-'}\n` +
      `🗺️ *Cakupan Wilayah:* ${data.region || '-'}\n` +
      `🏎️ *Jenis Kendaraan:* ${data.type || '-'}\n\n` +
      `📌 *Detail Rincian:*\n` +
      `  • Kode Depan (Prefix): \`${data.prefix || '-'}\`\n` +
      `  • Nomor Seri: \`${data.number || '-'}\`\n` +
      `  • Kode Belakang (Suffix): \`${data.suffix || '-'}\``;

    await m.react('✅');
    await m.reply(resultText);

  } catch (err) {
    console.error('[CEK PLAT ERROR]', err);
    await m.react('❌');
    await m.reply(`❌ *Gagal:* ${formatNetworkError(err, 'AlwaysCodex Cek Plat')}`);
  }
}

export { pluginConfig as config, handler };
