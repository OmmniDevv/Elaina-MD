/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import crypto from 'crypto';
import { uploadImage } from '../../src/lib/elaina-uploader.js';

const pluginConfig = {
  name: 'faceswap',
  alias: ['swapface'],
  category: 'ai',
  description: 'Face swap menggunakan Supawork AI',
  usage: '.faceswap <foto target> <wajah>',
  example: '.faceswap <url-gambar-target> <url-wajah>',
  cooldown: 30,
  energi: 3,
  isEnabled: true,
};

const API_URL = 'https://supawork.ai/supawork/headshot/api';
const HEADERS = {
  accept: 'application/json',
  'accept-language': 'id;q=0.5',
  authorization: 'null',
  'content-type': 'application/json',
  origin: 'https://supawork.ai',
  referer: 'https://supawork.ai/ai-face-swap',
  'user-agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/134.0.0.0 Mobile Safari/537.36',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function mediaToUrl(message, sock) {
  if (!message) return null;
  const buffer = await (message.download?.() || sock.downloadMediaMessage(message));
  if (!buffer) throw new Error('Media tidak dapat diunduh');
  return uploadImage(buffer, 'faceswap.jpg');
}

async function resolveImage(value, quoted, sock) {
  if (value) return value;
  if (quoted) return mediaToUrl(quoted, sock);
  return null;
}

async function faceSwap(targetImageUrl, faceImageUrl) {
  const identityID = crypto.randomUUID();
  const payload = {
    aigc_app_code: 'face_swap_single',
    face_swap_type: 'single',
    target_image_url: targetImageUrl,
    target_face_url: faceImageUrl,
    identity_id: identityID,
    currency_type: 'silver',
  };

  const created = await axios.post(`${API_URL}/fs/faceswap`, payload, {
    headers: HEADERS,
    timeout: 30000,
  });

  if (created.data?.code !== 100000) {
    throw new Error(created.data?.message || 'Supawork API menolak request');
  }

  for (let i = 0; i < 10; i += 1) {
    await sleep(5000);
    const result = await axios.get(`${API_URL}/media/aigc/result/list/v1`, {
      headers: HEADERS,
      params: { page_no: 1, page_size: 20, identity_id: identityID },
      timeout: 20000,
    });

    if (result.data?.code !== 100000) {
      throw new Error(result.data?.message || 'Gagal membaca hasil face swap');
    }

    const list = result.data?.data?.list || [];
    const found = list.find((item) => {
      const entry = item?.list?.[0];
      const inputs = entry?.input_urls || [];
      return entry?.status === 1 && inputs.includes(targetImageUrl) && inputs.includes(faceImageUrl);
    });

    if (found?.list?.[0]?.url?.[0]) return found.list[0].url[0];
  }

  throw new Error('Hasil belum tersedia setelah menunggu 50 detik');
}

async function handler(m, { sock, text }) {
  const args = (text || '').trim().split(/\s+/).filter(Boolean);
  const quoted = m.quoted && /imageMessage/i.test(m.quoted.mtype || '') ? m.quoted : null;

  if (args.length < 1 && !quoted) {
    return m.reply(
      `🪄 *ғᴀᴄᴇ sᴡᴀᴘ*\n\n` +
      `Reply gambar wajah dengan gambar target sebagai URL, atau kirim 2 URL gambar.\n` +
      `Contoh: ${m.prefix}faceswap <url-target> <url-wajah>`
    );
  }

  if (m.react) await m.react('🪄');
  try {
    let targetUrl;
    let faceUrl;

    if (args.length >= 2) {
      [targetUrl, faceUrl] = args;
    } else if (args.length === 1 && quoted) {
      targetUrl = args[0];
      faceUrl = await resolveImage(null, quoted, sock);
    } else {
      const images = [];
      if (quoted) images.push(await mediaToUrl(quoted, sock));
      if (m.mtype === 'imageMessage') images.push(await mediaToUrl(m, sock));
      if (images.length < 2) throw new Error('Butuh dua gambar: target dan wajah');
      [targetUrl, faceUrl] = images;
    }

    const output = await faceSwap(targetUrl, faceUrl);
    if (m.react) await m.react('✅');
    return sock.sendMessage(m.chat, {
      image: { url: output },
      caption: '✅ *Face swap berhasil.*',
    }, { quoted: m });
  } catch (e) {
    if (m.react) await m.react('❌');
    return m.reply(`❌ *Face swap gagal:* ${String(e.message).slice(0, 200)}`);
  }
}

export { pluginConfig as config, handler };
