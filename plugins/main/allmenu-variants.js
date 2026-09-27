/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";
import {
  getCommandsByCategory,
  getCategories,
} from "../../src/lib/elaina-plugins.js";
import { getCasesByCategory } from "../../case/rimuru.js";
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@rexxhayanasi/elaina-baileys';
import { getTimeGreeting } from "../../src/lib/elaina-formatter.js";

const pluginConfig = {
  name: "allmenu",
  alias: ["fullmenu", "am", "allcommand", "semua"],
  category: "main",
  description: "Menampilkan All Menu dengan tampilan Rimuru MD",
  usage: ".allmenu",
  example: ".allmenu",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

// Mathematical Monospace characters: 𝙰𝙽𝙸𝚃𝙰
const MONO = {
  A: "𝙰", B: "𝙱", C: "𝙲", D: "𝙳", E: "𝙴", F: "𝙵", G: "𝙶", H: "𝙷", I: "𝙸", J: "𝙹", K: "𝙺", L: "𝙻", M: "𝙼",
  N: "𝙽", O: "𝙾", P: "𝙿", Q: "𝚀", R: "𝚁", S: "𝚂", T: "𝚃", U: "𝚄", V: "𝚅", W: "𝚆", X: "𝚇", Y: "𝚈", Z: "𝚉",
  a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑", i: "𝚒", j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖",
  n: "𝚗", o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝", u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣",
  "0": "𝟶", "1": "𝟷", "2": "𝟸", "3": "𝟹", "4": "𝟺", "5": "𝟻", "6": "𝟼", "7": "𝟽", "8": "𝟾", "9": "𝟿",
};
const mono = (value) => [...String(value)].map((c) => MONO[c] || c).join("");

const CATEGORY_ORDER = [
  "owner", "store", "main", "utility", "tools", "fun", "game", "rpg",
  "download", "search", "sticker", "media", "ai", "group", "anonymous",
  "pushkontak", "panel", "religi", "info", "cek", "economy", "user",
  "canvas", "random", "premium", "convert", "music", "maker",
];

const CATEGORY_NAMES = {
  owner: "OWNER MENU",
  store: "STORE MENU",
  main: "MAIN MENU",
  utility: "UTILITY MENU",
  tools: "TOOLS MENU",
  fun: "FUN MENU",
  game: "GAME MENU",
  rpg: "RPG MENU",
  download: "DOWNLOAD MENU",
  search: "SEARCH MENU",
  sticker: "STICKER MENU",
  media: "MEDIA MENU",
  ai: "AI MENU",
  group: "GROUP MENU",
  anonymous: "ANONYMOUS MENU",
  pushkontak: "PUSH MENU",
  panel: "CPANEL MENU",
  religi: "ISLAM MENU",
  info: "INFO MENU",
  cek: "CEK MENU",
  economy: "ECONOMY MENU",
  user: "USER MENU",
  canvas: "CANVAS MENU",
  random: "RANDOM MENU",
  premium: "PREMIUM MENU",
  convert: "CONVERT MENU",
  music: "MUSIC MENU",
  maker: "MAKER MENU",
};

function roleText(m) {
  if (m.isOwner) return "👑 Pemilik Bot";
  if (m.isPremium) return "💎 Premium Member";
  return "🌿 Free User";
}

function getCommands(categories, commandsByCategory, casesByCategory, botMode, isOwner) {
  const allowed = botMode === "cpanel"
    ? new Set(["main", "group", "sticker", "owner", "tools", "panel"])
    : botMode === "store"
      ? new Set(["main", "group", "sticker", "owner", "store"])
      : botMode === "pushkontak"
        ? new Set(["main", "group", "sticker", "owner", "pushkontak"])
        : null;
  const excluded = botMode === "md" ? new Set(["panel", "pushkontak", "store"]) : new Set();
  const ordered = [...categories].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.toLowerCase());
    const bi = CATEGORY_ORDER.indexOf(b.toLowerCase());
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
  });
  const result = [];
  for (const category of ordered) {
    const key = String(category).toLowerCase();
    if (key === "owner" && !isOwner) continue;
    if (allowed && !allowed.has(key)) continue;
    if (excluded.has(key)) continue;
    const pluginCmds = commandsByCategory[category] || [];
    const caseCmds = casesByCategory[category] || [];
    const cmds = [...pluginCmds, ...caseCmds];
    if (!cmds.length) continue;
    result.push({ category: key, commands: [...new Set(cmds.map(String))] });
  }
  return result;
}

