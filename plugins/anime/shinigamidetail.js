/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";

const pluginConfig = {
    name: 'shinigamidetail',
    alias: ['shngm', 'detailmanga', 'komikshinigami', 'shinigami'],
    category: 'anime',
    description: 'Melihat detail manga dan daftar 24 chapter terbaru dari Shinigami',
    usage: '.shinigamidetail <url/manga_id>',
    example: '.shinigamidetail https://g.shinigami.asia/series/fc727dec-d1f5-43e8-a77d-37382f636659',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
};

const BASE_URL = "https://api.shngm.io";
const WEB_URL = "https://g.shinigami.asia";
const PAGE = 1;
const PAGE_SIZE = 24;
const SORT_BY = "chapter_number";
const SORT_ORDER = "desc";
const TIMEOUT = 30000;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:151.0) Gecko/20100101 Firefox/151.0",
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": `${WEB_URL}/`,
    "Origin": WEB_URL,
    "Content-Type": "application/json"
  },
  validateStatus: () => true
});

function getUuid(input) {
  const text = String(input || "").trim();
  const uuid = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return uuid ? uuid[0] : null;
}

function makeSlug(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pickTaxonomy(taxonomy, key) {
  if (!taxonomy || !Array.isArray(taxonomy[key])) return [];
  return taxonomy[key].map(v => v.name).filter(Boolean);
}

function makeSeriesUrl(mangaId) {
  return mangaId ? `${WEB_URL}/series/${mangaId}` : null;
}

function makeChapterUrl(chapterId) {
  return chapterId ? `${WEB_URL}/chapter/${chapterId}` : null;
}

function makeChapterName(item) {
  const number = item.chapter_number ?? null;
  const title = String(item.chapter_title || "").trim();

  if (number && title) return `Chapter ${number} - ${title}`;
  if (number) return `Chapter ${number}`;
  if (title) return title;

  return null;
}

function formatDetail(item) {
  return {
    Title: item.title || null,
    Slug: makeSlug(item.title) || null,
    Url: makeSeriesUrl(item.manga_id),
    Manga_id: item.manga_id || null,
    Alternative_title: item.alternative_title || null,
    Description: item.description || null,
    Release_year: item.release_year || null,
    Country: item.country_id || null,
    Status: item.status ?? null,
    Rating: item.user_rate ?? null,
    View_count: item.view_count ?? null,
    Bookmark_count: item.bookmark_count ?? null,
    Cover: item.cover_image_url || null,
    Cover_portrait: item.cover_portrait_url || null,
    Author: pickTaxonomy(item.taxonomy, "Author"),
    Artist: pickTaxonomy(item.taxonomy, "Artist"),
    Format: pickTaxonomy(item.taxonomy, "Format"),
    Genre: pickTaxonomy(item.taxonomy, "Genre"),
    Type: pickTaxonomy(item.taxonomy, "Type"),
    Latest_chapter: {
      Number: item.latest_chapter_number ?? null,
      Id: item.latest_chapter_id || null,
      Url: makeChapterUrl(item.latest_chapter_id),
      Time: item.latest_chapter_time || null
    },
    Updated_at: item.updated_at || null
  };
}

function formatChapter(item) {
  return {
    Title: makeChapterName(item),
    Chapter_number: item.chapter_number ?? null,
    Chapter_title: item.chapter_title || null,
    Chapter_id: item.chapter_id || null,
    Url: makeChapterUrl(item.chapter_id),
    Thumbnail: item.thumbnail_image_url || null,
    View_count: item.view_count ?? null,
    Release_date: item.release_date || null
  };
}

async function getMangaDetail(mangaId) {
  const res = await client.get(`/v1/manga/detail/${mangaId}`);
  return { code: res.status, json: res.data };
}

async function getChapterList(mangaId) {
  const res = await client.get(`/v1/chapter/${mangaId}/list`, {
    params: {
      page: PAGE,
      page_size: PAGE_SIZE,
      sort_by: SORT_BY,
      sort_order: SORT_ORDER
    }
  });
  return { code: res.status, json: res.data };
}

async function handler(m, { usedPrefix, prefix, command, sock, conn, args, text }) {
  const clientBot = sock || conn;
  const pfx = usedPrefix || prefix || '/';
  const input = text || (args ? args.join(' ') : '');

  if (!input) {
    return await m.reply(
      `*Format Salah!*\n\n` +
      `📌 *Cara Penggunaan:*\n` +
      `Ketik \`${pfx}${command} <URL Series / Manga ID>\`\n\n` +
      `💡 *Contoh:*\n` +
      `\`${pfx}${command} https://g.shinigami.asia/series/fc727dec-d1f5-43e8-a77d-37382f636659\``
    );
  }

  const mangaId = getUuid(input);

  if (!mangaId) {
    return await m.reply(`❌ *Manga ID / UUID tidak ditemukan dari input URL.*`);
  }

  if (typeof m.react === 'function') await m.react('⏳');

  try {
    const detail = await getMangaDetail(mangaId);

    if (!detail.json || typeof detail.json !== "object" || detail.json.retcode !== 0) {
      throw new Error(detail.json?.message || "Gagal mengambil data detail komik.");
    }

    const chapters = await getChapterList(mangaId);

    if (!chapters.json || typeof chapters.json !== "object" || chapters.json.retcode !== 0) {
      throw new Error(chapters.json?.message || "Gagal mengambil daftar chapter.");
    }

    const formattedDetail = formatDetail(detail.json.data);
    const chapterResult = Array.isArray(chapters.json.data)
      ? chapters.json.data.map(formatChapter)
      : [];

    let caption = `📚 *${(formattedDetail.Title || "UNTITLED").toUpperCase()}*\n`;
    if (formattedDetail.Alternative_title) caption += `Alternative: _${formattedDetail.Alternative_title}_\n`;
    caption += `────────────────────────────\n`;
    caption += `⭐ *Rating:* ${formattedDetail.Rating || '-'}/10\n`;
    caption += `🏷️ *Genre:* ${formattedDetail.Genre.length ? formattedDetail.Genre.join(", ") : '-'}\n`;
    caption += `👤 *Author:* ${formattedDetail.Author.length ? formattedDetail.Author.join(", ") : '-'}\n`;
    caption += `🎨 *Artist:* ${formattedDetail.Artist.length ? formattedDetail.Artist.join(", ") : '-'}\n`;
    caption += `📌 *Type / Format:* ${formattedDetail.Type.join(", ") || '-'} / ${formattedDetail.Format.join(", ") || '-'}\n`;
    caption += `STATUS: *${formattedDetail.Status || '-'}* | Rilis: *${formattedDetail.Release_year || '-'}*\n`;
    caption += `👁️ *Views:* ${formattedDetail.View_count || 0} | 🔖 *Bookmarks:* ${formattedDetail.Bookmark_count || 0}\n\n`;

    if (formattedDetail.Description) {
      const cleanDesc = formattedDetail.Description.replace(/<[^>]*>?/gm, '');
      caption += `📝 *Deskripsi:*\n${cleanDesc.length > 300 ? cleanDesc.slice(0, 300) + '...' : cleanDesc}\n\n`;
    }

    caption += `📋 *${chapterResult.length} Chapter Terbaru:*\n`;
    if (chapterResult.length > 0) {
      chapterResult.forEach(ch => {
        caption += `• *${ch.Title}*\n  🔗 ${ch.Url}\n`;
      });
    } else {
      caption += `_Belum ada chapter_\n`;
    }

    caption += `\n🔗 *Link Series:* ${formattedDetail.Url}`;

    const coverUrl = formattedDetail.Cover || formattedDetail.Cover_portrait;

    if (coverUrl) {
      const imgRes = await axios.get(coverUrl, { responseType: 'arraybuffer' });
      const imgBuffer = Buffer.from(imgRes.data);

      await clientBot.sendMessage(
        m.chat,
        {
          image: imgBuffer,
          caption: caption
        },
        { quoted: m }
      );
    } else {
      await clientBot.sendMessage(
        m.chat,
        { text: caption },
        { quoted: m }
      );
    }

    if (typeof m.react === 'function') await m.react('✅');

  } catch (error) {
    console.error('Shinigamidetail Plugin Error:', error);
    if (typeof m.react === 'function') await m.react('❌');
    await m.reply('❌ *GAGAL*\n\n> ' + (error.message || String(error)));
  }
}

export { pluginConfig as config, handler };
