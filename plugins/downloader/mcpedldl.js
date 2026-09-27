/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import path from 'node:path';

export const config = {
  name: "mcpedldl",
  alias: ["dlmcpedl", "mcpedldownload", "mcdl"],
  category: "downloader",
  description: "Mengunduh file atau mengambil detail dari MCPEDL",
  usage: ".mcpedldl <url/slug>",
  example: ".mcpedldl lunac-shaders",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

const DESCRIPTION_LIMIT = 500;
const UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";

const api = axios.create({
  baseURL: "https://api.mcpedl.com",
  timeout: 30000,
  validateStatus: () => true,
  headers: {
    "user-agent": UA,
    "accept": "application/json",
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "origin": "https://mcpedl.com",
    "referer": "https://mcpedl.com/"
  }
});

function getSlug(input) {
  const raw = String(input || "").trim();
  try {
    const u = new URL(raw);
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[0] || raw;
  } catch {
    return raw
      .replace(/^https?:\/\/(?:www\.)?mcpedl\.com\//i, "")
      .replace(/^\/+/, "")
      .replace(/\/+$/, "")
      .trim();
  }
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
}

function cleanText(value) {
  return decodeHtml(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function limitText(value, limit = DESCRIPTION_LIMIT) {
  const text = cleanText(value);
  if (!limit || text.length <= limit) return text;
  return text.slice(0, limit).trim() + "...";
}

function normalizeUrl(url) {
  const text = decodeHtml(String(url || "").trim());
  try {
    return new URL(text, "https://mcpedl.com").toString();
  } catch {
    return null;
  }
}

function extractRemoteUrl(url) {
  const normalized = normalizeUrl(url);
  if (!normalized) return null;
  try {
    const u = new URL(normalized);
    const remote = u.searchParams.get("remoteUrl");
    if (remote) return decodeURIComponent(remote);
    return normalized;
  } catch {
    return normalized;
  }
}

function getFileNameFromUrl(url) {
  try {
    const u = new URL(url);
    const name = decodeURIComponent(path.basename(u.pathname));
    return name || "download.bin";
  } catch {
    return "download.bin";
  }
}

function isDirectFile(url) {
  return /\.(mcpack|mcaddon|mcworld|zip|rar|7z|png|jpg|jpeg|webp|gif|apk|json|txt)(\?|#|$)/i.test(url || "");
}

function getLinksFromHtml(html) {
  const links = [];
  const text = String(html || "");
  const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const href = match[1];
    const label = cleanText(match[2]);
    const url = extractRemoteUrl(href);

    if (!url) continue;

    links.push({
      Name: label || getFileNameFromUrl(url),
      Url: url,
      Direct: isDirectFile(url)
    });
  }

  return links;
}

function uniqueLinks(items) {
  const map = new Map();
  for (const item of items) {
    if (!item?.Url) continue;
    if (!map.has(item.Url)) map.set(item.Url, item);
  }
  return [...map.values()];
}

function buildDownloads(data) {
  const d = data || {};
  const apiDownloads = Array.isArray(d.downloads) ? d.downloads.map(x => {
    const url = x.file || x.url || x.download_url || null;
    return {
      Name: x.display_name || x.name || getFileNameFromUrl(url),
      Url: url,
      Direct: isDirectFile(url)
    };
  }).filter(x => x.Url) : [];

  const htmlDownloads = getLinksFromHtml(d.description).filter(x => {
    const lower = `${x.Name} ${x.Url}`.toLowerCase();
    return lower.includes("download") || 
           lower.includes(".mcpack") || 
           lower.includes(".mcaddon") || 
           lower.includes(".mcworld") || 
           lower.includes(".zip") ||
           lower.includes("linkvertise") ||
           lower.includes("lootlinks");
  });

  const all = uniqueLinks([...apiDownloads, ...htmlDownloads]);
  return {
    All: all,
    Direct: all.filter(x => x.Direct),
    External: all.filter(x => !x.Direct)
  };
}

function pickMainDownload(downloads) {
  const direct = Array.isArray(downloads?.Direct) ? downloads.Direct : [];
  if (!direct.length) return null;
  return direct[0];
}

export async function handler(m, { text, usedPrefix, prefix, command, sock, conn }) {
  const client = sock || conn;
  const pfx = usedPrefix || prefix || '/';

  if (!text) {
    return m.reply(`*Format salah!*\n\nContoh penggunaan:\n${pfx}${command} lunac-shaders\natau\n${pfx}${command} https://mcpedl.com/lunac-shaders/`);
  }

  await m.react('⏳');
  const slug = getSlug(text);

  try {
    const res = await api.get(`/api/route/slug/${encodeURIComponent(slug)}`);

    if (res.status < 200 || res.status >= 300 || !res.data?.data) {
      await m.react('❌');
      return m.reply(`❌ Konten MCPEDL dengan slug "*${slug}*" tidak ditemukan.`);
    }

    const d = res.data.data;
    const downloads = buildDownloads(d);
    const mainDownload = pickMainDownload(downloads);

    let caption = `📦 *MCPEDL DOWNLOADER*\n\n`;
    caption += `📌 *Judul:* ${d.title || '-'}\n`;
    caption += `👤 *Pembuat:* ${d.username || d.user?.display_name || '-'}\n`;
    caption += `⭐ *Rating:* ${d.average_rating || '-'}\n`;
    caption += `📅 *Rilis:* ${d.publish_date || '-'}\n\n`;
    caption += `📝 *Deskripsi:* \n${limitText(d.short_description || d.description, 300)}\n\n`;

    if (downloads.External.length > 0) {
      caption += `🔗 *Link External:* \n`;
      downloads.External.forEach((link, idx) => {
        caption += `${idx + 1}. ${link.Name}: ${link.Url}\n`;
      });
      caption += `\n`;
    }

    const imageUrl = d.image ? (d.image.startsWith('http') ? d.image : `https://mcpedl.com${d.image}`) : null;

    if (imageUrl) {
      await client.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: caption
      }, { quoted: m });
    } else {
      await m.reply(caption);
    }

    // Jika ada file Direct, unduh dan kirimkan dokumen
    if (mainDownload && mainDownload.Url) {
      await m.reply(`⬇️ *Mengunduh file utama:* ${mainDownload.Name}...`);

      const fileName = mainDownload.Name || getFileNameFromUrl(mainDownload.Url);

      await client.sendMessage(m.chat, {
        document: { url: mainDownload.Url },
        fileName: fileName,
        mimetype: 'application/octet-stream',
        caption: `✅ *File Berhasil Diunduh!*`
      }, { quoted: m });
    }

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply('❌ Terjadi kesalahan saat memproses data MCPEDL.');
  }
}
