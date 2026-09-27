/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

export const config = {
  name: "shinigami",
  alias: ["shini", "shinigamisearch"],
  category: "search",
  description: "Mencari manga/manhwa di Shinigami",
  usage: ".shinigami <judul/genre>",
  example: ".shinigami solo leveling",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

const BASE_URL = "https://api.shngm.io";
const WEB_URL = "https://g.shinigami.asia";

function pickTaxonomy(taxonomy, key) {
  if (!taxonomy || !Array.isArray(taxonomy[key])) return [];
  return taxonomy[key].map(v => v.name).filter(Boolean);
}

export async function handler(m, { text, usedPrefix, prefix, command, sock, conn }) {
  const client = sock || conn;
  const pfx = usedPrefix || prefix || '/';

  if (!text) {
    return m.reply(`*Format salah!*\n\nContoh penggunaan:\n${pfx}${command} solo leveling`);
  }

  await m.react('⏳');

  try {
    const res = await axios.get(`${BASE_URL}/v1/manga/list`, {
      timeout: 30000,
      params: {
        page: 1,
        page_size: 5,
        q: text
      },
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

    const json = res.data;

    if (!json || typeof json !== "object" || !Array.isArray(json.data) || json.data.length === 0) {
      await m.react('❌');
      return m.reply(`❌ Komik dengan kata kunci "*${text}*" tidak ditemukan di Shinigami.`);
    }

    const items = json.data.slice(0, 5);

    let caption = `📚 *SHINIGAMI MANGA SEARCH*\n\n`;
    caption += `🔍 *Kata Kunci:* ${text}\n`;
    caption += `📊 *Total Hasil:* ${json.meta?.total_record || json.data.length}\n`;
    caption += `────────────────────────\n\n`;

    items.forEach((item, i) => {
      const genres = pickTaxonomy(item.taxonomy, "Genre").join(", ") || "-";
      const rating = item.user_rate ? `⭐ ${item.user_rate}` : "-";
      const chapter = item.latest_chapter_number ? `Ch. ${item.latest_chapter_number}` : "-";
      const url = item.manga_id ? `${WEB_URL}/series/${item.manga_id}` : "#";

      caption += `*${i + 1}. ${item.title}*\n`;
      if (item.alternative_title) caption += `Alternative: _${item.alternative_title}_\n`;
      caption += `⭐ *Rating:* ${rating} | 📖 *Latest:* ${chapter}\n`;
      caption += `🏷️ *Genre:* ${genres}\n`;
      caption += `🔗 *Link:* ${url}\n\n`;
    });

    const topManga = items[0];
    const coverUrl = topManga.cover_portrait_url || topManga.cover_image_url || null;

    if (coverUrl) {
      await client.sendMessage(m.chat, {
        image: { url: coverUrl },
        caption: caption.trim()
      }, { quoted: m });
    } else {
      await m.reply(caption.trim());
    }

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply('❌ Terjadi kesalahan saat mengambil data dari Shinigami.');
  }
}
