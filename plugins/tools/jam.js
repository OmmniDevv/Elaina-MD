/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const pluginConfig = {
  name: 'timeis',
  alias: ['waktujakarta'],
  category: 'tools',
  description: 'Cek waktu Jakarta dari time.is',
  usage: '.timeis',
  example: '.timeis',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

async function handler(m) {
  await m.react('⏳');
  try {
    const { data } = await axios.get('https://time.is/id/Jakarta', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 15000,
    });
    const $ = cheerio.load(data);
    const lokasi = $('#msgdiv b').text().trim() || 'Jakarta';
    const tanggal = $('#dd').text().trim() || 'Tidak ditemukan';
    const jam = $('#clock0_bg').text().trim() || new Date().toLocaleTimeString('id-ID', {
      hour12: false,
      timeZone: 'Asia/Jakarta',
    });

    await m.reply(`*Waktu di Jakarta Sekarang*\n\n*Lokasi:* ${lokasi}\n*Tanggal:* ${tanggal}\n*Jam:* ${jam}`);
    await m.react('✅');
  } catch (error) {
    console.error('[JAM]', error?.message || error);
    await m.react('❌');
    await m.reply('❌ Gagal mengambil data waktu dari time.is.');
  }
}

export { pluginConfig as config, handler };
