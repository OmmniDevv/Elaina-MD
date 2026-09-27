/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import {
  prepareWAMessageMedia,
  generateWAMessageFromContent,
} from '@rexxhayanasi/elaina-baileys';
import config from "../../config.js";
import fs from "fs";
import sharp from "sharp";
import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";
import { getTimeGreeting, formatUptime } from "../../src/lib/elaina-formatter.js";
import { getCategories, getCommandsByCategory } from "../../src/lib/elaina-plugins.js";
import { getCasesByCategory } from "../../case/rimuru.js";
import { legacyMenuHandler } from "./menu-variants.js";

const pluginConfig = {
  name: "menu",
  alias: ["help", "bantuan", "commands", "m"],
  category: "main",
  description: "Menampilkan menu utama bot",
  usage: ".menu",
  example: ".menu",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

const CATEGORY_EMOJIS = {
  owner: "👑", main: "🏠", utility: "🔧", tools: "🛠️", fun: "🎮", game: "🎯",
  download: "📥", downloader: "📥", search: "🔍", sticker: "🖼️", media: "🎬",
  ai: "🤖", group: "👥", religi: "☪️", islamic: "🕌", info: "ℹ️", cek: "📁",
  user: "📊", canvas: "🎨", random: "🎲", ephoto: "🖌️", jpm: "📨", anime: "🍥",
  asupan: "🎞️", clan: "⚔️", convert: "🔄", berita: "📰", rpg: "🗡️", nsfw: "🔞",
  linode: "☁️", primbon: "🔮", cecan: "💃", stalker: "🕵️", tts: "🗣️", vps: "🌊",
  panel: "🖥️", economy: "💰", premium: "💎", pushkontak: "📨", store: "🛍️",
};

const CATEGORY_ORDER = [
  "owner", "main", "utility", "tools", "fun", "game", "download", "search",
  "sticker", "media", "ai", "group", "religi", "info", "cek", "economy", "user",
  "canvas", "random", "premium", "ephoto", "jpm", "pushkontak", "panel", "store",
  "music", "maker", "anime", "elaina", "rpg", "asupan", "clan", "convert",
];

const FONT = {
  A: "𝑨", B: "𝑩", C: "𝑪", D: "𝑫", E: "𝑬", F: "𝑭", G: "𝑮", H: "𝑯", I: "𝑰", J: "𝑱", K: "𝑲", L: "𝑳", M: "𝑴",
  N: "𝑵", O: "𝑶", P: "𝑷", Q: "𝑸", R: "𝑹", S: "𝑺", T: "𝑻", U: "𝑼", V: "𝑽", W: "𝑾", X: "𝑿", Y: "𝒀", Z: "𝒁",
  a: "𝒂", b: "𝒃", c: "𝒄", d: "𝒅", e: "𝒆", f: "𝒇", g: "𝒈", h: "𝒉", i: "𝒊", j: "𝒋", k: "𝒌", l: "𝒍", m: "𝒎",
  n: "𝒏", o: "𝒐", p: "𝒑", q: "𝒒", r: "𝒓", s: "𝒔", t: "𝒕", u: "𝒖", v: "𝒗", w: "𝒘", x: "𝒙", y: "𝒚", z: "𝒛",
  "0": "𝟎", "1": "𝟏", "2": "𝟐", "3": "𝟑", "4": "𝟒", "5": "𝟓", "6": "𝟔", "7": "𝟕", "8": "𝟖", "9": "𝟗",
};
const pretty = (value) => [...String(value)].map((c) => FONT[c] || c).join("");

function sortedCategoryData(m, botMode) {
  const pluginMap = getCommandsByCategory();
  const caseMap = getCasesByCategory();
  const categories = new Set([...getCategories(), ...Object.keys(pluginMap), ...Object.keys(caseMap)]);

  const allowed = {
    md: null,
    cpanel: ["main", "group", "sticker", "owner", "tools", "panel"],
    store: ["main", "group", "sticker", "owner", "store"],
    pushkontak: ["main", "group", "sticker", "owner", "pushkontak"],
  }[botMode] ?? null;
  const excluded = new Set(({
    md: ["panel", "pushkontak", "store"],
    cpanel: [], store: [], pushkontak: [],
  }[botMode] ?? []));

  return [...categories]
    .map(String)
    .filter((cat) => {
      const key = cat.toLowerCase();
      if (key === "owner" && !m.isOwner) return false;
      if (allowed && !allowed.includes(key)) return false;
      if (excluded.has(key)) return false;
      return (pluginMap[cat]?.length || pluginMap[key]?.length || caseMap[cat]?.length || caseMap[key]?.length);
    })
    .sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a.toLowerCase());
      const bi = CATEGORY_ORDER.indexOf(b.toLowerCase());
      return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) || a.localeCompare(b);
    })
    .map((cat) => {
      const p = pluginMap[cat] || pluginMap[cat.toLowerCase()] || [];
      const c = caseMap[cat] || caseMap[cat.toLowerCase()] || [];
      return { cat, emoji: CATEGORY_EMOJIS[cat.toLowerCase()] || "📁", count: p.length + c.length };
    });
}