function makeSection(title, commands) {
  let text = `◤─「 ${mono(title)} 」─✦\n`;
  for (const command of commands) {
    text += `│⟡ 〔 _${mono(command)}_\n`;
  }
  text += `◣──────────❈\n`;
  return text;
}

async function legacyAllMenuHandler(m, { sock, config: botConfig, db, uptime }) {
  const prefix = botConfig.command?.prefix || ".";
  const categories = getCategories();
  const commandsByCategory = getCommandsByCategory();
  const casesByCategory = getCasesByCategory();
  const groupData = m.isGroup ? db.getGroup(m.chat) || {} : {};
  const botMode = groupData.botMode || "md";
  const sections = getCommands(categories, commandsByCategory, casesByCategory, botMode, m.isOwner);

  let total = 0;
  for (const section of sections) total += section.commands.length;

  const pushName = m.pushName || "User";
  const botName = botConfig.bot?.name || "Rimuru MD";
  const version = botConfig.bot?.version || "11.0.0";
  const runtime = typeof uptime === "function" ? await uptime() : "-";
  const mode = botMode === "md" ? (botConfig.mode?.public ? "🌐 Public" : "🔒 Private") : botMode;

  let caption = `${mono(`Hai Kak ${pushName}`)} 🎗️\n\n`;
  caption += `◤───「 ${mono("INFO USER")} 」──✦\n`;
  caption += `> ⎆  [ ${mono("Nama")} : ${mono(pushName)}\n`;
  caption += `> ⎆  [ ${mono("Role")} : ${mono(roleText(m))}\n`;
  caption += `> ⎆  [ ${mono("Mode")} : ${mono(mode)}\n`;
  caption += `> ⎆  [ ${mono("Author")} : ${mono(botConfig.bot?.developer || "Anita Putri Azzahra")}\n`;
  caption += `◣──────────❈\n\n`;

  caption += `◤───「 ${mono("INFO BOT")} 」──✦\n`;
  caption += `> ⎆  ${mono("Runtime")} : ${mono(runtime)}\n`;
  caption += `> ⎆  ${mono("Versi")} : ${mono(version)}\n`;
  caption += `> ⎆  ${mono("Fitur")} : ${mono(`${total} commands`)}\n`;
  caption += `> ⎆  ${mono("Bot")} : ${mono(botName)}\n`;
  caption += `◣─────────────✦\n\n`;

  caption += `${mono("*_Jangan Di Spam Ya Agar Botnya Bisa Aktif 24 Jam Dan Tidak Terkena Blokir Spam🍁_*")}\n\n`;

  for (const section of sections) {
    caption += makeSection(CATEGORY_NAMES[section.category] || `${section.category.toUpperCase()} MENU`, section.commands.map((cmd) => `${prefix}${cmd}`));
  }

  await sock.sendMessage(
    m.chat,
    {
      image: getAssetBuffer("rimuru-v8"),
      caption,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
      },
    },
    { quoted: m },
  );
}


