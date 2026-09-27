/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import config from '../../config.js';
import te from '../../src/lib/elaina-error.js';

const pluginConfig = {
  name: 'attp2',
  alias: ['attp2'],
  category: 'sticker',
  description: 'Buat sticker animasi teks',
  usage: '.attp2 <teks>',
  example: '.attp2 Halo dunia',
  cooldown: 5,
  energi: 2,
};

async function handler(m, { sock }) {
  const text = m.text?.trim() || m.quoted?.text?.trim();

  if (!text) {
    return m.reply(`⚠️ Harap masukkan teks!\nContoh: \`${m.prefix}${m.command} Halo semua\``);
  }

  await m.react('🕕');

  try {
    const colors = encodeURIComponent(JSON.stringify(["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"]));
    const apiUrl = `https://api.neoxr.eu/api/attp2?text=${encodeURIComponent(text)}&color=${colors}&apikey=${config.APIkey.neoxr}`;

    const response = await axios.get(apiUrl);
    if (!response.data.status || !response.data.data?.url) {
      return m.reply('❌ Gagal membuat sticker, kemungkinan limit API habis.');
    }

    const stickerUrl = response.data.data.url;
    const stickerBuffer = await axios.get(stickerUrl, { responseType: 'arraybuffer' }).then(res => res.data);

    await sock.sendVideoAsSticker(m.chat, stickerBuffer, m, {
      packname: config.sticker.packname,
      author: config.sticker.author
    });

    await m.react('✅');
  } catch (error) {
    console.log(error)
    await m.react('☢');
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
