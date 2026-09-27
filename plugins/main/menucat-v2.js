/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";
import { getCommandsByCategory, getCategories } from "../../src/lib/elaina-plugins.js";
import { getCasesByCategory } from "../../case/rimuru.js";
import config from "../../config.js";

const pluginConfig = {
  name: "menucat",
  alias: ["mc", "category", "cat"],
  category: "main",
  description: "Menampilkan menu kategori dengan tampilan yang sama seperti AllMenu",
  usage: ".menucat <kategori>",
  example: ".menucat tools",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

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
  "canvas", "random", "premium", "convert", "music", "maker", "anime",
  "elaina",
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
  anime: "ANIME MENU",
  elaina: "ELAINA MENU",
};

function roleText(m) {
  if (m.isOwner) return "👑 Pemilik Bot";
  if (m.isPremium) return "💎 Premium Member";
  return "🌿 Free User";
}

function makeSection(title, commands) {
  let text = `◤─「 ${mono(title)} 」─✦\n`;
  for (const command of commands) text += `│⟡ 〔 _${mono(command)}_\n`;
  text += `◣──────────❈\n`;
  return text;
}

function normalizeCategory(category) {
  const input = String(category || "").toLowerCase();
  const categories = getCategories();
  return categories.find((c) => String(c).toLowerCase() === input) || null;
}

function getVisibleCategoryCommands(m, category, commandsByCategory, casesByCategory) {
  const key = String(category).toLowerCase();
  if (key === "owner" && !m.isOwner) return [];
  const pluginCmds = commandsByCategory[category] || commandsByCategory[key] || [];
  const caseCmds = casesByCategory[category] || casesByCategory[key] || [];
  return [...new Set([...pluginCmds, ...caseCmds].map(String))];
}

async function handler(m, { sock, config: botConfig, db, uptime }) {
  const prefix = botConfig.command?.prefix || config.command?.prefix || ".";
  const args = m.args || [];
  const categoryInput = args[0]?.toLowerCase();
  const categories = getCategories();
  const commandsByCategory = getCommandsByCategory();
  const casesByCategory = getCasesByCategory();

  if (!categoryInput) {
    const groupData = m.isGroup ? db.getGroup(m.chat) || {} : {};
    const botMode = groupData.botMode || "md";
    const excluded = botMode === "md" ? new Set(["panel", "pushkontak", "store"]) : new Set();
    const visible = [...categories]
      .filter((cat) => !excluded.has(String(cat).toLowerCase()))
      .filter((cat) => !(String(cat).toLowerCase() === "owner" && !m.isOwner))
      .filter((cat) => (commandsByCategory[cat] || []).length || (casesByCategory[cat] || []).length)
      .sort((a, b) => {
        const ai = CATEGORY_ORDER.indexOf(String(a).toLowerCase());
        const bi = CATEGORY_ORDER.indexOf(String(b).toLowerCase());
        return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
      });
    const text = `${mono("DAFTAR KATEGORI")}\n\n` + visible.map((cat) => `${mono(prefix + "menucat")} ${mono(cat)}`).join("\n");
    return m.reply(text);
  }

  const category = normalizeCategory(categoryInput);
  if (!category) return m.reply(`❌ Kategori *${categoryInput}* tidak ditemukan.`);

  const commands = getVisibleCategoryCommands(m, category, commandsByCategory, casesByCategory);
  if (!commands.length) return m.reply("❌ Tidak ada command pada kategori ini atau kategori tersebut tidak bisa diakses.");

  const pushName = m.pushName || "User";
  const botName = botConfig.bot?.name || "Rimuru MD";
  const version = botConfig.bot?.version || "11.0.0";
  const runtime = typeof uptime === "function" ? await uptime() : "-";
  const mode = m.isGroup ? ((db.getGroup(m.chat) || {}).botMode || "md") : "md";
  const categoryTitle = CATEGORY_NAMES[String(category).toLowerCase()] || `${String(category).toUpperCase()} MENU`;

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
  caption += `> ⎆  ${mono("Fitur")} : ${mono(`${commands.length} commands`)}\n`;
  caption += `> ⎆  ${mono("Bot")} : ${mono(botName)}\n`;
  caption += `◣─────────────✦\n\n`;
  caption += `${makeSection(categoryTitle, commands.map((cmd) => `${prefix}${cmd}`))}`;
  caption += `${mono("*_Jangan Di Spam Ya Agar Botnya Bisa Aktif 24 Jam Dan Tidak Terkena Blokir Spam🍁_*")}`;

  await sock.sendMessage(
    m.chat,
    {
      image: getAssetBuffer("rimuru-v8"),
      caption,
      contextInfo: { forwardingScore: 999, isForwarded: true },
    },
    { quoted: m },
  );
}

export { pluginConfig as config, handler };