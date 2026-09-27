/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/*
Base : https://www.grammarly.com/ai-detector
By : ZennzXD
Created : 24 April 2026
*/

import axios from "axios";

const pluginConfig = {
    name: 'grammarly',
    alias: ['aidetector', 'checkai', 'grammarlyai'],
    category: 'tools',
    description: 'Mengecek persentase teks AI menggunakan Grammarly AI Detector',
    usage: '.grammarly <teks yang ingin dicek>',
    example: '.grammarly Hello world, this is a test text to check AI score.',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
};

const headers = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
  'Accept': 'application/json',
  'sec-ch-ua': '"Chromium";v="139", "Not;A=Brand";v="99"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'origin': 'https://www.grammarly.com',
  'sec-fetch-site': 'same-site',
  'sec-fetch-mode': 'cors',
  'sec-fetch-dest': 'empty',
  'referer': 'https://www.grammarly.com/ai-detector',
  'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
};

function getkukis(cookies, name) {
  for (const c of cookies) {
    const m = c.match(new RegExp(`${name}=([^;]+)`));
    if (m) return m[1];
  }
  return null;
}

async function grammarly(text) {
  const init = await axios.get('https://www.grammarly.com/ai-detector', {
    headers: {
      ...headers,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });

  const cookies = init.headers['set-cookie'] || [];
  const cookieStr = cookies.map(c => c.split(';')[0]).join('; ');

  let csrf = getkukis(cookies, 'csrf-token');
  let cid = getkukis(cookies, 'gnar_containerId');

  if (!csrf) {
    const m = init.data.match(/csrf-token=([^;"]+)/i) || init.data.match(/"csrfToken"\s*:\s*"([^"]+)"/i);
    csrf = m ? m[1] : 'AABQV0SGvO2j24WfoaiRRgODXro8Re2Elt/1wg';
  }

  if (!cid) {
    const m = init.data.match(/gnar_containerId=([^;"]+)/i) || init.data.match(/"containerId"\s*:\s*"([^"]+)"/i);
    cid = m ? m[1] : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }

  const finalkukis = `csrf-token=${csrf}; gnar_containerId=${cid}; browser_info=CHROME:139:MOBILE:SUPPORTED:NONFREEMIUM:ANDROID1:ANDROID; currentLocale=en-US; ${cookieStr}`;

  // Diperbaiki agar tidak dianggap URL oleh Axios
  const res = await axios.post('https://capi.grammarly.com/api/check/aidetector', text, {
    headers: {
      ...headers,
      'Content-Type': 'text/plain',
      'x-csrf-token': csrf,
      'x-client-version': '1.0.14396',
      'x-client-type': 'cms',
      'x-container-id': cid,
      'Cookie': finalkukis
    },
    transformRequest: [function (data) {
      return data;
    }]
  });

  return res.data;
}

async function handler(m, { usedPrefix, prefix, command, text, sock, conn }) {
  const clientBot = sock || conn;

  if (!text || text.trim().length === 0) {
    if (typeof m.react === 'function') await m.react('❌');
    let warning = `❌ *Format Perintah Salah!*\n\n`;
    warning += `Silakan masukkan teks yang ingin dianalisis skor AI-nya.\n\n`;
    warning += `📌 *Contoh Penggunaan:*\n`;
    warning += `> \`${prefix}${command} Halo, tuliskan artikel tentang teknologi kecerdasan buatan...\``;
    return await m.reply(warning);
  }

  if (typeof m.react === 'function') await m.react('⏳');

  try {
    const result = await grammarly(text.trim());

    let caption = `🤖 *GRAMMARLY AI DETECTOR*\n────────────────────────────\n`;
    caption += `📊 *Score AI:* ${result.score !== undefined ? result.score + '%' : 'Tidak diketahui'}\n`;
    caption += `📌 *Kategori:* ${result.categoryHuman || 'AI-Detector score'}\n`;
    caption += `👤 *Script by:* ZennzXD\n`;
    caption += `────────────────────────────`;

    await clientBot.sendMessage(
      m.chat,
      { text: caption },
      { quoted: m }
    );

    if (typeof m.react === 'function') await m.react('✅');

  } catch (error) {
    console.error('Grammarly AI Error:', error);
    if (typeof m.react === 'function') await m.react('❌');
    await m.reply('❌ *GAGAL MENGECEK TEKS*\n\n> ' + (error.message || String(error)));
  }
}

export { pluginConfig as config, handler };
