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
  name: "autobio",
  alias: ["autostatus"],
  category: "owner",
  description: "Mengatur pembaruan bio WhatsApp bot secara otomatis",
  usage: ".autobio on/off\n.autobio <teks>",
  example: ".autobio on\n.autobio Bot by Owner | 🕒 {clock} | ⏳ {runtime}",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock, db }) {
  const arg = m.text?.trim();
  
  if (!arg) {
    const status = db.setting("autobio_status") || false;
    const text = db.setting("autobio_text") || "Bot aktif | 🕒 {clock} | ⏳ {runtime}";
    const intervalMs = db.setting("autobio_interval") || 60000;
    
    return m.reply(
      `📝 *AUTO BIO SETTINGS*\n\n` +
      `> Status: *${status ? "Aktif ✅" : "Nonaktif ❌"}*\n` +
      `> Interval: *${intervalMs / 1000} detik*\n` +
      `> Teks Bio: ${text}\n\n` +
      `*PENGGUNAAN:*\n` +
      `- *${m.prefix}autobio on/off* — Menyalakan/mematikan fitur\n` +
      `- *${m.prefix}autobio ganti_setiap <waktu>* — Mengatur interval. Contoh: \`.autobio ganti_setiap 30 detik\` atau \`1 jam\`\n` +
      `- *${m.prefix}autobio <teks>* — Mengatur teks bio\n\n` +
      `*PLACEHOLDER TERSEDIA:*\n` +
      `- \`{clock}\` — Menampilkan jam saat ini\n` +
      `- \`{runtime}\` — Menampilkan lama bot menyala\n` +
      `- \`{botname}\` — Menampilkan nama bot dari config\n` +
      `- \`{version}\` — Menampilkan versi bot`
    );
  }

  const option = arg.toLowerCase();
  
  if (option === "on") {
    db.setting("autobio_status", true);
    await m.react("✅");
    try {
      const { startAutoBioChecker } = await import("../../src/lib/elaina-scheduler.js");
      startAutoBioChecker(sock);
    } catch (e) {}
    return m.reply(`✅ *AUTO BIO DIAKTIFKAN*\n\nBio WhatsApp bot sekarang akan diperbarui secara otomatis setiap menit.`);
  }
  
  if (option === "off") {
    db.setting("autobio_status", false);
    await m.react("❌");
    return m.reply(`❌ *AUTO BIO DINONAKTIFKAN*\n\nBio WhatsApp bot tidak akan di-update lagi.`);
  }

  if (option.startsWith("ganti_setiap")) {
    const timeStr = arg.replace(/ganti_setiap/i, "").trim().toLowerCase();
    if (!timeStr) {
      return m.reply("❌ *Format Salah*\n\nContoh: `.autobio ganti_setiap 30 detik` atau `1 jam`");
    }

    let ms = 0;
    const value = parseInt(timeStr);
    if (isNaN(value)) {
      return m.reply("❌ *Format Salah*\n\nMasukkan angka yang valid. Contoh: `.autobio ganti_setiap 30 detik`");
    }

    if (timeStr.includes("d") || timeStr.includes("detik")) ms = value * 1000;
    else if (timeStr.includes("m") || timeStr.includes("menit")) ms = value * 60000;
    else if (timeStr.includes("j") || timeStr.includes("jam")) ms = value * 3600000;
    else ms = value * 60000; // default to minutes

    if (ms < 10000) {
      return m.reply("❌ *Gagal*\n\nInterval minimal adalah 10 detik agar tidak terkena spam dari server WhatsApp.");
    }

    db.setting("autobio_interval", ms);
    await m.react("✅");
    
    // Restart scheduler
    try {
      const { startAutoBioChecker } = await import("../../src/lib/elaina-scheduler.js");
      startAutoBioChecker(sock);
    } catch (e) {}

    return m.reply(`✅ *Interval Diubah*\n\nBio akan di-update otomatis setiap *${value} ${timeStr.replace(/[0-9\s]/g, "")}* (atau ${ms / 1000} detik).`);
  }

  db.setting("autobio_text", arg);
  await m.react("✅");
  
  // Restart scheduler to apply new text immediately
  try {
    const { startAutoBioChecker } = await import("../../src/lib/elaina-scheduler.js");
    startAutoBioChecker(sock);
  } catch (e) {}
  
  return m.reply(
    `✅ *TEKS BIO DIUBAH*\n\n` +
    `Format autobio yang baru telah disimpan:\n` +
    `> ${arg}`
  );
}

export { pluginConfig as config, handler };
