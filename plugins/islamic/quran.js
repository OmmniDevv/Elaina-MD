/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import * as cheerio from 'cheerio'
import config from "../../config.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "quran",
  alias: ["surah", "alquran", "bacaquran"],
  category: "islamic",
  description: "Baca ayat Al-Quran berdasarkan nama surah",
  usage: ".quran <nama surah>",
  example: ".quran al fatihah",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function quran(query) {
  const load = typeof cheerio.load === "function" ? cheerio.load : cheerio;

  const slug = query.toLowerCase().replace(/\s+/g, "-");
  const url = `https://quran.nu.or.id/${slug}`;

  const res = await fetch(url);
  const html = await res.text();

  const $ = load(html);

  const title = $("h1").first().text().trim();
  const info = $("h1").next("span").text().trim();

  const hasil = [];

  $("div[id]").each((i, el) => {
    const id = $(el).attr("id");

    if (!/^\d+$/.test(id)) return;

    const arab = $(el).find('[dir="rtl"]').first().text().trim();
    const latin = $(el).find(".text-primary-500").first().text().trim();
    const arti = $(el).find(".text-neutral-700").first().text().trim();

    if (arab && latin && arti) {
      hasil.push({
        ayat: Number(id),
        arab,
        latin,
        arti,
      });
    }
  });

  return {
    surah: title,
    info,
    total_ayat: hasil.length,
    ayat: hasil,
  };
}

async function handler(m, { sock }) {
  const query = m.args?.join(" ")?.trim();

  if (!query) {
    return m.reply(
      `📖 *QURAN*\n\n` +
        `> Masukkan nama surah\n\n` +
        `\`Contoh: ${m.prefix}quran al fatihah\`\n` +
        `\`Contoh: ${m.prefix}quran al baqarah\``,
    );
  }

  m.react("🔍");

  try {
    const data = await quran(query);

    if (!data.ayat?.length) {
      m.react("❌");
      return m.reply(`❌ Surah *${query}* tidak ditemukan`);
    }

    let teks = `📖 *${data.surah}*\n${data.info}\n\n`;
    for (const i of data.ayat) {
      teks += `${i.arab}\n${i.latin}\n_${i.arti}_\n\n`;
    }

    m.react("✅");

    const trimmed = teks.trim();
    if (trimmed.length > 60000) {
      const chunks = [];
      let current = "";
      for (const ayat of data.ayat) {
        const block = `${ayat.arab}\n${ayat.latin}\n_${ayat.arti}_\n\n`;
        if ((current + block).length > 60000) {
          chunks.push(current.trim());
          current = "";
        }
        current += block;
      }
      if (current.trim()) chunks.push(current.trim());

      for (let i = 0; i < chunks.length; i++) {
        const prefix = i === 0 ? `📖 *${data.surah}*\n${data.info}\n\n` : "";
        await m.reply(prefix + chunks[i]);
      }
    } else {
      await m.reply(trimmed);
    }
  } catch (e) {
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
