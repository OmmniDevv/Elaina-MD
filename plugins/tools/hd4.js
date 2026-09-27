/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import FormData from 'form-data';
import te from "../../src/lib/elaina-error.js"; 

const pluginConfig = {
  name: "hd4",
  alias: ["upscale4"],
  category: "tools",
  description: "Memperjelas resolusi gambar / dokumen foto (Upscale 4x)",
  usage: ".hd4 <reply/kirim gambar atau dokumen foto>",
  example: ".hd4",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15, 
  energi: 2,
  isEnabled: true,
};

function generateRandomIP() {
  const r = () => Math.floor(Math.random() * 254) + 1;
  return `${r()}.${r()}.${r()}.${r()}`;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function upscaleBuffer(imageBuffer, scale = "4") {
  const randomIp = generateRandomIP();
  const commonHeaders = {
    'Origin': 'https://imgupscaler.com',
    'Referer': 'https://imgupscaler.com/',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
    'X-Client-Ipv4': randomIp,
    'X-Forwarded-For': randomIp
  };

  try {
    const form = new FormData();
    form.append('tool', 'upscaler');
    form.append('mode', 'batch');
    form.append('scaleRadio', scale);
    
    form.append('file', imageBuffer, {
      filename: `image_${Date.now()}.jpg`,
      contentType: 'image/jpeg'
    });

    const uploadRes = await axios.post('https://imgupscaler.com/api/legacy/upload', form, {
      headers: {
        ...form.getHeaders(),
        ...commonHeaders
      }
    });

    const taskId = uploadRes.data?.taskId;
    if (!taskId) {
      return { status: false, message: 'Gagal mendapatkan taskId dari server imgupscaler.' };
    }

    let attempts = 0;
    const maxAttempts = 50; 

    while (attempts < maxAttempts) {
      attempts++;
      await sleep(2000); 

      const statusRes = await axios.post('https://imgupscaler.com/api/legacy/status', 
        {
          tool: 'upscaler',
          taskId: taskId,
          scaleRadio: scale
        }, 
        {
          headers: {
            'Content-Type': 'application/json',
            ...commonHeaders
          }
        }
      );

      const resData = statusRes.data;

      if (resData.status === 'success' && resData.downloadUrls && resData.downloadUrls.length > 0) {
        return {
          status: true,
          download_url: resData.downloadUrls[0]
        };
      }

      if (resData.status !== 'waiting') {
        return { status: false, message: 'Proses gagal di server (Mungkin gambar terlalu besar).' };
      }
    }

    return { status: false, message: 'Timeout: Proses upscale memakan waktu terlalu lama.' };

  } catch (error) {
    return {
      status: false,
      message: error.message
    };
  }
}

// Helper akurat untuk mendeteksi gambar biasa maupun dokumen foto
function checkImageMedia(msg) {
  if (!msg) return false;

  if (msg.isImage) return true;

  const type = msg.type || msg.mtype || msg.messageType || "";
  const rawMsg = msg.message || msg.msg || msg;
  const mimetype = msg.mimetype || rawMsg?.mimetype || rawMsg?.documentMessage?.mimetype || rawMsg?.imageMessage?.mimetype || "";

  const isStandardImage = type === "imageMessage" || mimetype.startsWith("image/");
  const isDocumentImage = (type === "documentMessage" || !!rawMsg?.documentMessage) && mimetype.startsWith("image/");

  return isStandardImage || isDocumentImage;
}

async function handler(m, { sock }) {
  const isDirectImage = checkImageMedia(m);
  const isQuotedImage = m.quoted ? checkImageMedia(m.quoted) : false;

  const hasImage = isDirectImage || isQuotedImage;
  
  if (!hasImage) {
    return m.reply(`❌ Kirim atau balas gambar/dokumen foto dengan perintah \`${m.prefix}${m.command}\``);
  }

  await m.react('⏳');
  await m.reply("⏳ Sedang memproses gambar, tunggu sekitar 15-30 detik ya...");

  try {
    let mediaBuffer;

    if (isQuotedImage) {
      mediaBuffer = await m.quoted.download().catch(async () => {
        return await sock.downloadMediaMessage(m.quoted);
      });
    } else {
      mediaBuffer = await m.download().catch(async () => {
        return await sock.downloadMediaMessage(m);
      });
    }

    if (!mediaBuffer) {
      await m.react('❌');
      return m.reply("❌ Gagal mengunduh berkas media.");
    }
    
    const result = await upscaleBuffer(mediaBuffer, "4");

    if (!result.status) {
      await m.react('❌');
      return m.reply(`❌ *Gagal:* ${result.message}`);
    }

    await sock.sendMessage(m.chat, { 
      image: { url: result.download_url }, 
      caption: `✨ *U P S C A L E - S U C C E S S*\n\n> Gambar berhasil diperjelas (4x).`
    }, { quoted: m });

    await m.react('✅');
    
  } catch (error) {
    console.error("[Upscale Error]", error);
    await m.react('☢');
    if (typeof te === "function") {
      m.reply(te(m.prefix, m.command, m.pushName));
    } else {
      m.reply("Terjadi kesalahan sistem saat mencoba memperjelas gambar.");
    }
  }
}

export { pluginConfig as config, handler };