// V9: default AllMenu style adapted from the external AllMenu variant supplied by the user.
// This remains the fresh-install default while V1/V2/V5/V6 stay selectable.
async function externalDefaultAllMenuHandler(m, { sock, config: botConfig, db }) {
  const prefix = botConfig.command?.prefix || ".";
  const categories = getCategories();
  const commandsByCategory = getCommandsByCategory();
  const casesByCategory = getCasesByCategory();
  const groupData = m.isGroup ? db.getGroup(m.chat) || {} : {};
  const botMode = groupData.botMode || "md";

  const allowed = botMode === "cpanel"
    ? new Set(["main", "group", "sticker", "owner", "tools", "panel"])
    : botMode === "store"
      ? new Set(["main", "group", "sticker", "owner", "store"])
      : botMode === "pushkontak"
        ? new Set(["main", "group", "sticker", "owner", "pushkontak"])
        : null;
  const excluded = botMode === "md" ? new Set(["panel", "pushkontak", "store"]) : new Set();
  const order = [
    "owner", "main", "utility", "tools", "fun", "game", "download", "search",
    "sticker", "media", "ai", "group", "religi", "info", "cek", "economy",
    "user", "canvas", "random", "premium", "convert", "music", "maker"
  ];

  let lines = [];
  const sorted = [...categories].sort((a,b) => {
    const ai = order.indexOf(String(a).toLowerCase());
    const bi = order.indexOf(String(b).toLowerCase());
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
  });
  for (const category of sorted) {
    const key = String(category).toLowerCase();
    if (key === "owner" && !m.isOwner) continue;
    if (allowed && !allowed.has(key)) continue;
    if (excluded.has(key)) continue;
    const cmds = [
      ...(commandsByCategory[category] || []),
      ...(casesByCategory[category] || []),
    ];
    if (!cmds.length) continue;
    lines.push(`╭➤--「${key.toUpperCase()} MENU 」`);
    for (const cmd of [...new Set(cmds.map(String))]) lines.push(`┆ ⇝ ${prefix}${cmd}`);
    lines.push(`╰➤-------------------------------`, "");
  }

  const pushName = m.pushName || "User";
  const botName = botConfig.bot?.name || "Rimuru MD";
  const devName = botConfig.bot?.developer || "Anita Putri Azzahra";
  const total = sorted.reduce((n, category) => {
    const key = String(category).toLowerCase();
    if (key === "owner" && !m.isOwner) return n;
    if (allowed && !allowed.has(key)) return n;
    if (excluded.has(key)) return n;
    return n + (commandsByCategory[category] || []).length + (casesByCategory[category] || []).length;
  }, 0);
  const greeting = getTimeGreeting();
  const body = `> Halo *${pushName}* 👋 Perkenalkan aku *${botName}*, buatan *${devName}*. Saya siap membantu kebutuhanmu, mulai dari download video, main game, tanya jawab, nyari info/sesuatu, bikin sticker, dan lain-lain.\n\n`;
  const txt = `✦ *Informasi User*\n• Nama   : ${pushName}\n• Status : ${m.isOwner ? "Owner" : m.isPremium ? "Premium" : "User"}\n\n✦ *Informasi Bot*\n• Nama   : ${botName}\n• Fitur  : ${total} fitur\n\n${lines.join("\n")}`;

  const imageBuffer = getAssetBuffer("rimuru", botConfig.assets);
  if (!imageBuffer) {
    await m.reply(body + txt);
    return;
  }

  const media = await prepareWAMessageMedia({ image: imageBuffer }, { upload: sock.waUploadToServer });
  const message = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {},
        interactiveMessage: {
          header: { title: "", subtitle: "", hasMediaAttachment: true, imageMessage: media.imageMessage },
          body: { text: body },
          footer: { text: txt },
          contextInfo: {
            isForwarded: true,
            forwardingScore: 9,
            mentionedJid: [m.sender],
            forwardedNewsletterMessageInfo: {
              newsletterJid: botConfig.saluran?.id || "120363412350560864@newsletter",
              newsletterName: botConfig.saluran?.name || botName,
              serverMessageId: 127,
            },
          },
          nativeFlowMessage: {
            messageParamsJson: JSON.stringify({ limited_time_offer: { text: `${greeting}`, url: "Hai", expiration_time: Date.now() + 1000000 } }),
            buttons: [{
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({ display_text: "🍅 Kembali Ke Menu Utama", id: `${prefix}menu` }),
            }],
          },
        },
      },
    },
  }, { quoted: m, userJid: sock.user?.jid });

  await sock.relayMessage(m.chat, message.message, { messageId: message.key.id });
}

export { legacyAllMenuHandler, externalDefaultAllMenuHandler };