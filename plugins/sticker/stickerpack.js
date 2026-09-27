/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import _sharp from 'sharp'
import axios from "axios";
import * as cheerio from "cheerio";
import config from "../../config.js";

function getSharp() {

  return _sharp;
}
import te from "../../src/lib/elaina-error.js";
import { addExifToWebp } from "../../src/lib/elaina-exif.js";

const pluginConfig = {
  name: "stickerpack",
  alias: ["sp", "stickersearch", "searchsticker"],
  category: "sticker",
  description: "Cari dan kirim sticker pack",
  usage: ".stickerpack <query>",
  example: ".stickerpack anime",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 20,
  energi: 2,
  isEnabled: true,
};

class StickerAPI {
  async search(query, page = 1) {
    if (!query) throw new Error("Query kosong");

    // Primary endpoint (kept for compatibility with the old implementation).
    try {
      const res = await axios.post(
        "https://getstickerpack.com/api/v1/stickerdb/search",
        { query, page },
        { timeout: 15000, headers: { "User-Agent": "Mozilla/5.0" } },
      );
      const body = res.data || {};
      const raw = Array.isArray(body.data) ? body.data : [];
      const data = raw.map((item) => ({
        name: item.title || item.name,
        slug: item.slug,
        url: `https://getstickerpack.com/stickers/${item.slug}`,
        image: item.cover_image || item.tray_icon_large
          ? `https://s3.getstickerpack.com/${item.cover_image || item.tray_icon_large}`
          : null,
        download: item.download_counter || 0,
      })).filter((x) => x.slug);
      if (data.length) return { status: true, data, total: body.meta?.total || data.length };
    } catch {}

    // Fallback to the current public Sticker Maker page when the old API is unavailable.
    try {
      const url = `https://getstickerpack.com/stickers?page=${Math.max(1, page)}&query=${encodeURIComponent(query)}`;
      const { data: html } = await axios.get(url, {
        timeout: 20000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/131 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
      });
      const $ = cheerio.load(html);
      const data = [];
      const seen = new Set();
      $("a[href^='/stickers/']").each((_, el) => {
        const href = $(el).attr("href") || "";
        const slug = href.split("/stickers/")[1]?.split("?")[0]?.replace(/^\/+|\/+$/g, "");
        if (!slug || slug.includes("page=") || seen.has(slug)) return;
        const name = $(el).text().replace(/\s+/g, " ").trim();
        if (!name) return;
        seen.add(slug);
        data.push({
          name,
          slug,
          url: `https://getstickerpack.com/stickers/${slug}`,
          image: null,
          download: 0,
        });
      });
      return { status: true, data: data.slice(0, 10), total: data.length };
    } catch (e) {
      return { status: false, msg: e.message };
    }
  }

  async detail(slug) {
    const match = String(slug).match(/stickers\/([a-zA-Z0-9-]+)$/);
    const id = match ? match[1] : String(slug).replace(/^\/+|\/+$/g, "");

    try {
      const res = await axios
        .get(`https://getstickerpack.com/api/v1/stickerdb/stickers/${id}`, { timeout: 15000 })
        .then((r) => r.data.data);
      const stickers = (res.images || []).map((item) => ({
        index: item.sticker_index,
        image: `https://s3.getstickerpack.com/${item.url}`,
        animated: item.is_animated !== 0,
      })).filter((x) => x.image);
      if (stickers.length) return { status: true, title: res.title, stickers };
    } catch {}

    // Current public page fallback.
    try {
      const { data: html } = await axios.get(`https://getstickerpack.com/stickers/${id}`, {
        timeout: 20000,
        headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/131 Safari/537.36" },
      });
      const $ = cheerio.load(html);
      const stickers = [];
      $("img").each((_, el) => {
        const alt = ($(el).attr("alt") || "").toLowerCase();
        if (!alt.includes("sticker image")) return;
        const image = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-lazy-src");
        if (image && /^https?:\/\//i.test(image)) stickers.push({
          index: stickers.length + 1,
          image,
          animated: /\.(gif|webp)(?:\?|$)/i.test(image),
        });
      });
      const title = $("h1").first().text().replace(/\s+/g, " ").trim() || id;
      return { status: true, title, stickers };
    } catch (e) {
      return { status: false, msg: e.message };
    }
  }
}

