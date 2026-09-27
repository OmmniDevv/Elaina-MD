/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { performance } from "perf_hooks";
import { getDatabase } from "../src/lib/elaina-database.js";
import {
  getAllPlugins,
  getCommandsByCategory,
  getCategories,
  pluginStore,
} from "../src/lib/elaina-plugins.js";
import config from "../config.js";

function toSmallCaps(text) {
  const smallCapsMap = {
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
    .map((c) => smallCapsMap[c] || c)
    .join("");
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CATEGORY_EMOJIS = {
  owner: "👑",
  main: "🏠",
  utility: "🔧",
  fun: "🎮",
  group: "👥",
  download: "📥",
  search: "🔍",
  tools: "🛠️",
  sticker: "🖼️",
  ai: "🤖",
  game: "🎯",
  media: "🎬",
  info: "ℹ️",
  religi: "☪️",
  panel: "🖥️",
  user: "📊",
  linode: "☁️",
  random: "🎲",
  canvas: "🎨",
  vps: "🌊",
  store: "🏪",
  premium: "💎",
  convert: "🔄",
  economy: "💰",
};

async function handleCommand(m, sock) {
  try {
    if (!m.isCommand) return { handled: false };

    const command = m.command?.toLowerCase();
    if (!command) return { handled: false };

    const db = getDatabase();

    switch (command) {
      // Category: info
      case "cping":
      case "cspeed":
      case "clatency": {
        try {
          if (config.features?.autoTyping) {
            await sock.sendPresenceUpdate("composing", m.chat);
          }

          const start = performance.now();
          await m.react("🕕");

          const msgTimestamp = m.messageTimestamp
            ? m.messageTimestamp * 1000
            : Date.now();
          const latency = Math.max(1, Date.now() - msgTimestamp);

          const processTime = (performance.now() - start).toFixed(2);

          let pingStatus = "🟢 Excellent";
          if (latency > 100 && latency <= 300) pingStatus = "🟡 Good";
          else if (latency > 300) pingStatus = "🔴 Poor";

          const text =
            `⚡ *CASE SYSTEM PING*\n\n` +
            `╭┈┈⬡「 📊 *sᴛᴀᴛᴜs* 」\n` +
            `┃ ◦ Latency: *${latency}ms*\n` +
            `┃ ◦ Process: *${processTime}ms*\n` +
            `┃ ◦ Status: ${pingStatus}\n` +
            `╰┈┈⬡`;

          await m.reply(text);
          await m.react("✅");

          if (config.features?.autoTyping) {
            await sock.sendPresenceUpdate("paused", m.chat);
          }
        } catch (error) {
          console.error("[CPing] Error:", error);
          await m.react("❌");
          await m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> ${error.message}`);
        }
        return { handled: true };
      }

      case "lcase":
      case "caselist":
      case "allcase":
      case "listallcase": {
        try {
          if (config.features?.autoTyping) {
            await sock.sendPresenceUpdate("composing", m.chat);
          }

          await m.react("🔍");

          const casesByCategory = {
            info: ["cping", "listallcase", "listallplugin"],
          };

          const caseAliases = {
            cping: ["cspeed", "clatency"],
            listallcase: ["lcase", "caselist", "allcase"],
            listallplugin: ["lplugin", "pluginlist", "allplugin"],
          };

          let totalCases = 0;
          for (const cat in casesByCategory) {
            totalCases += casesByCategory[cat].length;
          }

          let text = `╔══════════════════╗\n`;
          text += `   📦 *${toSmallCaps("CASE LIST")}*\n`;
          text += `╚══════════════════╝\n\n`;
          text += `╭┈┈⬡「 📊 *ɪɴꜰᴏ* 」\n`;
          text += `┃ ◦ Total: *${totalCases}* cases\n`;
          text += `┃ ◦ Kategori: *${Object.keys(casesByCategory).length}*\n`;
          text += `╰┈┈⬡\n\n`;

          for (const category in casesByCategory) {
            const commands = casesByCategory[category];
            const emoji = CATEGORY_EMOJIS[category] || "📌";
            const categoryName = toSmallCaps(category);

            text += `╭┈┈⬡「 ${emoji} *${categoryName}* 」\n`;
            commands.forEach((cmd, i) => {
              const prefix = m.prefix || ".";
              const aliases = caseAliases[cmd]
                ? ` (${caseAliases[cmd].slice(0, 2).join(", ")})`
                : "";
              text += `┃ ${i + 1}. ${prefix}${cmd}${aliases}\n`;
            });
            text += `╰┈┈⬡\n\n`;
          }

          text += `*━━━━━━━━━━━━━━━*\n`;
          text += `💡 *ᴛɪᴘ:* Gunakan \`.listallplugin\` untuk melihat plugin`;

          await sock.sendMessage(
            m.chat,
            {
              text,
              contextInfo: {
                forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: "120363412350560864@newsletter",
                  newsletterName: "Rimuru Case System",
                  serverMessageId: 127,
                },
              },
            },
            { quoted: m },
          );

          await m.react("✅");

          if (config.features?.autoTyping) {
            await sock.sendPresenceUpdate("paused", m.chat);
          }
        } catch (error) {
          console.error("[ListAllCase] Error:", error);
          await m.react("❌");
          await m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> ${error.message}`);
        }
        return { handled: true };
      }

      case "lplugin":
      case "pluginlist":
      case "allplugin":
      case "listallplugin": {
        try {
          if (config.features?.autoTyping) {
            await sock.sendPresenceUpdate("composing", m.chat);
          }

          await m.react("🔍");

          const categories = getCategories();
          const commandsByCategory = getCommandsByCategory();

          let totalPlugins = 0;
          for (const category of categories) {
            totalPlugins += (commandsByCategory[category] || []).length;
          }

          if (totalPlugins === 0) {
            await m.reply("⚠️ *Belum ada plugin yang dimuat*");
            return { handled: true };
          }

          let text = `╔══════════════════╗\n`;
          text += `   🔌 *${toSmallCaps("PLUGIN LIST")}*\n`;
          text += `╚══════════════════╝\n\n`;
          text += `╭┈┈⬡「 📊 *ɪɴꜰᴏ* 」\n`;
          text += `┃ ◦ Total: *${totalPlugins}* plugins\n`;
          text += `┃ ◦ Kategori: *${categories.length}*\n`;
          text += `╰┈┈⬡\n\n`;

          for (const category of categories.sort()) {
            const commands = commandsByCategory[category] || [];
            if (commands.length === 0) continue;

            const emoji = CATEGORY_EMOJIS[category] || "📌";
            const categoryName = toSmallCaps(category);

            text += `╭┈┈⬡「 ${emoji} *${categoryName}* 」\n`;

            commands.sort().forEach((cmd, i) => {
              const plugin = pluginStore.commands.get(cmd);
              if (plugin && plugin.config) {
                const prefix = m.prefix || ".";
                const aliases = plugin.config.alias
                  ? ` (${plugin.config.alias.slice(0, 2).join(", ")})`
                  : "";
                text += `┃ ${i + 1}. ${prefix}${cmd}${aliases}\n`;
              }
            });

            text += `╰┈┈⬡\n\n`;
          }

          text += `*━━━━━━━━━━━━━━━*\n`;
          text += `💡 *ᴛɪᴘ:* Gunakan \`.listallcase\` untuk melihat case`;

          await sock.sendMessage(
            m.chat,
            {
              text,
              contextInfo: {
                forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: "120363412350560864@newsletter",
                  newsletterName: "Rimuru Plugin System",
                  serverMessageId: 127,
                },
              },
            },
            { quoted: m },
          );

          await m.react("✅");

          if (config.features?.autoTyping) {
            await sock.sendPresenceUpdate("paused", m.chat);
          }
        } catch (error) {
          console.error("[ListAllPlugin] Error:", error);
          await m.react("❌");
          await m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> ${error.message}`);
        }
        return { handled: true };
      }
      // End Category: info

      default:
        return { handled: false };
    }
  } catch (error) {
    console.error("[CaseHandler] Error:", error);
    try {
      await m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> ${error.message}`);
    } catch {}
    return { handled: true, error: error.message };
  }
}

function getCaseCommands() {
  return {
    info: ["cping", "listallcase", "listallplugin"],
  };
}

function getCaseCount() {
  const cases = getCaseCommands();
  let total = 0;
  for (const category in cases) {
    total += cases[category].length;
  }
  return total;
}

function getCaseCategories() {
  return Object.keys(getCaseCommands());
}

function getCasesByCategory() {
  return getCaseCommands();
}

export {
  handleCommand,
  getCaseCommands,
  getCaseCount,
  getCaseCategories,
  getCasesByCategory,
};
