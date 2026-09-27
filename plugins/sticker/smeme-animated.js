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
import { uploadImage } from '../../src/lib/elaina-uploader.js';
import { downloadMediaMessage, getContentType } from '@rexxhayanasi/elaina-baileys';

const pluginConfig = {
  name: 'smeme-animated',
  alias: ['smeme-animated', 'smemevid'],
  category: 'sticker',
  description: 'Buat stiker meme animasi',
  usage: '.smeme-animated <teks_atas>|<teks_bawah>',
  example: '.smeme-animated mas|anies (sambil balas gambar)',
  cooldown: 5,
  energi: 2,
};

async function handler(m, { sock }) {
  const text = m.text?.trim();
  
  if (!text) {
    return m.reply(`⚠️ Harap masukkan teks atas dan bawah!\nContoh: \`${m.prefix}${m.command} atas|bawah\``);
  }

  const parts = text.split('|');
  const top = parts[0]?.trim() || '';
  const bottom = parts[1]?.trim() || '';

  const msg = m.message;
  const isQuotedImage = m.quoted && (getContentType(m.quoted.message) === 'imageMessage' || m.quoted.mtype === 'imageMessage');
  const isImage = getContentType(msg) === 'imageMessage' || m.mtype === 'imageMessage';

  if (!isImage && !isQuotedImage) {
    return m.reply(`⚠️ Harap kirim atau balas gambar dengan caption \`${m.prefix}${m.command} teks_atas|teks_bawah\``);
  }

  await m.react('🕕');

  try {
    const targetMsg = isQuotedImage ? m.quoted : m;
    const buffer = await downloadMediaMessage(
      targetMsg,
      'buffer',
      {},
      { logger: console }
    );

    const imageUrl = await uploadImage(buffer);
    
    const apiUrl = `https://api.neoxr.eu/api/memegenvid?image=${encodeURIComponent(imageUrl)}&top=${encodeURIComponent(top)}&bottom=${encodeURIComponent(bottom)}&apikey=${config.APIkey.neoxr}`;
    
    const response = await axios.get(apiUrl);
    if (!response.data.status || !response.data.data?.url) {
      return m.reply('❌ Gagal membuat meme, kemungkinan API sedang gangguan.');
    }

    const stickerUrl = response.data.data.url;
    const stickerBuffer = await axios.get(stickerUrl, { responseType: 'arraybuffer' }).then(res => res.data);

    await sock.sendImageAsSticker(m.chat, stickerBuffer, m, {
        packname: config.sticker.packname,
        author: config.sticker.author
    });

    await m.react('✅');
  } catch (error) {
    await m.react('☢');
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
