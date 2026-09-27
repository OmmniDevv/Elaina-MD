/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import crypto from 'node:crypto';
const config = {
    name: 'quillbotai',
    alias: ['qai', 'aiimg', 'quillimg'],
    category: 'ai',
    description: 'Generate image dengan Quillbot AI',
    usage: '.qai <prompt>',
    example: '.qai kucing lucu',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 5,
    isEnabled: true
}

const BASE = "https://quillbot.com";
const CATEGORY = "Auto";
const ASPECT_RATIO = "1:1";
const PROMPT_ID = "image/generate-image";

const jar = new CookieJar();

const client = wrapper(axios.create({
  jar,
  withCredentials: true,
  decompress: true,
  validateStatus: () => true,
  timeout: 120000
}));

const UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";

function uuid() {
  return crypto.randomUUID();
}

function hex(bytes) {
  return crypto.randomBytes(bytes).toString("hex");
}

async function setCookie(name, value) {
  await jar.setCookie(`${name}=${value}; Path=/; Domain=quillbot.com; Secure; SameSite=None`, BASE);
}

async function initCookies() {
  await setCookie("qbDeviceId", uuid());
  await setCookie("ajs_anonymous_id", uuid());
  await setCookie("anonID", hex(8));
  await setCookie("authenticated", "false");
  await setCookie("premium", "false");
  await setCookie("acceptedPremiumModesTnc", "false");
  await setCookie("qdid", hex(16));
}

function sentryHeaders() {
  const traceId = hex(16);
  const spanId = hex(8);
  const sampleRand = Math.random();

  return {
    "baggage": `sentry-environment=prod,sentry-release=v42.51.6,sentry-public_key=5743ef12f4887fc460c7968ebb2de54d,sentry-trace_id=${traceId},sentry-sampled=false,sentry-sample_rand=${sampleRand},sentry-sample_rate=0.01`,
    "sentry-trace": `${traceId}-${spanId}-0`
  };
}

async function warmup() {
  await client.get(BASE, {
    headers: {
      "sec-ch-ua": `"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"`,
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": `"Android"`,
      "upgrade-insecure-requests": "1",
      "user-agent": UA,
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "sec-fetch-site": "none",
      "sec-fetch-mode": "navigate",
      "sec-fetch-user": "?1",
      "sec-fetch-dest": "document",
      "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
    }
  });
}

async function generateImage(prompt) {
  await initCookies();
  await warmup();

  const res = await client.post(`${BASE}/api/raven/generate/image`, {
    prompt: prompt,
    category: CATEGORY,
    aspectRatio: ASPECT_RATIO,
    promptId: PROMPT_ID
  }, {
    headers: {
      "sec-ch-ua-platform": `"Android"`,
      "platform-type": "webapp",
      "qb-product": "IMAGE-GENERATOR",
      "sec-ch-ua": `"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"`,
      "sec-ch-ua-mobile": "?1",
      "useridtoken": "empty-token",
      "user-agent": UA,
      "accept": "application/json, text/plain, */*",
      "webapp-version": "42.51.6",
      "content-type": "application/json",
      "origin": BASE,
      "sec-fetch-site": "same-origin",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
      "referer": `${BASE}/ai-image-generator/i/${uuid()}`,
      "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
      ...sentryHeaders()
    }
  });

  const urls = (res.data?.data?.images || [])
    .map(v => v.downloadUrl)
    .filter(Boolean);

  return {
    success: res.status >= 200 && res.status < 300 && urls.length > 0,
    statusCode: res.status,
    urls: urls
  };
}

async function handler(m, { sock }) {
  try {
    const prompt = m.text?.trim();
    
    if (!prompt) {
      return m.reply(`🎨 *Qᴜɪʟʟʙᴏᴛ AI Iᴍᴀɢᴇ Gᴇɴᴇʀᴀᴛᴏʀ*\n\n> Masukkan prompt untuk generate gambar!\n\n> Contoh: .qai kucing lucu pakai topi`);
    }

    await m.reply('⏳ *Sedang generate gambar...*\n> Mohon tunggu sekitar 30 detik');

    const result = await generateImage(prompt);

    if (result.success && result.urls.length > 0) {
      const url = result.urls[0];
      
      await sock.sendMessage(m.chat, {
        image: { url: url },
        caption: `🎨 *Qᴜɪʟʟʙᴏᴛ AI*\n\n📝 Prompt: *${prompt}*\n🔗 URL: ${url}`
      });
    } else {
      await m.reply(`❌ *GAGAL GENERATE GAMBAR*\n\n⚠️ Error: ${result.statusCode}\n> Coba lagi nanti atau ganti prompt.`);
    }

  } catch (error) {
    console.error('Quillbot AI Error:', error);
    await m.reply(`❌ *ERROR*\n\n${error.message}`);
  }
}
export { config, handler };