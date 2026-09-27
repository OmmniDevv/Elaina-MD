/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-rioo-bridge.js";

const pluginConfig = {
  name: "rimuru-nguli",
  alias: ["nguli"],
  category: "economy",
  description: "Klaim upah nguli +10 limit dari Rimuru",
  usage: ".nguli",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 0,
  isEnabled: true,
};

async function handler(m) {
  const db = getDatabase();
  const user = db.getUser(m.sender) || db.setUser(m.sender, {});
  const now = Date.now();
  const last = Number(user.riooLastNguli || 0);
  const cooldown = 30 * 60 * 1000;
  if (now - last < cooldown) {
    const remain = Math.ceil((cooldown - (now - last)) / 60000);
    return m.reply(`⛏️ Kamu sudah mengambil upah nguli. Coba lagi sekitar ${remain} menit lagi.`);
  }
  user.limit = Number(user.limit || 0) + 10;
  user.riooLastNguli = now;
  return m.reply("⛏️ *Upah nguli diterima!*\n\n+10 limit");
}

export { pluginConfig as config, handler };