const MAX_STICKERS = 20;
const DOWNLOAD_DELAY = 700;

async function downloadBuffer(url) {
  const res = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 15000,
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  return Buffer.from(res.data);
}

async function toWebpSticker(buffer) {
  return (await getSharp())(buffer)
    .resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 80 })
    .toBuffer();
}

async function handler(m, { sock }) {
  const query = m.args?.join(" ")?.trim();

  if (!query) {
    return m.reply(
      `── .✦ 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗣𝗔𝗖𝗞 ✦. ── 𝜗ৎ\n\n` +
        `Cari dan kirim sticker pack!\n\n` +
        `╭─〔 Cara Pakai 〕───⬣\n` +
        `│  ✦ ${m.prefix}stickerpack <query>\n` +
        `╰──────────────⬣\n\n` +
        `*${m.prefix}stickerpack anime*\n` +
        `*${m.prefix}stickerpack cat*\n\n` +
        `.☘︎ ݁˖`,
    );
  }

  await m.react("🕕");

  try {
    const api = new StickerAPI();
    const search = await api.search(query);

    if (!search.status || !search.data?.length) {
      await m.react("✘");
      return m.reply(
        `── .✦ ──\n\n> Tidak ada sticker pack untuk: *${query}* .☘︎ ݁˖`,
      );
    }

    const randPick =
      search.data[Math.floor(Math.random() * search.data.length)];
    const detail = await api.detail(randPick.url);

    if (!detail.status || !detail.stickers?.length) {
      await m.react("✘");
      return m.reply(`── .✦ ──\n\n> Gagal mengambil detail sticker pack .☘︎ ݁˖`);
    }

    await m.reply(
      `── .✦ ──\n\n> Mengunduh *${randPick.name}*\n> ${Math.min(detail.stickers.length, MAX_STICKERS)} sticker .☘︎ ݁˖`,
    );

    const limited = detail.stickers.slice(0, MAX_STICKERS);
    const stickerBuffers = [];

    for (const s of limited) {
      try {
        const buf = await downloadBuffer(s.image);
        const webp = await toWebpSticker(buf);
        stickerBuffers.push(webp);
        await new Promise((r) => setTimeout(r, DOWNLOAD_DELAY));
      } catch {
        continue;
      }
    }

    if (!stickerBuffers.length) {
      await m.react("✘");
      return m.reply(`── .✦ ──\n\n> Gagal mendownload sticker .☘︎ ݁˖`);
    }

    const packname = randPick.name || config.sticker?.packname || "Rimuru-AI";
    const author = config.bot?.developer || config.sticker?.author || "Bot";

    try {
      await sock.sendStickerPack(m.chat, stickerBuffers, m, {
        name: packname,
        packname,
        publisher: author,
        author,
        description: `Sticker pack: ${packname}`,
        emojis: ["❤"],
      });
      await m.react("✓");
    } catch (packErr) {
      console.error("[StickerPack] Pack send failed:", packErr.message);
      await m.reply(
        `── .✦ ──\n\n> Pack gagal, mengirim satu per satu... .☘︎ ݁˖`,
      );

      let sent = 0;
      for (const buf of stickerBuffers) {
        try {
          let exifBuf = buf;
          try {
            exifBuf = await addExifToWebp(buf, {
              packname,
              author,
              emojis: ["❤"],
            });
          } catch {}
          await sock.sendMessage(
            m.chat,
            {
              sticker: exifBuf,
              contextInfo: { isForwarded: true, forwardingScore: 1 },
            },
            { quoted: m },
          );
          sent++;
          await new Promise((r) => setTimeout(r, 500));
        } catch {
          continue;
        }
      }

      if (sent > 0) {
        await m.react("✓");
        await m.reply(
          `── .✦ ──\n\n> Berhasil kirim *${sent}* sticker dari *${packname}* .☘︎ ݁˖`,
        );
      } else {
        await m.react("✘");
        await m.reply(`── .✦ ──\n\n> Gagal mengirim sticker .☘︎ ݁˖`);
      }
    }
  } catch (error) {
    console.error("[StickerPack] Error:", error.message);
    await m.react("✘");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
