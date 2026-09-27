/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "onlygc",
  alias: ["onlygroup", "grouponly"],
  category: "owner",
  description: "Toggle mode bot hanya di grup",
  usage: ".onlygc on/off",
  example: ".onlygc on",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const option = m.text?.toLowerCase()?.trim();

  if (!option) {
    const current = db.setting("onlyGc") || false;
    return m.reply(
      `🏘️ *Only Group*\n\n` +
        `> Status: *${current ? "Aktif ✅" : "Nonaktif ❌"}*\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}onlygc on* — Bot hanya bisa diakses di grup\n` +
        `> *${m.prefix}onlygc off* — Bot bisa diakses di mana saja\n\n` +
        `_Jika aktif, mode Only Private akan otomatis nonaktif_`
    );
  }

  if (option === "on") {
    db.setting("onlyGc", true);
    db.setting("onlyPc", false);
    await m.react("✅");
    return m.reply(
      `🏘️ *Only Group Aktif*\n\n` +
        `> Bot hanya bisa diakses di grup\n` +
        `> Mode Only Private dinonaktifkan`
    );
  }

  if (option === "off") {
    db.setting("onlyGc", false);
    await m.react("❌");
    return m.reply(
      `🏘️ *Only Group Nonaktif*\n\n` +
        `> Bot bisa diakses di mana saja`
    );
  }

  return m.reply(
    `❌ *Opsi Tidak Valid*\n\n> Gunakan *${m.prefix}onlygc on* atau *${m.prefix}onlygc off*`
  );
}

export { pluginConfig as config, handler };
