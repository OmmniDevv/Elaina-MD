/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
const config = {
    name: 'shzupload',
    alias: ['shz', 'uploadshz'],
    category: 'tools',
    description: 'Upload file ke shz.al',
    usage: '.shz <path file> atau reply gambar',
    example: '.shz ./images/avatar.jpg',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true
}

const BASE = "https://shz.al";
const DEFAULT_EXPIRE = "1d";

function parseExpireToSeconds(expire = "7d") {
  const text = String(expire).trim().toLowerCase();
  const match = text.match(/^(\d+(?:\.\d+)?)(s|m|h|d)?$/);

  if (!match) return 7 * 86400;

  const value = Number(match[1]);
  const unit = match[2] || "s";

  const seconds = {
    s: value,
    m: value * 60,
    h: value * 3600,
    d: value * 86400
  }[unit];

  return Math.min(Math.floor(seconds), 90 * 86400);
}

function secondsToExpire(seconds) {
  if (seconds % 86400 === 0) return `${seconds / 86400}d`;
  if (seconds % 3600 === 0) return `${seconds / 3600}h`;
  if (seconds % 60 === 0) return `${seconds / 60}m`;
  return `${seconds}s`;
}

function getNameFromUrl(url) {
  const parsed = new URL(url);
  return parsed.pathname.replace(/^\/+/, "");
}

function getNormalUrl(url) {
  const name = getNameFromUrl(url);
  return `${BASE}/d/${name}`;
}

async function uploadToShz(filePath, expire = DEFAULT_EXPIRE) {
  const resolvedPath = path.resolve(filePath);

  if (!fs.existsSync(resolvedPath)) {
    return {
      success: false,
      error: "File tidak ditemukan"
    };
  }

  const expireSeconds = parseExpireToSeconds(expire);
  const finalExpire = secondsToExpire(expireSeconds);

  const form = new FormData();
  form.append("c", fs.createReadStream(resolvedPath), {
    filename: path.basename(resolvedPath)
  });
  form.append("e", finalExpire);

  try {
    const response = await axios.post(BASE, form, {
      headers: {
        ...form.getHeaders(),
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
        "Accept": "*/*",
        "Origin": BASE,
        "Referer": `${BASE}/`
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      validateStatus: () => true
    });

    const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
    const rawUrl = data?.url || null;
    const normalUrl = rawUrl ? getNormalUrl(rawUrl) : null;

    return {
      success: Boolean(rawUrl),
      url: normalUrl,
      rawUrl: rawUrl,
      manageUrl: data?.manageUrl || null,
      expireAt: data?.expireAt || null,
      expire: finalExpire,
      statusCode: response.status
    };

  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

async function handler(m, { sock }) {
    try {
        const args = m.text.split(' ').slice(1);
        let filePath = args[0];
        let expire = DEFAULT_EXPIRE;
        let isFromQuoted = false;

        if (args[1] && args[1].match(/^\d+[smhd]$/)) {
            expire = args[1];
            filePath = args[0];
        }

        if (!filePath && m.quoted && m.quoted.message?.imageMessage) {
            await m.reply('⏳ Mengunduh gambar...');
            
            const media = await m.quoted.download();
            const tempDir = path.join(__dirname, '../../temp');
            
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            
            const tempPath = path.join(tempDir, `temp_${Date.now()}.jpg`);
            fs.writeFileSync(tempPath, media);
            filePath = tempPath;
            isFromQuoted = true;
        }

        if (!filePath) {
            return m.reply(`❌ CARA PAKAI\n\n.shz <path file> [expire]\n.shz ./file.jpg 7d\natau\nreply gambar lalu ketik .shz`);
        }

        await m.reply('⏳ Mengupload file ke shz.al...');

        const result = await uploadToShz(filePath, expire);

        if (isFromQuoted && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        if (result.success && result.url) {
            let replyText = `✅ BERHASIL UPLOAD\n\n📎 URL: ${result.url}\n⏰ Expire: ${result.expire}`;
            if (result.manageUrl) {
                replyText += `\n🔗 Manage: ${result.manageUrl}`;
            }
            if (result.expireAt) {
                replyText += `\n📅 Expire At: ${result.expireAt}`;
            }
            await m.reply(replyText);
        } else {
            await m.reply(`❌ GAGAL UPLOAD\n\n⚠️ Error: ${result.error || 'Unknown error'}`);
        }

    } catch (error) {
        console.error('Shz Upload Error:', error);
        await m.reply(`❌ ERROR\n\n${error.message}`);
    }
}
export { config, handler };