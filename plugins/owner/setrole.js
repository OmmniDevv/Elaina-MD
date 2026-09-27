/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "setrole",
  alias: ["setroleuser"],
  category: "owner",
  description: "Mengatur role/karakter hubungan user yang dipakai AutoAI",
  usage: ".setrole @user|role atau reply pesan",
  example: ".setrole @628xxx|teman",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { db }) {
  const target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  const raw = String(m.fullArgs || m.text || "").trim();
  const role = raw.includes("|") ? raw.split("|").slice(1).join("|").trim() : (m.args || []).join(" ").trim();
  if (!role) return m.reply(`🧠 *SET ROLE*\n\nReply/tag user lalu isi role.\nContoh: *${m.prefix}setrole @628xxx|sahabat*`);
  const database = db || getDatabase();
  const user = database.getUser(target) || database.setUser(target);
  user.role = role;
  database.save();
  return m.reply(`✅ Role user berhasil diubah menjadi: *${role}*`);
}

export { pluginConfig as config, handler };
