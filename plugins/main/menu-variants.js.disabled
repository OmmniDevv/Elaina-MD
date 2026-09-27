/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getCaseCount, getCasesByCategory } from "../../case/rimuru.js";
import {
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  proto,
} from '@rexxhayanasi/elaina-baileys';
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import _sharp from "sharp";
import config from "../../config.js";
import {
  formatUptime,
  getTimeGreeting,
} from "../../src/lib/elaina-formatter.js";
import {
  getCommandsByCategory,
  getCategories,
} from "../../src/lib/elaina-plugins.js";
import { getDatabase } from "../../src/lib/elaina-database.js";
import fs from "fs";
import path from "path";
import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";

function getSharp() {
  return _sharp;
}
import axios from "axios";
import sharp from "sharp";
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
  owner: "👑",
  main: "🏠",
  utility: "🔧",
  tools: "🛠️",
  fun: "🎮",
  game: "🎯",
  download: "📥",
  downloader: "📥",
  search: "🔍",
  sticker: "🖼️",
  media: "🎬",
  ai: "🤖",
  group: "👥",
  religi: "☪️",
  islamic: "🕌",
  info: "ℹ️",
  cek: "📁",
  user: "📊",
  canvas: "🎨",
  random: "🎲",
  ephoto: "🖌️",
  jpm: "📨",
  anime: "🍥",
  asupan: "🎞️",
  clan: "⚔️",
  convert: "🔄",
  berita: "📰",
  rpg: "🗡️",
  nsfw: "🔞",
  linode: "☁️",
  primbon: "🔮",
  cecan: "💃",
  stalker: "🕵️",
  tts: "🗣️",
  vps: "🌊",
  panel: "🖥️"
};
function toSmallCaps(text) {
  const smallCaps = {
    a: "ᴀ",
    b: "ʙ",
    c: "ᴄ",
    d: "ᴅ",
    e: "ᴇ",
    f: "ꜰ",
    g: "ɢ",
    h: "ʜ",
    i: "ɪ",
    j: "ᴊ",
    k: "ᴋ",
    l: "ʟ",
    m: "ᴍ",
    n: "ɴ",
    o: "ᴏ",
    p: "ᴘ",
    q: "ǫ",
    r: "ʀ",
    s: "s",
    t: "ᴛ",
    u: "ᴜ",
    v: "ᴠ",
    w: "ᴡ",
    x: "x",
    y: "ʏ",
    z: "ᴢ",
  };
  return text
    .toLowerCase()
    .split("")
    .map((c) => smallCaps[c] || c)
    .join("");
}
const toMonoUpperBold = (text) => {
  const chars = {
    A: "𝗔",
    B: "𝗕",
    C: "𝗖",
    D: "𝗗",
    E: "𝗘",
    F: "𝗙",
    G: "𝗚",
    H: "𝗛",
    I: "𝗜",
    J: "𝗝",
    K: "𝗞",
    L: "𝗟",
    M: "𝗠",
    N: "𝗡",
    O: "𝗢",
    P: "𝗣",
    Q: "𝗤",
    R: "𝗥",
    S: "𝗦",
    T: "𝗧",
    U: "𝗨",
    V: "𝗩",
    W: "𝗪",
    X: "𝗫",
    Y: "𝗬",
    Z: "𝗭",
  };
  return text
    .toUpperCase()
    .split("")
    .map((c) => chars[c] || c)
    .join("");
};
function getSortedCategories(m, botMode) {
  const categories = getCategories();
  const commandsByCategory = getCommandsByCategory();
  const categoryOrder = [
    "owner",
    "main",
    "utility",
    "tools",
    "fun",
    "game",
    "download",
    "search",
    "sticker",
    "media",
    "ai",
    "group",
    "religi",
    "info",
    "cek",
    "economy",
    "user",
    "canvas",
    "random",
    "premium",
    "ephoto",
    "jpm",
    "pushkontak",
    "panel",
    "store"
  ];
  let modeAllowedMap = {
    md: null,
    cpanel: ["main", "group", "sticker", "owner", "tools", "panel"],
    store: ["main", "group", "sticker", "owner", "store"],
    pushkontak: ["main", "group", "sticker", "owner", "pushkontak"],
  };
  let modeExcludeMap = {
    md: ["panel", "pushkontak", "store"],
    cpanel: null,
    store: null,
    pushkontak: null,
  };
  const allowedCats = modeAllowedMap[botMode];
  const excludeCats = modeExcludeMap[botMode] || [];
  const sortedCats = [...categories].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });
  const result = [];
  let totalCmds = 0;
  for (const cat of sortedCats) {
    if (cat === "owner" && !m.isOwner) continue;
    if (allowedCats && !allowedCats.includes(cat.toLowerCase())) continue;
    if (excludeCats && excludeCats.includes(cat.toLowerCase())) continue;
    const cmds = commandsByCategory[cat] || [];
    if (cmds.length === 0) continue;
    const emoji = CATEGORY_EMOJIS[cat] || "📁";
    result.push({ cat, cmds, emoji });
  }
  for (const cat of categories) {
    totalCmds += (commandsByCategory[cat] || []).length;
  }
  return { sorted: result, totalCmds, commandsByCategory };
}
async function formatTime(date) {
  const timeHelper = await import("../../src/lib/elaina-time.js");
  return timeHelper.formatTime("HH:mm");
}
async function formatDateShort(date) {
  const timeHelper = await import("../../src/lib/elaina-time.js");
  return timeHelper.formatFull("dddd, DD MMMM YYYY");
}
async function buildMenuText(
  m,
  botConfig,
  db,
  uptime,
  botMode = "md",
  useBracketBoxStyle = false,
) {
  const prefix = botConfig.command?.prefix || ".";
  const user = db.getUser(m.sender);
  const timeHelper = await import("../../src/lib/elaina-time.js");
  const timeStr = timeHelper.formatTime("HH:mm");
  const dateStr = timeHelper.formatFull("dddd, DD MMMM YYYY");
  const categories = getCategories();
  const commandsByCategory = getCommandsByCategory();
  let totalCommands = 0;
  for (const category of categories) {
    totalCommands += (commandsByCategory[category] || []).length;
  }
  const totalCases = getCaseCount();
  const casesByCategory = getCasesByCategory();
  const totalFeatures = totalCommands + totalCases;
  let userRole = "User",
    roleEmoji = "👤";
  if (m.isOwner) {
    userRole = "Owner";
    roleEmoji = "👑";
  } else if (m.isPremium) {
    userRole = "Premium";
    roleEmoji = "💎";
  }
  const greeting = getTimeGreeting();
  const uptimeFormatted = formatUptime(uptime);
  const totalUsers = db.getUserCount();
  let txt = `${greeting}\n\n`;
  txt += `      ${m.pushName || "User"}\n\n`;
  txt += `Halo Kawan 🌱\n`;
  txt += `Perkenalkan aku ${botConfig.bot?.name || "Denia Al"}, buatan ${botConfig.bot?.developer || "Alesha"} Saya siap membantu\n`;
  txt += `kebutuhanmu, mulai dari download\n`;
  txt += `video, main game, tanya jawab, nyari\n`;
  txt += `info/sesuatu, bikin sticker, dan lain-lain.\n\n`;

  txt += `    ᯓ INFO USER\n`;
  txt += `╭   • Nama : ${m.pushName || "User"}\n`;
  txt += `┆   • Status : ${userRole}\n`;
  txt += `┆   • Mode : ${(botConfig.mode || "public").toUpperCase()}\n`;
  txt += `┆   • Nomor : ${m.sender.split("@")[0]}\n`;
  txt += `┆   • Waktu : ${timeStr} WIB\n`;
  txt += `╰➤------------------------------\n`;

  txt += `    ᯓ INFO BOT\n`;
  txt += `╭  • Name : ${botConfig.bot?.name || "Rimuru-AI"}\n`;
  txt += `┆  • Author : ${botConfig.bot?.developer || "Owner"}\n`;
  txt += `┆  • Versi : ${botConfig.bot?.version || "1.2.0"}\n`;
  txt += `┆  • Type script : RIMURU x ${botConfig.bot?.developer || "Owner"}\n`;
  txt += `┆  • Uptime : ${uptimeFormatted}\n`;
  txt += `╰➤------------------------------\n`;
  const categoryOrder = [
    "owner",
    "main",
    "utility",
    "tools",
    "fun",
    "game",
    "download",
    "search",
    "sticker",
    "media",
    "ai",
    "group",
    "religi",
    "info",
    "cek",
    "economy",
    "user",
    "canvas",
    "random",
    "premium",
    "ephoto",
    "jpm",
    "pushkontak",
    "panel",
    "store"
  ];
  const sortedCategories = [...categories].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });
  let modeAllowedMap = {
    md: null,
    cpanel: ["main", "group", "sticker", "owner", "tools", "panel"],
    store: ["main", "group", "sticker", "owner", "store"],
    pushkontak: ["main", "group", "sticker", "owner", "pushkontak"],
  };
  let modeExcludeMap = {
    md: ["panel", "pushkontak", "store"],
    cpanel: null,
    store: null,
    pushkontak: null,
  };
  try {
    const botmodePlugin = await import("../group/botmode.js");
    if (botmodePlugin && botmodePlugin.MODES) {
      const modes = botmodePlugin.MODES;
      modeAllowedMap = {};
      modeExcludeMap = {};
      for (const [key, val] of Object.entries(modes)) {
        modeAllowedMap[key] = val.allowedCategories;
        modeExcludeMap[key] = val.excludeCategories;
      }
    }
  } catch (e) { }
  const allowedCategories = modeAllowedMap[botMode];
  const excludeCategories = modeExcludeMap[botMode] || [];
  const categoryLines = [];
  for (const category of sortedCategories) {
    if (category === "owner" && !m.isOwner) continue;
    if (
      allowedCategories &&
      !allowedCategories.includes(category.toLowerCase())
    )
      continue;
    if (excludeCategories && excludeCategories.includes(category.toLowerCase()))
      continue;
    const pluginCmds = commandsByCategory[category] || [];
    const caseCmds = casesByCategory[category] || [];
    const totalCmds = pluginCmds.length + caseCmds.length;
    if (totalCmds === 0) continue;
    const emoji = CATEGORY_EMOJIS[category] || "📁";
    categoryLines.push(`${prefix}menucat ${category} ${emoji}`);
  }
  if (categoryLines.length > 0) {
    txt += ` ✦ DAFTAR MENU ✦\n`;
    txt += `╭   • ${categoryLines[0]}\n`;
    for (let i = 1; i < categoryLines.length; i++) {
      txt += `┆   • ${categoryLines[i]}\n`;
    }
    txt += `╰➤------------------------------\n`;
  }
  return txt;
}

