/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import FormData from 'form-data';
import { getAssetBuffer } from '../../src/lib/elaina-asset-manager.js';
import { uploadTo0x0 } from '../../src/lib/elaina-tmpfiles.js';
import te from '../../src/lib/elaina-error.js';

const pluginConfig = {
  name: 'fakeml',
  alias: ['mlbbfake', 'mlcard', 'mlfake'],
  category: 'canvas',
  description: 'Membuat fake ML profile card',
  usage: '.fakeml <nama> (reply/kirim foto)',
  example: '.fakeml Misaki',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

const CATBOX_URL = 'https://catbox.moe/user/api.php';
const FAKE_ML_API = 'https://api.nexray.web.id/maker/fakelobyml';

async function uploadImage(buffer) {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', buffer, {
    filename: 'rimuru-fakeml-avatar.jpg',
    contentType: 'image/jpeg',
  });

  const response = await axios.post(CATBOX_URL, form, {
    headers: form.getHeaders(),
    timeout: 30000,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    validateStatus: (status) => status >= 200 && status < 300,
  });

  const url = String(response.data || '').trim();
  if (!/^https?:\/\//i.test(url)) {
    throw new Error('Upload avatar tidak menghasilkan URL yang valid');
  }
  return url;
}

function isImageBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) return false;
  const hex = buffer.subarray(0, 12).toString('hex').toLowerCase();
  return (
    hex.startsWith('ffd8ff') ||
    hex.startsWith('89504e470d0a1a0a') ||
    hex.startsWith('47494638') ||
    (buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP')
  );
}

async function getInputImage(m, sock) {
  const quotedType = m.quoted?.mtype || m.quoted?.type || m.quoted?.msg?.mtype;
  if (m.quoted && quotedType === 'imageMessage' && typeof m.quoted.download === 'function') {
    return m.quoted.download();
  }

  const ownType = m.type || m.mtype;
  if (m.isMedia && ownType === 'imageMessage' && typeof m.download === 'function') {
    return m.download();
  }

  try {
    const profileUrl = await sock.profilePictureUrl(m.sender, 'image');
    const response = await axios.get(profileUrl, {
      responseType: 'arraybuffer',
      timeout: 15000,
    });
    const profileBuffer = Buffer.from(response.data);
    if (isImageBuffer(profileBuffer)) return profileBuffer;
  } catch {}

  return getAssetBuffer('pp-kosong');
}

async function handler(m, { sock, text }) {
  const name = String(text ?? m.text ?? '').trim();
  if (!name) {
    return m.reply(
      `🎮 *ꜰᴀᴋᴇ ᴍʟ ᴘʀᴏꜰɪʟᴇ*\n\n` +
      `> Masukkan nama untuk profile\n\n` +
      `*ᴄᴀʀᴀ ᴘᴀᴋᴀɪ:*\n` +
      `> 1. Kirim foto + caption \`${m.prefix}fakeml <nama>\`\n` +
      `> 2. Reply foto dengan \`${m.prefix}fakeml <nama>\``
    );
  }

  await m.react('🕕');

  try {
    const buffer = await getInputImage(m, sock);
    if (!isImageBuffer(buffer)) {
      throw new Error('Avatar tidak terbaca sebagai gambar');
    }

    let avatarUrl;
    try {
      avatarUrl = await uploadImage(buffer);
    } catch (uploadError) {
      // Fallback ke uploader internal lama agar fitur tetap punya jalur kedua.
      const uploaded = await uploadTo0x0(buffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg',
        timeoutMs: 30000,
      });
      avatarUrl = uploaded?.directUrl || uploaded?.url;
      if (!/^https?:\/\//i.test(String(avatarUrl || ''))) {
        throw uploadError;
      }
    }

    const apiUrl = `${FAKE_ML_API}?avatar=${encodeURIComponent(avatarUrl)}&nickname=${encodeURIComponent(name)}`;
    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
      timeout: 45000,
      headers: {
        Accept: 'image/*',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 16) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36',
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });

    const result = Buffer.from(response.data);
    if (!isImageBuffer(result)) {
      const preview = result.toString('utf8').slice(0, 300);
      throw new Error(`API Fake ML tidak mengembalikan gambar${preview ? `: ${preview}` : ''}`);
    }

    await sock.sendMessage(
      m.chat,
      {
        image: result,
        caption: `🎮 *FAKE ML PROFILE*\n\n👤 *Nickname:* ${name}`,
      },
      { quoted: m }
    );

    await m.react('✅');
  } catch (error) {
    console.error('[FAKEML ERROR]', error);
    await m.react('❌');
    await m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
