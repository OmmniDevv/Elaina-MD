/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import crypto from 'node:crypto';

const HF_BASE = 'https://kit-lemonfoot-vtuber-rvc-models.hf.space';
const hololiveModels = {
  tokinosora: ['Tokino Sora', 'weights/hololive-jp/Sora/Sora_RigidSpinner.pth', 'weights/hololive-jp/Sora/added_IVF4947_Flat_nprobe_1_SoraTokino_v2_mbkm.index'],
  roboco: ['Roboco', 'weights/hololive-jp/Roboco/Roboco_Itaxhix.pth', 'weights/hololive-jp/Roboco/added_IVF1568_Flat_nprobe_1_Roboco_v2_mbkm.index'],
  sakuramiko: ['Sakura Miko', 'weights/hololive-jp/Miko/Miko_IshimaIshimsky.pth', 'weights/hololive-jp/Miko/added_IVF256_Flat_nprobe_1_sakura-miko-rmvpe-fix_v2.index'],
  hoshimachisuisei: ['Hoshimachi Suisei', 'weights/hololive-jp/Suisei/Suisei_Dacoolkid_MakiLigon.pth', 'weights/hololive-jp/Suisei/added_IVF3248_Flat_nprobe_1_mbkm.index'],
  azki: ['AZKi', 'weights/hololive-jp/AZKi/AZKi_KitLemonfoot.pth', 'weights/hololive-jp/AZKi/added_IVF3086_Flat_nprobe_1_AZKi_Hybrid_v2_mbkm.index'],
  yozoramel: ['Yozora Mel', 'weights/hololive-jp/Mel/Mel_Sui.pth', 'weights/hololive-jp/Mel/added_IVF2214_Flat_nprobe_1_Mel_v2_mbkm.index'],
  shirakamifubuki: ['Shirakami Fubuki', 'weights/hololive-jp/Fubuki/Fubuki_Acato.pth', 'weights/hololive-jp/Fubuki/added_IVF1895_Flat_nprobe_1_Shirakami_Fubuki_v2_mbkm.index'],
  haachama: ['Haachama', 'weights/hololive-jp/Haachama/Haachama_Dacoolkid.pth', 'weights/hololive-jp/Haachama/added_IVF4350_Flat_nprobe_1_mbkm.index'],
  akirosenthal: ['Aki Rosenthal', 'weights/hololive-jp/Aki/Aki_Yeey5.pth', 'weights/hololive-jp/Aki/added_IVF646_Flat_nprobe_1_AkiRosenthal_v2.index']
};

const pluginConfig = {
  name: 'holotts',
  alias: ['hololive', 'hololivetts', 'vnholo'],
  category: 'tts',
  description: 'TTS suara karakter Hololive via RVC Hugging Face',
  usage: '.holotts <karakter>|<teks>',
  example: '.holotts roboco|Hello Rimuru!',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 2,
  isEnabled: true
};

function generateSessionHash() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.randomBytes(11), byte => chars[byte % chars.length]).join('');
}

async function ttsHololive(text, key) {
  const model = hololiveModels[key];
  if (!model) throw new Error('Karakter tidak ditemukan.');
  const session_hash = generateSessionHash();
  const payload = {
    data: [model[0], model[1], model[2], '', null, text, 'English-Ana (Female)', 0, 'pm', 0.4, 1, 0, 1, 0.23],
    event_data: null,
    fn_index: 52,
    trigger_id: 711,
    session_hash
  };
  await axios.post(`${HF_BASE}/queue/join?__theme=system`, payload, { timeout: 20000, headers: { 'Content-Type': 'application/json' } });
  const response = await axios.get(`${HF_BASE}/queue/data?session_hash=${session_hash}`, { timeout: 120000, responseType: 'stream', headers: { Accept: 'text/event-stream' } });
  return new Promise((resolve, reject) => {
    let buffer = '';
    let settled = false;
    const finish = (err, url) => { if (settled) return; settled = true; err ? reject(err) : resolve(url); };
    response.data.on('data', chunk => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        try {
          const data = JSON.parse(line.slice(6));
          if (data.msg === 'process_completed') {
            const output = data.output?.data || [];
            const url = output.find(x => x?.url)?.url;
            if (url) {
              finish(null, url);
              response.data.destroy();
              return;
            }
          } else if (data.msg === 'process_failed') {
            finish(new Error('RVC Hugging Face gagal memproses suara.'));
            response.data.destroy();
            return;
          }
        } catch {}
      }
    });
    response.data.on('error', err => finish(err));
    response.data.on('end', () => finish(new Error('Audio tidak ditemukan.')));
  });
}

async function handler(m, { sock, text }) {
  if (!text?.trim()) {
    return m.reply(`❗ Format: .holotts <karakter>|<teks>\n\nKarakter tersedia:\n${Object.keys(hololiveModels).join(', ')}`);
  }
  const [rawKey, ...parts] = text.split('|');
  const key = rawKey.trim().toLowerCase();
  const input = parts.join('|').trim();
  if (!input) return m.reply('❗ Teks belum diisi. Gunakan format: .holotts <karakter>|<teks>');
  if (!hololiveModels[key]) return m.reply(`❌ Karakter tidak ditemukan.\n\nTersedia:\n${Object.keys(hololiveModels).join(', ')}`);
  try {
    await m.react?.('🎤');
    const audioUrl = await ttsHololive(input, key);
    await sock.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg', ptt: true }, { quoted: m });
  } catch (err) {
    console.error('[holotts]', err);
    await m.reply(`❌ Gagal membuat TTS: ${err.message}`);
  }
}

export { pluginConfig as config, handler };
