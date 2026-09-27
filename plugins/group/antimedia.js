/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import config from "../../config.js";
const pluginConfig = {
  name: "antimedia",
  alias: ["am", "nomedia"],
  category: "group",
  description: "Mengatur antimedia di grup (blokir gambar/video/audio/dokumen)",
  usage: ".antimedia <on/off>",
  example: ".antimedia on",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  isAdmin: true,
  isBotAdmin: true,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

function gpMsg(key, replacements = {}) {
  const defaults = {
    antimedia: "⚠ *AntiMedia* — Media dari @%user% dihapus.",
  };
  let text = config.groupProtection?.[key] || defaults[key] || "";
  for (const [k, v] of Object.entries(replacements)) {
    text = text.replace(new RegExp(`%${k}%`, "g"), v);
  }
  return text;
}

async function checkAntimedia(m, sock, db) {
  if (!m.isGroup) return false;
  if (m.isAdmin || m.isOwner || m.fromMe) return false;

  const groupData = db.getGroup(m.chat) || {};
  if (!groupData.antimedia) return false;

  const isMedia =
    m.isImage || m.isVideo || m.isGif || m.isAudio || m.isDocument;
  if (!isMedia) return false;

  try {
    await sock.sendMessage(m.chat, { delete: m.key });
  } catch {}

  await sock.sendMessage(m.chat, {
    text: gpMsg("antimedia", { user: m.sender.split("@")[0] }),
    mentions: [m.sender],
  });

  return true;
}

async function handler(m, { sock }) {
  const db = getDatabase();
  const action = (m.args || [])[0]?.toLowerCase();
  const groupData = db.getGroup(m.chat) || {};

  if (!action) {
    const status = groupData.antimedia ? "✅ ON" : "❌ OFF";
    await m.reply(
      `🖼️ *AntiMedia*\n\n> Status: *${status}*\n\n> \`.antimedia on/off\``,
    );
    return;
  }

  if (action === "on") {
    db.setGroup(m.chat, { antimedia: true });
    m.react("✅");
    await m.reply(`✅ *AntiMedia diaktifkan*`);
    return;
  }

  if (action === "off") {
    db.setGroup(m.chat, { antimedia: false });
    m.react("❌");
    await m.reply(`❌ *AntiMedia dinonaktifkan*`);
    return;
  }

  await m.reply(`❌ Gunakan \`.antimedia on\` atau \`.antimedia off\``);
}

export { pluginConfig as config, handler, checkAntimedia };
