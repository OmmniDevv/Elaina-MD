/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "game",
  alias: ["togglegame"],
  category: "group",
  description: "Mengaktifkan atau menonaktifkan fitur game di grup",
  usage: ".game <on/off>",
  example: ".game on",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  isAdmin: true,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const args = m.text?.trim()?.toLowerCase();

  if (args !== "on" && args !== "off") {
    return m.reply(
      `🎮 *FITUR GAME GRUP*\n\n` +
        `Gunakan perintah ini untuk mengatur akses member ke fitur game.\n\n` +
        `• *${m.prefix}game on* - Member bisa main game\n` +
        `• *${m.prefix}game off* - Member tidak bisa main game\n\n` +
        `*Catatan:* Admin tetap bisa mengakses game meskipun dimatikan.`,
    );
  }

  const db = getDatabase();
  const group = db.getGroup(m.chat) || db.setGroup(m.chat);

  const isEnable = args === "on";

  if (group.game === isEnable) {
    return m.reply(`🎮 Fitur game sudah *${isEnable ? "AKTIF" : "NONAKTIF"}* di grup ini.`);
  }

  group.game = isEnable;
  db.setGroup(m.chat, group);

  await m.react("✅");
  return m.reply(
    `✅ Berhasil *${isEnable ? "MENGAKTIFKAN" : "MENONAKTIFKAN"}* fitur game di grup ini!\n\n` +
    (isEnable
      ? `Member sekarang bisa menggunakan semua perintah di menu game.`
      : `Member tidak akan bisa menggunakan perintah game lagi.`),
  );
}

export { pluginConfig as config, handler };
