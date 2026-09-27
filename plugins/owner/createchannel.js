/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import FormData from 'form-data';
import { downloadMediaMessage } from '@rexxhayanasi/elaina-baileys';
import axios from 'axios';

const pluginConfig = {
  name: 'createchannel',
  alias: ['createch'],
  category: 'owner',
  description: 'Membuat WhatsApp Channel/newsletter baru',
  usage: '.createchannel <nama>|<deskripsi>',
  example: '.createchannel Rimuru MD|Channel resmi bot',
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  isEnabled: true,
};

const DEFAULT_CHANNEL_IMAGE = 'https://files.catbox.moe/xpntd8.jpg';

async function uploadCatbox(buffer) {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', buffer, { filename: 'channel.jpg' });
  const res = await axios.post('https://catbox.moe/user/api.php', form, {
    headers: form.getHeaders(),
    timeout: 30000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
  const url = String(res.data || '').trim();
  if (!url.startsWith('https://')) throw new Error('Catbox tidak mengembalikan URL');
  return url;
}

async function handler(m, { sock }) {
  const text = String(m.text || '').trim();
  if (!text) return m.reply(`📛 Gunakan format:\n${m.prefix || '.'}createchannel <nama>|<deskripsi>`);

  const [nameRaw, ...descParts] = text.split('|');
  const name = String(nameRaw || '').trim();
  const desc = descParts.join('|').trim() || 'Tidak ada deskripsi.';
  if (!name) return m.reply('❌ Nama channel wajib diisi.');

  let imageUrl = DEFAULT_CHANNEL_IMAGE;
  try {
    const quoted = m.quoted;
    if (quoted && (quoted.mtype === 'imageMessage' || quoted.type === 'imageMessage' || quoted.isMedia)) {
      const buffer = await (quoted.download?.() || downloadMediaMessage(quoted, 'buffer', {}));
      if (buffer) imageUrl = await uploadCatbox(buffer);
    }
  } catch (e) {
    console.warn('[CREATECHANNEL] Upload image failed:', e?.message || e);
  }

  try {
    if (typeof sock.newsletterCreate !== 'function') {
      return m.reply('❌ Baileys pada SC ini tidak menyediakan `newsletterCreate`.');
    }

    const newsletter = await sock.newsletterCreate(name, desc, { url: imageUrl });
    const invite = newsletter?.invite || '';
    const id = newsletter?.id || '—';
    const link = invite ? `https://whatsapp.com/channel/${invite}` : 'Tidak tersedia';

    await sock.sendMessage(m.chat, {
      text: `✅ *Channel Berhasil Dibuat!*\n\n📡 *Nama:* ${name}\n📝 *Deskripsi:* ${desc}\n🆔 *ID:* ${id}\n🔗 *Link:* ${link}`,
      contextInfo: {
        externalAdReply: {
          title: name,
          body: 'WhatsApp Channel',
          sourceUrl: invite ? link : 'https://whatsapp.com/channel',
          thumbnailUrl: imageUrl,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    }, { quoted: m });
  } catch (err) {
    console.error('[CREATECHANNEL]', err);
    await m.reply(`❌ Gagal membuat channel: ${err?.message || err}`);
  }
}

export { pluginConfig as config, handler };
