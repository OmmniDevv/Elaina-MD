/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";
import { getCaseCommands } from "../../case/rimuru.js";
import fs from "fs";
import path from "path";
import config from "../../config.js";
import te from "../../src/lib/elaina-error.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginConfig = {
  name: "carifitur",
  alias: ["searchcmd", "findcmd", "cari", "search", "cf"],
  category: "main",
  description: "Mencari fitur berdasarkan keyword dengan detail lengkap",
  usage: ".carifitur <keyword>",
  example: ".carifitur sticker",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}
function getSimilarity(str1, str2) {
  if (typeof str1 !== "string" || typeof str2 !== "string") return 0;
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return (maxLen - distance) / maxLen;
}
function matchesKeyword(text, keyword) {
  if (!text || !keyword) return false;
  if (typeof text !== "string" || typeof keyword !== "string") return false;
  const textLower = text.toLowerCase();
  const keywordLower = keyword.toLowerCase();
  if (textLower.includes(keywordLower)) return true;
  if (keywordLower.includes(textLower)) return true;
  const words = textLower.split(/\s+/);
  for (const word of words) {
    if (word.includes(keywordLower) || keywordLower.includes(word)) return true;
  }
  const similarity = getSimilarity(textLower, keywordLower);
  if (similarity >= 0.6) return true;
  return false;
}
async function loadAllPlugins() {
  const plugins = [];
  const pluginsDir = path.join(__dirname, "..");
  try {
    const categories = fs.readdirSync(pluginsDir).filter((f) => {
      const stat = fs.statSync(path.join(pluginsDir, f));
      return stat.isDirectory();
    });
    for (const category of categories) {
      const categoryPath = path.join(pluginsDir, category);
      const files = fs
        .readdirSync(categoryPath)
        .filter((f) => f.endsWith(".js"));
      for (const file of files) {
        try {
          const plugin = await import(
            `file://${path.join(categoryPath, file).replace(/\\/g, "/")}`
          );
          if (plugin.config && plugin.config.name) {
            plugins.push({
              name: Array.isArray(plugin.config.name)
                ? plugin.config.name[0]
                : plugin.config.name,
              alias: plugin.config.alias || [],
              category: plugin.config.category || category,
              description: plugin.config.description || "Tidak ada deskripsi",
              usage: plugin.config.usage || "",
              example: plugin.config.example || "",
              isEnabled: plugin.config.isEnabled !== false,
              isPremium: plugin.config.isPremium || false,
              isOwner: plugin.config.isOwner || false,
              cooldown: plugin.config.cooldown || 0,
              energi: plugin.config.energi || 0,
              isCase: false,
            });
          }
        } catch { }
      }
    }
  } catch { }
  try {
    const caseCommands = getCaseCommands();
    const caseAliases = {
      cping: ["cspeed", "clatency"],
      listallcase: ["lcase", "caselist", "allcase"],
      listallplugin: ["lplugin", "pluginlist", "allplugin"],
    };
    const caseDescriptions = {
      cping: "Cek ping case system",
      listallcase: "Lihat daftar semua case commands",
      listallplugin: "Lihat daftar semua plugin commands",
    };
    for (const [category, commands] of Object.entries(caseCommands)) {
      for (const cmd of commands) {
        plugins.push({
          name: cmd,
          alias: caseAliases[cmd] || [],
          category: category,
          description: caseDescriptions[cmd] || "Case command",
          usage: `.${cmd}`,
          example: `.${cmd}`,
          isEnabled: true,
          isPremium: false,
          isOwner: false,
          cooldown: 5,
          energi: 0,
          isCase: true,
        });
      }
    }
  } catch { }
  return plugins;
}
async function handler(m, { sock }) {
  const keyword = m.text;
  if (!keyword) {
    return m.reply(
      `🔍 *ᴄᴀʀɪ ꜰɪᴛᴜʀ*\n\n` +
      `╭┈┈⬡「 📋 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ* 」\n` +
      `┃ \`${m.prefix}carifitur <keyword>\`\n` +
      `╰┈┈⬡\n\n` +
      `> Contoh:\n` +
      `\`${m.prefix}carifitur sticker\`\n` +
      `\`${m.prefix}carifitur download\`\n` +
      `\`${m.prefix}carifitur game\``,
    );
  }
  m.react("🕕");
  try {
    const allPlugins = await loadAllPlugins();
    const matches = [];
    for (const plugin of allPlugins) {
      if (!plugin.isEnabled) continue;
      let isMatch = false;
      let matchScore = 0;
      let matchReason = "";
      if (matchesKeyword(plugin.name, keyword)) {
        isMatch = true;
        matchScore = Math.max(
          matchScore,
          getSimilarity(plugin.name, keyword) * 1.2,
        );
        matchReason = "nama";
      }
      for (const alias of plugin.alias) {
        if (matchesKeyword(alias, keyword)) {
          isMatch = true;
          matchScore = Math.max(
            matchScore,
            getSimilarity(alias, keyword) * 1.1,
          );
          matchReason = matchReason || "alias";
        }
      }
      if (matchesKeyword(plugin.description, keyword)) {
        isMatch = true;
        matchScore = Math.max(
          matchScore,
          getSimilarity(plugin.description, keyword) * 0.8,
        );
        matchReason = matchReason || "deskripsi";
      }
      if (matchesKeyword(plugin.category, keyword)) {
        isMatch = true;
        matchScore = Math.max(
          matchScore,
          getSimilarity(plugin.category, keyword) * 0.7,
        );
        matchReason = matchReason || "kategori";
      }
      if (isMatch) {
        matches.push({ ...plugin, score: matchScore, matchReason });
      }
    }
    matches.sort((a, b) => b.score - a.score);
    if (matches.length === 0) {
      m.react("❌");
      return m.reply(
        `🔍 *ʜᴀsɪʟ ᴘᴇɴᴄᴀʀɪᴀɴ*\n\n> Tidak ditemukan fitur dengan keyword \`${keyword}\``,
      );
    }
    const saluranId = config.saluran?.id || "120363412350560864@newsletter";
    const saluranName = config.saluran?.name || config.bot?.name || "Rimuru-AI";
    let text = `🔍 *ʜᴀsɪʟ ᴘᴇɴᴄᴀʀɪᴀɴ: "${keyword}"*\n`;
    text += `> Ditemukan *${matches.length}* fitur\n`;
    text += `> Pilih salah satu command di bawah:\n\n`;
    const topMatches = matches.slice(0, 15);
    for (let i = 0; i < Math.min(5, topMatches.length); i++) {
      const p = topMatches[i];
      const badges = [];
      if (p.isPremium) badges.push("💎");
      if (p.isOwner) badges.push("👑");
      text += `*${i + 1}. ${m.prefix}${p.name}* ${badges.join("")}\n`;
      text += `📁 Kategori: \`${p.category}\`\n`;
      text += `📝 ${p.description.slice(0, 50)}${p.description.length > 50 ? "..." : ""}\n`;
      if (p.usage) text += `💡 Usage: \`${p.usage}\`\n`;
      if (p.cooldown > 0) text += `⏱️ Cooldown: ${p.cooldown}s\n`;
      text += `\n`;
    }
    if (topMatches.length > 5) {
      text += `_+${topMatches.length - 5} hasil lainnya tersedia_`;
    }
    const buttons = topMatches.slice(0, 10).map((p, i) => ({
      title: `${m.prefix}${p.name}`,
      description: `${p.category} • ${p.description.slice(0, 40)}`,
      id: `${m.prefix}${p.name}`,
    }));
    m.react("✅");
    await sock.sendButton(
      m.chat,
      getAssetBuffer("rimuru"),
      text,
      m,
      {
        buttons: [
          {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              title: "📋 Pilih Command",
              sections: [
                {
                  title: `Hasil untuk "${keyword}"`,
                  rows: buttons,
                },
              ],
            }),
          },
        ],
      },
    );
  } catch (error) {
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}
export { pluginConfig as config, handler };
