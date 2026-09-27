/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "rpg",
  alias: ["togglerpg"],
  category: "group",
  description: "Mengaktifkan atau menonaktifkan fitur RPG di grup",
  usage: ".rpg <on/off>",
  example: ".rpg on",
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
      `⚔️ *FITUR RPG GRUP*\n\n` +
        `Gunakan perintah ini untuk mengatur akses member ke fitur RPG.\n\n` +
        `• *${m.prefix}rpg on* - Member bisa main RPG\n` +
        `• *${m.prefix}rpg off* - Member tidak bisa main RPG\n\n` +
        `*Catatan:* Admin tetap bisa mengakses RPG meskipun dimatikan.`,
    );
  }

  const db = getDatabase();
  const group = db.getGroup(m.chat) || db.setGroup(m.chat);

  const isEnable = args === "on";

  if (group.rpg === isEnable) {
    return m.reply(`⚔️ Fitur RPG sudah *${isEnable ? "AKTIF" : "NONAKTIF"}* di grup ini.`);
  }

  group.rpg = isEnable;
  db.setGroup(m.chat, group);

  await m.react("✅");
  return m.reply(
    `✅ Berhasil *${isEnable ? "MENGAKTIFKAN" : "MENONAKTIFKAN"}* fitur RPG di grup ini!\n\n` +
    (isEnable
      ? `Member sekarang bisa menggunakan semua perintah di menu RPG.`
      : `Member tidak akan bisa menggunakan perintah RPG lagi.`),
  );
}

export { pluginConfig as config, handler };
