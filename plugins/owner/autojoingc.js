/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from "../../config.js";
import { getDatabase } from "../../src/lib/elaina-database.js";
import te from "../../src/lib/elaina-error.js";
const pluginConfig = {
  name: "autojoingc",
  alias: ["autojoin", "autojoingroup"],
  category: "owner",
  description: "Auto join grup dari link yang terdeteksi di chat",
  usage: ".autojoingc on/off",
  example: ".autojoingc on",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};
const GROUP_LINK_REGEX = /chat\.whatsapp\.com\/([a-zA-Z0-9]{18,24})/gi;
async function handler(m) {
  const db = getDatabase();
  const arg = (m.args?.[0] || "").toLowerCase();
  if (!arg || !["on", "off"].includes(arg)) {
    const current = db.setting("autoJoinGc") || false;
    return m.reply(
      `🔗 *AUTO JOIN GROUP*\n\nStatus: *${current ? "ON ✅" : "OFF ❌"}*\n\n\`${m.prefix}autojoingc on\` — aktifkan\n\`${m.prefix}autojoingc off\` — nonaktifkan`,
    );
  }
  const enabled = arg === "on";
  db.setting("autoJoinGc", enabled);
  await db.save();
  m.reply(
    `${enabled ? "✅" : "❌"} Auto join group *${enabled ? "diaktifkan" : "dinonaktifkan"}*`,
  );
}
async function autoJoinDetector(m, sock) {
  const db = getDatabase();
  if (!db?.ready) return false;
  if (!db.setting("autoJoinGc")) return false;
  if (!m.body) return false;
  const matches = [...m.body.matchAll(GROUP_LINK_REGEX)];
  if (!matches.length) return false;
  let joined = 0;
  for (const match of matches) {
    const code = match[1];
    try {
      const result = await sock.groupAcceptInvite(code);
      if (result) {
        joined++;
      }
    } catch (e) {
      const msg = e.message || String(e);
      if (msg.includes("already") || msg.includes("participant")) {
        await m.reply(`⚠️ Sudah ada di grup tersebut`);
      } else if (msg.includes("expired") || msg.includes("revoked")) {
        await m.reply(`❌ Link grup sudah expired/revoked`);
      } else {
        await m.reply(te(m.prefix, m.command, m.pushName));
      }
    }
  }
  return joined > 0;
}
export { pluginConfig as config, handler, autoJoinDetector };