function createBracketBox(title, lines = [], emoji = "🤖") {
  let text = `╭─〔 ${emoji} \`${title}\`〕─⬣\n`;
  for (const line of lines) {
    text += `│ ✦ *${line}*\n`;
  }
  text += `╰─⬣\n\n`;
  return text;
}

function getContextInfo(
  botConfig,
  m,
  thumbBuffer,
  renderLargerThumbnail = false,
) {
  const saluranId = botConfig.saluran?.id || "120363412350560864@newsletter";
  const saluranName =
    botConfig.saluran?.name || botConfig.bot?.name || "Rimuru-AI";
  const saluranLink = botConfig.saluran?.link || "";
  const ctx = {
    mentionedJid: [m.sender],
    forwardingScore: 9,
    isForwarded: true,
    externalAdReply: {
      title: botConfig.bot?.name || "Rimuru-AI",
      body: `BOT WHATSAPP MULTI DEVICE`,
      sourceUrl: saluranLink,
      previewType: "VIDEO",
      showAdAttribution: false,
      renderLargerThumbnail,
    },
  };
  if (thumbBuffer) ctx.externalAdReply.thumbnail = thumbBuffer;
  return ctx;
}
function getVerifiedQuoted(botConfig, m) {
  if (m) {
    return {
      key: {
        participant: `${m.sender}`,
        remoteJid: `status@broadcast`,
      },
      message: {
        contactMessage: {
          displayName: `🍂 Yth. ${m.pushName}`,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;ttname,;;;\nFN:ttname\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
          sendEphemeral: true,
        },
      },
    };
  }
  return {
    key: {
      participant: `0@s.whatsapp.net`,
      remoteJid: `status@broadcast`,
    },
    message: {
      contactMessage: {
        displayName: `🪸 ${botConfig.bot?.name}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;ttname,;;;\nFN:ttname\nitem1.TEL;waid=13135550002:+1 (313) 555-0002\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        sendEphemeral: true,
      },
    },
  };
}

async function legacyMenuHandler(m, { sock, config: botConfig, db, uptime }) {
  const savedVariant = db.setting("menuVariant");
  const menuVariant = savedVariant || botConfig.ui?.menuVariant || 2;
  const groupData = m.isGroup ? db.getGroup(m.chat) || {} : {};
  const botMode = groupData.botMode || "md";
  const text = await buildMenuText(
    m,
    botConfig,
    db,
    uptime,
    botMode,
    menuVariant === 9,
  );

  let imageBuffer = null;
  let thumbBuffer = null;
  let videoBuffer = null;

  try {
    imageBuffer = getAssetBuffer("rimuru", botConfig.assets)
    thumbBuffer = getAssetBuffer("rimuru2", botConfig.assets)
  } catch (e) {
    console.error("Gagal load assets:", e.message);
  }
  const prefix = botConfig.command?.prefix || ".";
  const saluranId = botConfig.saluran?.id || "120363412350560864@newsletter";
  const saluranName =
    botConfig.saluran?.name || botConfig.bot?.name || "Rimuru-AI";
  const saluranLink =
    botConfig.saluran?.link ||
    "https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";
  const {
    sorted: menuSorted,
    totalCmds,
    commandsByCategory,
  } = getSortedCategories(m, botMode);
  const greeting = getTimeGreeting();
  const uptimeFormatted = formatUptime(uptime);
  const user = await db.getUser(m.sender) || {}
  try {
    const categories = getSortedCategories(m, botMode);
    const zann_pengin_rehat = categories.sorted.map(({ cat, cmds, emoji }) => {
      return {
        title: `${emoji} ${toMonoUpperBold(cat)}`,
        description: `Command ini memiliki  (${cmds.length}) Perintah`,
        id: `${m.prefix}menucat ${cat}`,
      };
    });
    switch (menuVariant) {
      case 1:
        if (videoBuffer || getAssetBuffer("rimuru-mp4", config.assets)) {
          const pvideo = videoBuffer || getAssetBuffer("rimuru-mp4", config.assets);
          const senderNo = String(m.sender || "").split("@")[0];
          const totalFitur = totalCmds + Object.values(getCasesByCategory()).flat().length;
          const userStatus = m?.isOwner ? "Owner" : m?.isPremium ? "Premium" : "Free";

          const paimonLikeText = `乂  *D A S H B O A R D*

Hai @${senderNo}
_${config.bot?.body || "Siap membantu kebutuhan kamu di WhatsApp"}_

*U S E R  I N F O*
◦ Name: ${m.pushName || "User"}
◦ Status: ${userStatus}
◦ Limit: ${user?.ownerAcces ? "Unlimited" : (user?.limit ?? 20)}
◦ Level: ${user?.level || 1}

*S Y S T E M  I N F O*
◦ Bot: ${config.bot?.name || "Rimuru MD"}
◦ Ver: ${config.bot?.version || "-"}
◦ Up: ${uptimeFormatted}
◦ Total: ${totalFitur} Fitur

*C A T E G O R I E S*
${menuSorted.map(({ cat }) => `◦ .menucat ${String(cat).toLowerCase()}`).join("\\n")}

_Select a category to see commands._`;

          const menuRows = menuSorted.map(({ cat, cmds, emoji }) => ({
            title: `${emoji || "📁"} ${toMonoUpperBold(cat)}`,
            description: `Command ini memiliki (${cmds.length}) perintah`,
            id: `${prefix}menucat ${cat}`,
          }));

          const extraRows = [
            {
              title: "🍔 Lihat semua menu yang ada di bot ini",
              description: "Silahkan tap lalu kirim",
              id: `${prefix}allmenu`,
            },
            {
              title: "🥰 Mau script seperti bot ini?",
              description: "Silahkan tap lalu kirim untuk mendapatkan script",
              id: `${prefix}sc`,
            },
            {
              title: "🌾 Siapakah owner dari bot ini?",
              description: "Tap lalu kirim untuk melihat owner",
              id: `${prefix}owner`,
            },
          ];

          await sock.sendMessage(m.chat, {
            video: pvideo,
            gifPlayback: true,
            caption: paimonLikeText,
            mentions: [m.sender],
            mimetype: "video/mp4",
            contextInfo: {
              isForwarded: true,
              forwardingScore: 1,
              forwardedNewsletterMessageInfo: {
                newsletterJid: saluranId,
                newsletterName: saluranName,
                serverMessageId: 143,
              },
            },
            interactiveButtons: [
              {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                  title: "🍃 Menu Utama",
                  sections: [
                    {
                      title: "Berikut adalah pilihan nya",
                      rows: menuRows,
                    },
                  ],
                  icon: "DEFAULT",
                }),
              },
              {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                  title: "Selengkapnya",
                  sections: [
                    {
                      title: "Berikut adalah pilihan nya",
                      rows: extraRows,
                    },
                  ],
                  icon: "REVIEW",
                }),
              },
            ],
          }, { quoted: getVerifiedQuoted(botConfig, m) });
        } else {
          await m.reply(text);
        }
        break;
      case 2:
        let s = ""
        categories.sorted.map(({ cat, cmds, emoji }) => {
          s += `╭─☰ ${toMonoUpperBold(cat)}\n`
          cmds.map((cmd) => {
            s += `> ${m.prefix}${cmd}\n`
          })
          s += "╰─⬣\n\n"
        });
        const media = await prepareWAMessageMedia({
          image: getAssetBuffer("rimuru", config.assets)
        }, { upload: sock.waUploadToServer })
        const readmore = String.fromCharCode(8206).repeat(4001)
        await sock.relayMessage(
          m.chat,
          {
            viewOnceMessage: {
              message: {
                messageContextInfo: {},
                interactiveMessage: {
                  header: {
                    title: "",
                    subtitle: "",
                    hasMediaAttachment: true,
                    imageMessage: media.imageMessage
                  },
                  body: {
                    text: `🥞 *Hello Brother*

Welcome to ${config.bot?.name}, Our bot will help you

🍅 *BOT INFORMATION*
> 🤖 *Name*: ${config.bot?.name}
> ⚙️ *Version*: ${config.bot?.version}
> 👨‍💻 *Developer*: ${config.bot?.developer}
> 🧩 *Library*: \`__KEEP_RIMURU_BAILEYS__\`

🍅 *USER INFORMATION*
> 🧑 *Name*: ${m.pushName}
> 🥐 *Role*: ${m?.isOwner ? "🔥 Owner" : m?.isPremium ? "👑 Premium" : "😊 User"}
> 🧀 *Level*: ${user.level || 0}
> 🍗 *Exp*: ${user.exp || 0}
> 🥩 *Energi*: ${user.energi || 0}
> 🎏 *Koin*: ${user.koin || 0}
> 🍬 *Register*: ${user.isRegistered ? "Sudah" : "Belum"}

${readmore}${s}`
                  },
                  footer: {
                    text: "Pilih tombol dibawah untuk info lebih lanjut"
                  },
                  contextInfo: {
                    isForwarded: true,
                    fprwardingScore: 9,
                    participant: "0@s.whatsapp.net",
                    quotedMessage: {
                      conversation: `${config.bot?.name}`
                    },
                    mentionedJid: [
                      `${m.sender}`
                    ]
                  },
                  nativeFlowMessage: {
                    messageParamsJson: JSON.stringify({
                      limited_time_offer: {
                        text: `${greeting}`,
                        url: "Hai",
                        copy_code: "Dibuat oleh " + config.bot?.developer,
                        expiration_time: Date.now() + 1000000,
                      },
                      bottom_sheet: {
                        in_thread_buttons_limit: 2,
                        divider_indices: [1, 2, 3, 4, 5, 999],
                        list_title: "Silahkan pilih menu yang kamu inginkan",
                        button_title: "🍅 Selengkapnya",
                      },
                      tap_target_configuration: {
                        title: " X ",
                        description: "bomboclard",
                        canonical_url: "https://rimuru.site",
                        domain: "shop.example.com",
                        button_index: 0,
                      },
                    }),
                    buttons: [
                      {
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                          has_multiple_buttons: true
                        })
                      },
                      {
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                          display_text: "🍫 Owner Kami",
                          url: `https://wa.me/${botConfig.owner?.number?.[0]}`,
                          merchant_url: `https://wa.me/${config.owner?.number?.[0]}`,
                        })
                      },
                      {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                          display_text: "🍛 Dapatkan Script ( Gratis )",
                          id: `${m.prefix}sc`
                        })
                      }
                    ]
                  }
                }
              }
            }
          },
          {}
        )

        break;

      case 3:
        const content = {
          buttonsMessage: {
            buttons: [
              {
                buttonId: `${m.prefix}owner`,
                buttonText: {
                  displayText: '🧀 Owner',
                },
                type: 1,
              },
              {
                buttonId: `${m.prefix}allmenu`,
                buttonText: {
                  displayText: '💐 Allmenu',
                },
                type: 1,
              },
            ],
            locationMessage: {
              jpegThumbnail: await sharp(getAssetBuffer("rimuru", config.assets)).resize(300, 170).toBuffer(),
              name: config.bot.name,
              address: `Versi saat ini: ${config.bot.version}`
            },
            contentText: `🥞 *Hello Brother*

Welcome to ${config.bot?.name}, Our bot will help you

🍅 *BOT INFORMATION*
> 🤖 *Name*: ${config.bot?.name}
> ⚙️ *Version*: ${config.bot?.version}
> 👨‍💻 *Developer*: ${config.bot?.developer}
> 🧩 *Library*: \`__KEEP_RIMURU_BAILEYS__\`

🍅 *USER INFORMATION*
> 🧑 *Name*: ${m.pushName}
> 🥐 *Role*: ${m?.isOwner ? "🔥 Owner" : m?.isPremium ? "👑 Premium" : "😊 User"}
> 🧀 *Level*: ${user.level || 0}
> 🍗 *Exp*: ${user.exp || 0}
> 🥩 *Energi*: ${user.energi || 0}
> 🎏 *Koin*: ${user.koin || 0}
> 🍬 *Register*: ${user.isRegistered ? "Sudah" : "Belum"}`,
            footerText: '🍔 Silahkan pilih dari salah satu tombol di bawah',
            headerType: 6,
          },
        };

        const msg = generateWAMessageFromContent(m.chat, content, {
          userJid: sock.user.jid,
        });

        await sock.relayMessage(m.chat, msg.message, {
          messageId: msg.key.id,
        });
        break

      case 4: {
        const thumbnail = await sharp(getAssetBuffer("rimuru", config.assets)).resize(300, 300).toBuffer()
        const qvideo = {
          key: {
            fromMe: false,
            participant: m.sender
          },
          message: {
            videoMessage: {
              caption: config.bot.name,
              seconds: 999999999,
              mimetype: "video/mp4",
              jpegThumbnail: thumbnail,
              fileLength: "9999999"
            }
          }
        }
        const media4 = await prepareWAMessageMedia({
          video: getAssetBuffer("rimuru-mp4", config.assets),
          gifPlayback: true
        }, { upload: sock.waUploadToServer });
        let singlePush = categories.sorted.map(cat => {
          return {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              title: `${cat.emoji} ${cat.cat} Menu`,
              sections: [
                {
                  title: "Please select the command",
                  highlight_label: config.bot.name,
                  rows: cat.cmds.map((cmd, i) => {
                    return {
                      title: (i + 1).toString() + " " + cmd,
                      description: "Select this command?",
                      id: `${prefix}${cmd}`
                    }
                  })
                }
              ],
              icon: "REVIEW"
            })
          }
        })
        const msg4 = generateWAMessageFromContent(m.chat, {
          viewOnceMessage: {
            message: {
              messageContextInfo: {},
              interactiveMessage: {
                header: {
                  title: "",
                  subtitle: "",
                  hasMediaAttachment: true,
                  videoMessage: media4.videoMessage
                },
                footer: {
                  text: `Please select the button in below`
                },
                body: {
                  text: `*${greeting} ${m.pushName}*, 𝘔𝘺 𝘯𝘢𝘮𝘦 𝘪𝘴 ${config.bot.name}.

  🏔 𝘐 𝘊𝘢𝘯 𝘩𝘦𝘭𝘱 𝘺𝘰𝘶 𝘸𝘪𝘵𝘩 𝘴𝘦𝘷𝘦𝘳𝘢𝘭 𝘵𝘩𝘪𝘯𝘨𝘴 𝘸𝘪𝘵𝘩𝘪𝘯 𝘞𝘩𝘢𝘵𝘴𝘈𝘱𝘱. 𝘈𝘯𝘥 𝘐 𝘢𝘮 𝘈𝘳𝘮𝘦𝘥 𝘢 *𝘑𝘢𝘷𝘢𝘴𝘤𝘳𝘪𝘱𝘵* 𝘗𝘳𝘰𝘨𝘳𝘢𝘮 𝘈𝘴𝘴𝘦𝘮𝘣𝘭𝘦𝘥 𝘣𝘺 𝘮𝘺 𝘤𝘳𝘦𝘢𝘵𝘰𝘳.

\`INFORMATION BOT\`
> 🍛 *Creator*: ${config.bot?.developer}
> 🥞 *Name*: ${config.bot?.name}
> 🥩 *Version*: ${config.bot?.version}
> 🍂 *Type*: \`Plugin x Cases\`
> 🦴 *Mode*: *${config.mode === 'public' ? '🍕 Unlock for everyone' : '🥖 Only for Owner'}*

Enjoy your use brother.`
                },
                contextInfo: {
                  mentionedJid: [m.sender],
                  isForwarded: true,
                  forwardingScore: 9,
                  forwardedNewsletterMessageInfo: {
                    newsletterJid: saluranId,
                    newsletterName: saluranName,
                    serverMessageId: 127,
                  },
                },
                nativeFlowMessage: {
                  messageParamsJson: JSON.stringify({
                    bottom_sheet: {
                      in_thread_buttons_limit: 2,
                      divider_indices: [1, 2, 3, 4, 5, 999],
                      list_title: "Please select the menu",
                      button_title: "🍙 See Category",
                    },
                    tap_target_configuration: {
                      title: " X ",
                      description: "bomboclard",
                      canonical_url: "https://rimuru.site",
                      domain: "shop.example.com",
                      button_index: 0,
                    },
                  }),
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: JSON.stringify({
                        display_text: "🧀 Visit My Creator",
                        url: `https://wa.me/${botConfig.owner?.number?.[0]}`,
                        merchant_url: `https://wa.me/${config.owner?.number?.[0]}`,
                      })
                    },
                    ...singlePush
                  ]
                }
              }
            }
          }
        }, { quoted: qvideo, userJid: sock.user.jid });

        await sock.relayMessage(m.chat, msg4.message, {
          messageId: msg4.key.id,
        });
        break;
      }

      case 5: {
        function runtime(seconds) {
          seconds = Number(seconds);

          const d = Math.floor(seconds / (3600 * 24));
          const h = Math.floor(seconds % (3600 * 24) / 3600);
          const m = Math.floor(seconds % 3600 / 60);
          const s = Math.floor(seconds % 60);

          return `${d} Jam ${m} Menit ${s} Detik`;
        }

        const weatherCode = {
          0: "☀️ Cerah",
          1: "🌤️ Cerah Berawan",
          2: "⛅ Berawan",
          3: "☁️ Mendung",
          45: "🌫️ Berkabut",
          48: "🌫️ Kabut Tebal",
          51: "🌦️ Gerimis",
          61: "🌧️ Hujan Ringan",
          63: "🌧️ Hujan",
          65: "⛈️ Hujan Lebat",
          80: "🌦️ Hujan Lokal",
          95: "⛈️ Badai Petir"
        }

        async function weatherMenu(city = "Jakarta") {
          try {
            const geo = await axios.get(
              `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
            )

            const loc = geo.data.results?.[0]
            if (!loc) return "Cuaca tidak tersedia"

            const res = await axios.get(
              `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,weather_code`
            )

            const current = res.data.current
            const kondisi = weatherCode[current.weather_code] || "🌍 Tidak diketahui"

            return `${kondisi} | 🌡️ ${Math.round(current.temperature_2m)}°C\n📍 ${loc.name}`
          } catch {
            return "Cuaca tidak tersedia"
          }
        }
        const thumbnail = await sharp(getAssetBuffer("rimuru", config.assets)).resize(300, 300).toBuffer()
        const qOrder = {
          key: {
            fromMe: false,
            participant: '0@s.whatsapp.net',
            remoteJid: m.sender
          },
          message: {
            locationMessage: {
              degreesLatitude: 0,
              degreesLongitude: 0,
              name: await weatherMenu(),
              jpegThumbnail: thumbnail
            }
          }
        }
        const media4 = await prepareWAMessageMedia({
          video: getAssetBuffer("rimuru-mp4", config.assets),
          gifPlayback: true
        }, { upload: sock.waUploadToServer });
        const msg4 = generateWAMessageFromContent(m.chat, {
          viewOnceMessage: {
            message: {
              messageContextInfo: {},
              interactiveMessage: {
                header: {
                  title: "",
                  subtitle: "",
                  hasMediaAttachment: true,
                  videoMessage: media4.videoMessage
                },
                footer: {
                  text: `Please select the button in below`
                },
                body: {
                  text: `🍟 Hai *${m.pushName}* 
                  
_i am an automated system (WhatsApp bot) that can help to do something search and get data / information only through WhatsApp._

*\`乂 I N F O - B O T\`*
┌ ◦ Name : ${config.bot.name}
│ ◦ Author : @${config.bot.developer}
│ ◦ Type Script : Case x Plugins
│ ◦ Uptime : ${runtime(process.uptime())}
└ ◦ Versi : ${config.bot.version}

*\`乂 I N F O - U S E R\`*
┌ ◦ Nama : ${m.pushName}
│ ◦ Status : ${m.isPremium ? "💎 Premium" : m.isOwner ? "👑 Owner" : "🏷️ Free"}
│ ◦ Mode : ${config.mode === "pblic" ? "Bisa digunakan semua" : "Hanya Owner :b"}
│ ◦ Nomor : @${m.sender.split("@")[0]}
└ ◦ ${greeting}
`
                },
                contextInfo: {
                  mentionedJid: [m.sender],
                  isForwarded: true,
                  forwardingScore: 9,
                  forwardedNewsletterMessageInfo: {
                    newsletterJid: saluranId,
                    newsletterName: saluranName,
                    serverMessageId: 127,
                  },
                },
                nativeFlowMessage: {
                  messageParamsJson: JSON.stringify({
                    limited_time_offer: {
                      text: `${greeting}`,
                      url: "Hai",
                      // copy_code: "Dibuat oleh " + config.bot?.developer,
                      expiration_time: Date.now() + 10000,
                    },
                    bottom_sheet: {
                      in_thread_buttons_limit: 2,
                      divider_indices: [1, 2, 3, 4, 5, 999],
                      list_title: "Please select the menu",
                      button_title: "🍙 See Category",
                    },
                    tap_target_configuration: {
                      title: " X ",
                      description: "bomboclard",
                      canonical_url: "https://rimuru.site",
                      domain: "shop.example.com",
                      button_index: 0,
                    },
                  }),
                  buttons: [
                    {
                      name: "",
                      buttonParamsJson: ""
                    },
                    {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                        display_text: "𐔌 Allmenu  𐦯",
                        id: `${prefix}allmenu`
                      })
                    },
                    {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                        display_text: "𐔌 Peraturan  𐦯",
                        id: `${prefix}rules`
                      })
                    },
                  ]
                }
              }
            }
          }
        }, { quoted: qOrder, userJid: sock.user.jid });

        await sock.relayMessage(m.chat, msg4.message, {
          messageId: msg4.key.id,
        });
        break;
      }
      case 6: {
        function runtime(seconds) {
          seconds = Number(seconds);

          const d = Math.floor(seconds / (3600 * 24));
          const h = Math.floor(seconds % (3600 * 24) / 3600);
          const m = Math.floor(seconds % 3600 / 60);
          const s = Math.floor(seconds % 60);

          return `${d} Jam ${m} Menit ${s} Detik`;
        }

        const weatherCode = {
          0: "☀️ Cerah",
          1: "🌤️ Cerah Berawan",
          2: "⛅ Berawan",
          3: "☁️ Mendung",
          45: "🌫️ Berkabut",
          48: "🌫️ Kabut Tebal",
          51: "🌦️ Gerimis",
          61: "🌧️ Hujan Ringan",
          63: "🌧️ Hujan",
          65: "⛈️ Hujan Lebat",
          80: "🌦️ Hujan Lokal",
          95: "⛈️ Badai Petir"
        }

        async function weatherMenu(city = "Jakarta") {
          try {
            const geo = await axios.get(
              `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
            )

            const loc = geo.data.results?.[0]
            if (!loc) return "Cuaca tidak tersedia"

            const res = await axios.get(
              `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,weather_code`
            )

            const current = res.data.current
            const kondisi = weatherCode[current.weather_code] || "🌍 Tidak diketahui"

            return `${kondisi} | 🌡️ ${Math.round(current.temperature_2m)}°C\n📍 ${loc.name}`
          } catch {
            return "Cuaca tidak tersedia"
          }
        }
        const rawStats = fs.readFileSync(path.join(process.cwd(), 'database/main/stats.json'), 'utf8')
        const statsData = JSON.parse(rawStats)
        const commandStats = Object.entries(statsData)
          .filter(([key]) => key.startsWith('command_'))
          .map(([key, count]) => ({ name: key.replace('command_', ''), count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        let topCmdText = "\n ✦ History ✦\n"
        if (commandStats.length > 0) {
          topCmdText += `╭   • ${m.prefix}${commandStats[0].name} (${commandStats[0].count}x)\n`
          for (let i = 1; i < commandStats.length; i++) {
            topCmdText += `┆   • ${m.prefix}${commandStats[i].name} (${commandStats[i].count}x)\n`
          }
          topCmdText += `╰➤------------------------------\n`
        } else {
          topCmdText += `╭   • Belum ada command\n╰➤------------------------------\n`
        }

        const thumbnail = await sharp(getAssetBuffer("rimuru", config.assets)).resize(300, 300).toBuffer()
        const msg6 = generateWAMessageFromContent(m.chat, {
          viewOnceMessage: {
            message: {
              messageContextInfo: {},
              interactiveMessage: {
                header: {
                  hasMediaAttachment: true,
                  locationMessage: {
                    degreesLatitude: 0,
                    degreesLongitude: 0,
                    name: config.bot?.name || "Rimuru-AI",
                    address: await weatherMenu(),
                    jpegThumbnail: thumbnail
                  }
                },
                body: {
                  text: text + topCmdText
                },
                contextInfo: {
                  mentionedJid: [m.sender],
                  isForwarded: true,
                  forwardingScore: 9,
                },
                nativeFlowMessage: {
                  messageParamsJson: JSON.stringify({
                    limited_time_offer: {
                      text: `${greeting}`,
                      url: "Hai",
                      expiration_time: Date.now() + 10000,
                    },
                    bottom_sheet: {
                      in_thread_buttons_limit: 2,
                      divider_indices: [1, 2, 3, 4, 5, 999],
                      list_title: "Please select the menu",
                      button_title: "🍙 See Category",
                    },
                    tap_target_configuration: {
                      title: " X ",
                      description: "bomboclard",
                      canonical_url: "https://rimuru.site",
                      domain: "shop.example.com",
                      button_index: 0,
                    },
                  }),
                  buttons: [
                    {
                      name: "",
                      buttonParamsJson: ""
                    },
                    {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                        display_text: "𐔌 Allmenu  𐦯",
                        id: `${prefix}allmenu`
                      })
                    },
                    {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                        display_text: "𐔌 Peraturan  𐦯",
                        id: `${prefix}rules`
                      })
                    },
                  ]
                }
              }
            }
          }
        }, { quoted: m, userJid: sock.user.jid });

        await sock.relayMessage(m.chat, msg6.message, {
          messageId: msg6.key.id,
        });
        break;
      }
      case 7: {
        function runtimeStr(seconds) {
          seconds = Number(seconds);
          const d = Math.floor(seconds / (3600 * 24));
          if (d > 0) return `${d} hari`;
          const h = Math.floor((seconds % (3600 * 24)) / 3600);
          if (h > 0) return `${h} jam`;
          const m = Math.floor((seconds % 3600) / 60);
          if (m > 0) return `${m} menit`;
          const s = Math.floor(seconds % 60);
          return `${s} detik`;
        }

        const toMathSansBold = (text) => {
          const chars = {
            A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠",
            N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭"
          };
          return text.toUpperCase().split("").map(c => chars[c] || c).join("");
        };

        const botName = config.bot?.name || "velyx store";
        const botModeLower = (config.mode || "public").toLowerCase();
        const botPrefix = config.command?.prefix || ".";
        const runTime = runtimeStr(process.uptime());

        const userName = m.pushName || "User";
        const userStatus = m.isPremium ? "premium" : "free";
        const userRole = m.isOwner ? "owner" : "user";
        const dbUser = db.getUser(m.sender);
        const userLimit = (dbUser?.limit === Infinity || dbUser?.limit === null || dbUser?.limit === undefined) ? "unlimited" : dbUser.limit;

        let case7Text = `Hey, *${m.pushName}*! ✨

I'm ${botName}, your intelligent assistant powered by ${config.bot?.developer}. Whether you need information, entertainment, or utilities, I'm always ready to help.

`

        case7Text += `╭╮ \`✯ ${toMathSansBold("BOT DETAIL")}\`\n`;
        case7Text += `││  name : ${botName}\n`;
        case7Text += `││  mode : ${botModeLower}\n`;
        case7Text += `││  prefix : \`${botPrefix}\`\n`;
        case7Text += `││  runtime : ${runTime}\n`;
        case7Text += `╰╯\n`;

        case7Text += `╭╮ \`❀ ${toMathSansBold("USER DETAIL")}\`\n`;
        case7Text += `││  name : _${userName}_\n`;
        case7Text += `││  status : ${userStatus}\n`;
        case7Text += `││  role : ${userRole}\n`;
        case7Text += `││  energi : ${userLimit}\n`;
        case7Text += `╰╯\n`;

        const readmore = String.fromCharCode(8206).repeat(4001);
        case7Text += readmore + "";
        case7Text += `╭╮ \`✧ ${toMathSansBold("MENU CATEGORY")}\`\n`;
        const { sorted } = getSortedCategories(m, botMode);
        for (const cat of sorted) {
          case7Text += `││  ▸ ${cat.cat.toLowerCase()} : ${cat.cmds.length} fitur\n`;
        }
        case7Text += `╰╯`;


        const { getAssetBuffer } = await import("../../src/lib/elaina-asset-manager.js");
        const imageBuffer = await getAssetBuffer("rimuru2");
        const sharp = (await import("sharp")).default;
        const stickerBuf = await sharp(imageBuffer).resize(512, 512).webp().toBuffer();

        const { prepareWAMessageMedia } = await import('@rexxhayanasi/elaina-baileys');
        const uploadMedia = await prepareWAMessageMedia({ image: stickerBuf }, { upload: sock.waUploadToServer });

        const fakeQuotedSticker = {
          key: {
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast"
          },
          message: {
            stickerMessage: {
              ...uploadMedia.imageMessage,
              mimetype: "image/webp"
            }
          }
        };

        const { generateWAMessageFromContent } = await import('@rexxhayanasi/elaina-baileys');
        const menuMedia = await prepareWAMessageMedia({
          image: await getAssetBuffer("rimuru")
        }, { upload: sock.waUploadToServer });

        const videoLive = await prepareWAMessageMedia({
          video: await getAssetBuffer("rimuru-mp4")
        }, { upload: sock.waUploadToServer });

        const msg = generateWAMessageFromContent(m.chat, {
          viewOnceMessage: {
            message: {
              messageContextInfo: {},
              interactiveMessage: {
                header: {
                  title: "",
                  subtitle: "",
                  hasMediaAttachment: true,
                  imageMessage: {
                    ...menuMedia.imageMessage,
                    contextInfo: {
                      pairedMediaType: 5,
                      statusSourceType: 0
                    }
                  }
                },
                body: { text: case7Text },
                footer: { text: `Use: ${m?.prefix}menucat <category>\n\nIf you have any questions, please contact the owner.` },
                contextInfo: {
                  mentionedJid: [m.sender],
                  isForwarded: true,
                  forwardingScore: 99
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: JSON.stringify({
                        display_text: "🥐 Contact Owner",
                        url: "http://wa.me/" + config.owner.number[0],
                        merchant_url: "http://wa.me/" + config.owner.number[0]
                      })
                    }
                  ]
                }
              }
            }
          }
        }, { quoted: fakeQuotedSticker, userJid: sock.user.jid });

        await sock.relayMessage(m.chat, msg.message, {
          messageId: msg.key.id,
        });

        await sock.relayMessage(m.chat, {
          videoMessage: {
            ...videoLive.videoMessage,
            contextInfo: {
              pairedMediaType: 6,
              statusSourceType: 0
            }
          },
          messageContextInfo: {
            messageAssociation: {
              associationType: 12,
              parentMessageKey: msg.key
            }
          }
        }, {});

        break;
      }
      case 8: {
        function runtimeStr(seconds) {
          seconds = Number(seconds);
          const d = Math.floor(seconds / (3600 * 24));
          if (d > 0) return `${d} hari`;
          const h = Math.floor((seconds % (3600 * 24)) / 3600);
          if (h > 0) return `${h} jam`;
          const m = Math.floor((seconds % 3600) / 60);
          if (m > 0) return `${m} menit`;
          const s = Math.floor(seconds % 60);
          return `${s} detik`;
        }

        const toMathSansBold = (text) => {
          const chars = {
            A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠",
            N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭"
          };
          return text.toUpperCase().split("").map(c => chars[c] || c).join("");
        };

        const botName = config.bot?.name || "velyx store";
        const botModeLower = (config.mode || "public").toLowerCase();
        const botPrefix = config.command?.prefix || ".";
        const runTime = runtimeStr(process.uptime());

        const userName = m.pushName || "User";
        const userStatus = m.isPremium ? "premium" : "free";
        const userRole = m.isOwner ? "owner" : "user";
        const dbUser = db.getUser(m.sender);
        const userLimit = (dbUser?.limit === Infinity || dbUser?.limit === null || dbUser?.limit === undefined) ? "unlimited" : dbUser.limit;

        const userLevel = dbUser?.level || 1;
        let userRank = "🛡️ Warrior";
        if (userLevel >= 10) userRank = "⭐ Elite";
        if (userLevel >= 20) userRank = "🎖️ Master";
        if (userLevel >= 40) userRank = "💪 Grandmaster";
        if (userLevel >= 60) userRank = "💜 Epic";
        if (userLevel >= 80) userRank = "⚔️ Legend";
        if (userLevel >= 100) userRank = "🐉 Mythic";

        const userJabatan = m.isOwner ? "[ Owner ]" : (m.isPremium ? "[ Premium ]" : "[ User ]");
        const userKoin = dbUser?.koin || 0;
        const userExp = dbUser?.exp || 0;
        const hariKe = dbUser?.activeDays || 0;

        let case7Text = `*YOUR STATUS*\n`;
        case7Text += `❑ Role: ${userJabatan}\n`;
        case7Text += `❑ Rank: ${userRank}\n`;
        case7Text += `❑ Level: ${userLevel}\n`;
        case7Text += `❑ Coin: ${userKoin}\n`;
        case7Text += `❑ Exp: ${userExp}\n`;
        case7Text += `❑ Energy: ${userLimit}\n\n`;
        case7Text += `Hello, my friend *"${m.pushName}"*!\nHow are you today? You're feeling well, right?\n\nYou've been online for *${hariKe} days*\n\n`;

        const readmore = String.fromCharCode(8206).repeat(4001);
        case7Text += readmore + "";

        const { sorted } = getSortedCategories(m, botMode);

        const catMap = {
          info: "INFO BOT",
          jadibot: "JADI BOT",
          economy: "EKONOMI",
          main: "MAIN MENU",
          owner: "OWNER MENU"
        };

        for (const cat of sorted) {
          const catName = catMap[cat.cat.toLowerCase()] || cat.cat.toUpperCase();
          case7Text += `*${catName}*\n`;
          for (const cmd of cat.cmds) {
            case7Text += `⇨ ${botPrefix}${cmd}\n`;
          }
          case7Text += `\n`;
        }
        case7Text = case7Text.trimEnd();

        const { getAssetBuffer } = await import("../../src/lib/elaina-asset-manager.js");
        const imageBuffer = await getAssetBuffer("rimuru");
        const favB = await getAssetBuffer("rimuru2");
        const sharp = (await import("sharp")).default;
        const thumbBuf = await sharp(imageBuffer).resize(1280, 720).jpeg().toBuffer();
        const favBuf = await sharp(favB).resize(512, 512).jpeg().toBuffer();

        const { prepareWAMessageMedia, generateWAMessageFromContent } = await import('@rexxhayanasi/elaina-baileys');
        const uploadMedia = await prepareWAMessageMedia({ image: thumbBuf }, { upload: sock.waUploadToServer, mediaTypeOverride: "thumbnail-link" });
        const uploadFav = await prepareWAMessageMedia({ image: favBuf }, { upload: sock.waUploadToServer, mediaTypeOverride: "thumbnail-link" });

        const randomTitles = [
          "Keep up the great work! 🌟",
          "Don't forget to smile today 😊",
          "Keep smiling and stay positive! ✨",
          "What a beautiful day to create something 💻",
          "Thank you for using this bot 🙏",
          "Hope you have a wonderful day! 🌸",
          "Don't forget to take a break 🍵",
          "Start your day with a positive mindset 😇"
        ];
        const randomTitle = randomTitles[Math.floor(Math.random() * randomTitles.length)];

        let cuacaStr = "Cerah";
        let suhuStr = "30°C";
        try {
          const { data } = await axios.get("https://wttr.in/Jakarta?format=%C|%t", { timeout: 3000 });
          if (data) {
            const parts = data.split('|');
            if (parts.length === 2) {
              cuacaStr = parts[0].trim();
              suhuStr = parts[1].trim();
            }
          }
        } catch (e) { }
        const displayWeather = `${cuacaStr} | ${suhuStr}`;
        const senderNum = m.sender.split('@')[0];

        const msg = generateWAMessageFromContent(m.chat, {
          extendedTextMessage: {
            text: config.info.website + " " + case7Text,
            matchedText: config.info.website,
            title: randomTitle,
            description: `Hey ${m.pushName}, My name is ${botName}!`,
            jpegThumbnail: uploadMedia.imageMessage.jpegThumbnail || thumbBuf,
            previewType: 1,
            thumbnailWidth: uploadMedia.imageMessage.width || 512,
            thumbnailHeight: uploadMedia.imageMessage.height || 512,
            thumbnailDirectPath: uploadMedia.imageMessage.directPath,
            thumbnailSha256: uploadMedia.imageMessage.fileSha256,
            thumbnailEncSha256: uploadMedia.imageMessage.fileEncSha256,
            mediaKey: uploadMedia.imageMessage.mediaKey,
            mediaKeyTimestamp: uploadMedia.imageMessage.mediaKeyTimestamp,
            faviconMMSMetadata: {
              thumbnailDirectPath: uploadFav.imageMessage.directPath,
              thumbnailSha256: uploadFav.imageMessage.fileSha256,
              thumbnailEncSha256: uploadFav.imageMessage.fileEncSha256,
              mediaKey: uploadFav.imageMessage.mediaKey,
              mediaKeyTimestamp: uploadFav.imageMessage.mediaKeyTimestamp,
              thumbnailHeight: uploadFav.imageMessage.height || 512,
              thumbnailWidth: uploadFav.imageMessage.width || 512
            },
            contextInfo: {
              mentionedJid: [m.sender],
              isForwarded: true,
              forwardingScore: 999,
              forwardedNewsletterMessageInfo: {
                newsletterJid: config.saluran.id,
                newsletterName: config.saluran.name
              }
            }
          }
        }, {
          quoted: {
            key: {
              fromMe: false,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast"
            },
            message: {
              contactMessage: {
                displayName: displayWeather,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${displayWeather}\nTEL;type=CELL;type=VOICE;waid=${senderNum}:+${senderNum}\nEND:VCARD`
              }
            }
          }
        });

        await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        break;
      }
      default:
        await m.reply(text);
    }
    const audioEnabled = db.setting("audioMenu") !== false;
    if (audioEnabled) {
      const audioUrl = botConfig.assets["rimuru-mp3"];
      try {
        switch (menuVariant) {
          case 1:
            try {
              const oggPath = await (async () => {
                const tempDir = path.join(process.cwd(), "temp");
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
                const destPath = path.join(tempDir, "menu_audio_hq_opus.ogg");
                if (fs.existsSync(destPath)) return destPath;
                const mp3Path = path.join(tempDir, "menu_audio.mp3");
                const res = await axios.get(audioUrl, { responseType: "arraybuffer" });
                fs.writeFileSync(mp3Path, Buffer.from(res.data));
                const { spawn } = await import("child_process");
                return new Promise((resolve, reject) => {
                  const ffmpeg = spawn("ffmpeg", ["-y", "-i", mp3Path, "-c:a", "libopus", "-b:a", "256k", "-vbr", "on", "-compression_level", "10", "-ac", "2", "-ar", "48000", destPath]);
                  ffmpeg.on("close", (code) => {
                    if (fs.existsSync(mp3Path)) fs.unlinkSync(mp3Path);
                    if (code === 0) resolve(destPath);
                    else reject(new Error("FFmpeg error"));
                  });
                  ffmpeg.on("error", (err) => {
                    if (fs.existsSync(mp3Path)) fs.unlinkSync(mp3Path);
                    reject(err);
                  });
                });
              })();
              await sock.sendMessage(m.chat, {
                audio: { url: oggPath },
                mimetype: "audio/ogg; codecs=opus",
                ptt: true,
              }, { quoted: m });
            } catch (err) {
              await sock.sendMessage(m.chat, {
                audio: { url: audioUrl },
                mimetype: "audio/mpeg",
                ptt: false,
              }, { quoted: m });
            }
            break;
          case 2: {
            const qpoll = {
              key: { participant: "0@s.whatsapp.net" },
              message: {
                pollCreationMessage: {
                  name: config.bot.name
                }
              }
            };
            try {
              const oggPath = await (async () => {
                const tempDir = path.join(process.cwd(), "temp");
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
                const destPath = path.join(tempDir, "menu_audio_hq_opus.ogg");
                if (fs.existsSync(destPath)) return destPath;
                const mp3Path = path.join(tempDir, "menu_audio.mp3");
                const res = await axios.get(audioUrl, { responseType: "arraybuffer" });
                fs.writeFileSync(mp3Path, Buffer.from(res.data));
                const { spawn } = await import("child_process");
                return new Promise((resolve, reject) => {
                  const ffmpeg = spawn("ffmpeg", ["-y", "-i", mp3Path, "-c:a", "libopus", "-b:a", "256k", "-vbr", "on", "-compression_level", "10", "-ac", "2", "-ar", "48000", destPath]);
                  ffmpeg.on("close", (code) => {
                    if (fs.existsSync(mp3Path)) fs.unlinkSync(mp3Path);
                    if (code === 0) resolve(destPath);
                    else reject(new Error("FFmpeg error"));
                  });
                  ffmpeg.on("error", (err) => {
                    if (fs.existsSync(mp3Path)) fs.unlinkSync(mp3Path);
                    reject(err);
                  });
                });
              })();
              await sock.sendMessage(m.chat, {
                audio: { url: oggPath },
                mimetype: "audio/ogg; codecs=opus",
                ptt: true,
              }, { quoted: qpoll });
            } catch (err) {
              await sock.sendMessage(m.chat, {
                audio: { url: audioUrl },
                mimetype: "audio/mpeg",
                ptt: false,
              }, { quoted: qpoll });
            }
            break;
          }
          case 3: {
            const qtext = {
              key: {
                fromMe: false,
                participant: m.sender,
              },
              message: {
                conversation: "setelin musiknya nya bang"
              }
            };
            await sock.sendMessage(m.chat, {
              audio: { url: audioUrl },
              mimetype: "audio/mpeg",
              ptt: false,
            }, { quoted: qtext });
            break;
          }
          case 7: {
            const qChannel = {
              key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: typeof saluranId !== "undefined" ? saluranId : "120363412350560864@newsletter",
              },
              message: {
                conversation: "🔊 Playing Audio Menu..."
              }
            };
            try {
              const oggPath = await (async () => {
                const tempDir = path.join(process.cwd(), "temp");
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
                const destPath = path.join(tempDir, "menu_audio_hq_opus.ogg");
                if (fs.existsSync(destPath)) return destPath;
                const { spawn } = await import("child_process");
                return new Promise((resolve, reject) => {
                  const ffmpeg = spawn("ffmpeg", ["-y", "-i", audioUrl, "-c:a", "libopus", "-b:a", "256k", "-vbr", "on", "-compression_level", "10", "-ac", "2", "-ar", "48000", destPath]);
                  ffmpeg.on("close", (code) => {
                    if (code === 0) resolve(destPath);
                    else reject(new Error("FFmpeg error"));
                  });
                  ffmpeg.on("error", (err) => {
                    reject(err);
                  });
                });
              })();
              await sock.sendMessage(m.chat, {
                audio: { url: oggPath },
                mimetype: "audio/ogg; codecs=opus",
                ptt: true,
              }, { quoted: qChannel });
            } catch (err) {
              await sock.sendMessage(m.chat, {
                audio: { url: audioUrl },
                mimetype: "audio/mpeg",
                ptt: false,
              }, { quoted: qChannel });
            }
            break;
          }
          case 4:
          default: {
            const ftroliQuoted = {
              key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast",
              },
              message: {
                orderMessage: {
                  orderId: "44444444444444",
                  thumbnail:
                    (thumbBuffer || imageBuffer ? await (await getSharp())(thumbBuffer || imageBuffer)
                      .resize({ width: 300, height: 300 })
                      .toBuffer() : null),
                  itemCount: totalCmds,
                  status: "INQUIRY",
                  surface: "CATALOG",
                  message: `★ ${config.bot.name}`,
                  orderTitle: `📋 ${totalCmds} Commands`,
                  sellerJid: botConfig.botNumber
                    ? `${botConfig.botNumber}@s.whatsapp.net`
                    : m.sender,
                  token: "rimuru-menu-v8",
                  totalAmount1000: 3333333,
                  totalCurrencyCode: "IDR",
                  contextInfo: {
                    isForwarded: true,
                    forwardingScore: 9,
                    forwardedNewsletterMessageInfo: {
                      newsletterJid: saluranId,
                      newsletterName: saluranName,
                      serverMessageId: 127,
                    },
                  },
                },
              },
            };
            try {
              await sock.sendMessage(
                m.chat,
                {
                  audio: { url: audioUrl },
                  mimetype: "audio/mpeg",
                },
                { quoted: ftroliQuoted },
              );
            } catch (ffmpegErr) {
              await sock.sendMessage(
                m.chat,
                {
                  audio: { url: audioUrl },
                  mimetype: "audio/mpeg",
                  contextInfo: getContextInfo(botConfig, m, thumbBuffer),
                },
                { quoted: getVerifiedQuoted(botConfig) },
              );
            }
            break;
          }
        }
      } catch (e) {
        console.error("[Menu] Error sending dynamic audio:", e.message);
      }
    }
  } catch (error) {
    console.error("[Menu] Error on command execution:", error.message);
  }
}
export { legacyMenuHandler };