async function defaultMenuHandler(m, { sock, config: botConfig, db, uptime }) {
  const groupData = m.isGroup ? db.getGroup(m.chat) || {} : {};
  const botMode = groupData.botMode || "md";
  const categories = sortedCategoryData(m, botMode);
  const prefix = botConfig.command?.prefix || ".";
  const senderNo = String(m.sender || "").split("@")[0];
  const user = (await db.getUser(m.sender)) || {};
  const runtime = typeof uptime === "function" ? await uptime() : formatUptime(process.uptime());
  const greeting = getTimeGreeting();
  const total = categories.reduce((n, x) => n + x.count, 0);
  const role = m.isOwner ? "👑 Owner" : m.isPremium ? "💎 Premium" : "🏷️ Free";

  let video;
  try {
    video = getAssetBuffer("rimuru-mp4", botConfig.assets);
    if (!video) throw new Error("asset unavailable");
  } catch {
    return m.reply("❌ Video menu tidak ditemukan di assets.");
  }

  const thumbnail = await sharp(getAssetBuffer("rimuru", botConfig.assets))
    .resize(300, 300)
    .jpeg({ quality: 80 })
    .toBuffer();

  const categoryRows = categories.map(({ cat, emoji, count }) => ({
    title: `${emoji} ${pretty(cat.toUpperCase())}`,
    description: `${count} perintah • buka daftar menu`,
    id: `${prefix}menucat ${cat}`,
  }));

    const bodyText =
`${pretty("RIMURU MD")}  ✦  ${pretty("V5 — LV 2")}\n\n` +
`${pretty(greeting)} ${m.pushName || "Kawan"} ✨\n` +
`_${botConfig.bot?.body || "Siap membantu kebutuhan kamu di WhatsApp."}_\n\n` +
`┏━━ ${pretty("USER INFO")} ━━┓\n` +
`┃  ${pretty("Nama")}   : ${m.pushName || "User"}\n` +
`┃  ${pretty("Status")} : ${role}\n` +
`┃  ${pretty("Mode")}   : ${(botConfig.mode || "public").toUpperCase()}\n` +
`┃  ${pretty("Nomor")}  : +${senderNo}\n` +
`┗━━━━━━━━━━━━━━━━━━┛\n\n` +
`┏━━ ${pretty("BOT INFO")} ━━┓\n` +
`┃  ${pretty("Bot")}     : ${botConfig.bot?.name || "Rimuru MD"}\n` +
`┃  ${pretty("Author")}  : ${botConfig.bot?.developer || "Anita Putri Azzahra"}\n` +
`┃  ${pretty("Versi")}   : ${botConfig.bot?.version || "-"}\n` +
`┃  ${pretty("Uptime")}  : ${runtime}\n` +
`┗━━━━━━━━━━━━━━━━━━┛\n\n` +
`╭─ ${pretty("MENU UTAMA")} ─╮\n` +
`│ ✦ Pilih kategori lewat tombol di bawah.\n` +
`│ ✦ Setiap kategori langsung membuka ${pretty(".menucat")} .\n` +
`╰──────────────────╯`;
  const media = await prepareWAMessageMedia({
    video,
    gifPlayback: true,
  }, { upload: sock.waUploadToServer });

  const newsletterId = botConfig.saluran?.id || "120363409623385879@newsletter";
  const newsletterName = botConfig.saluran?.name || botConfig.bot?.name || "Rimuru MD";

  const message = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {},
        interactiveMessage: {
          header: {
            title: `${botConfig.bot?.name || "Rimuru MD"} • V5 — LV 2`,
            subtitle: "Menu utama",
            hasMediaAttachment: true,
            videoMessage: media.videoMessage,
          },
          body: { text: bodyText },
          footer: { text: "Rimuru MD • pilih kategori untuk melihat command" },
          contextInfo: {
            mentionedJid: [m.sender],
            isForwarded: true,
            forwardingScore: 9,
            forwardedNewsletterMessageInfo: {
              newsletterJid: newsletterId,
              newsletterName,
              serverMessageId: 143,
            },
          },
          nativeFlowMessage: {
            messageParamsJson: JSON.stringify({
              bottom_sheet: {
                in_thread_buttons_limit: 2,
                divider_indices: [1, 2, 3, 4, 5, 999],
                list_title: "Pilih kategori menu",
                button_title: "🌸 PILIH MENU",
              },
            }),
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                  title: "🌸 Pilih Menu",
                  sections: [{
                    title: "Kategori Rimuru MD",
                    rows: categoryRows,
                  }],
                }),
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "📜 Peraturan",
                  id: `${prefix}rules`,
                }),
              },
            ],
          },
        },
      },
    },
  }, {
    quoted: {
      key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: m.sender },
      message: {
        locationMessage: {
          degreesLatitude: 0,
          degreesLongitude: 0,
          name: `${botConfig.bot?.name || "Rimuru MD"} • ${pretty("V5 — LV 2")}`,
          jpegThumbnail: thumbnail,
        },
      },
    },
    userJid: sock.user.jid,
  });

  await sock.relayMessage(m.chat, message.message, { messageId: message.key.id });
}


async function handler(m, { sock, config: botConfig, db, uptime }) {
  const selected = Number(db.setting("menuVariant") || botConfig.ui?.menuVariant || 9);
  if (selected >= 1 && selected <= 8) {
    await legacyMenuHandler(m, { sock, config: botConfig, db, uptime });
    return;
  }
  // V9 is the current default V5 — LV2 design.
  await defaultMenuHandler(m, { sock, config: botConfig, db, uptime });
}

export { pluginConfig as config, handler };