/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "antilinkall",
  alias: ["alall", "antialllink"],
  category: "group",
  description: "Anti semua jenis link (deteksi domain extension)",
  usage: ".antilinkall <on/off/metode> [kick/remove]",
  example: ".antilinkall on",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
  isAdmin: true,
  isBotAdmin: true,
};

function handler(m, { sock }) {
  const db = getDatabase();
  const option = m.text?.toLowerCase()?.trim();

  if (!option) {
    const groupData = db.getGroup(m.chat) || {};
    const status = groupData.antilinkall || "off";
    const mode = groupData.antilinkallMode || "remove";

    return m.reply(
      `🔗 *Antilink All*\n\n` +
        `> Status: *${status === "on" ? "Aktif ✅" : "Nonaktif ❌"}*\n` +
        `> Mode: *${mode.toUpperCase()}*\n\n` +
        `*DETEKSI:*\n` +
        `> • https:// / http:// (dengan protokol)\n` +
        `> • www. (subdomain)\n` +
        `> • Domain extension (.com, .id, .io, .net, dll)\n` +
        `> • Shortlink (bit.ly, t.me, tinyurl, dll)\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}antilinkall on* — Aktifkan\n` +
        `> *${m.prefix}antilinkall off* — Nonaktifkan\n` +
        `> *${m.prefix}antilinkall metode kick* — Mode kick user\n` +
        `> *${m.prefix}antilinkall metode remove* — Mode hapus pesan`
    );
  }

  if (option === "on") {
    db.setGroup(m.chat, { antilinkall: "on" });
    return m.reply(
      `✅ *Antilink All Aktif*\n\n` +
        `> Semua link akan dideteksi otomatis\n> Mendeteksi domain extension, bukan hanya http/https`
    );
  }

  if (option === "off") {
    db.setGroup(m.chat, { antilinkall: "off" });
    return m.reply(`❌ *Antilink All Nonaktif*\n\n> Link tidak akan difilter lagi`);
  }

  if (option.startsWith("metode")) {
    const method = m.args?.[1]?.toLowerCase();
    if (method === "kick") {
      db.setGroup(m.chat, { antilinkall: "on", antilinkallMode: "kick" });
      return m.reply(
        `✅ *Antilink All — Mode Kick*\n\n> User yang kirim link akan di-kick`
      );
    } else if (method === "remove" || method === "delete") {
      db.setGroup(m.chat, { antilinkall: "on", antilinkallMode: "remove" });
      return m.reply(
        `✅ *Antilink All — Mode Delete*\n\n> Pesan dengan link akan dihapus`
      );
    } else {
      return m.reply(
        `❌ *Metode Tidak Valid*\n\n> Gunakan *kick* atau *remove*\n> Contoh: *${m.prefix}antilinkall metode kick*`
      );
    }
  }

  if (option === "kick") {
    db.setGroup(m.chat, { antilinkall: "on", antilinkallMode: "kick" });
    return m.reply(
      `✅ *Antilink All — Mode Kick*\n\n> User yang kirim link akan di-kick`
    );
  }

  if (option === "remove" || option === "delete") {
    db.setGroup(m.chat, { antilinkall: "on", antilinkallMode: "remove" });
    return m.reply(
      `✅ *Antilink All — Mode Delete*\n\n> Pesan dengan link akan dihapus`
    );
  }

  return m.reply(
    `❌ *Opsi Tidak Valid*\n\n> Gunakan *on*, *off*, *metode kick*, atau *metode remove*`
  );
}

export { pluginConfig as config, handler };
