/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import fs from "fs";
import te from "../../src/lib/elaina-error.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";
const pluginConfig = {
  name: "sewabot",
  alias: ["sewa"],
  category: "owner",
  description: "Toggle dan kelola sistem sewa bot",
  usage: ".sewabot <on/off/leave/status>",
  example: ".sewabot on",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};
const pendingConfirmations = new Map();
async function handler(m, { sock }) {
  const db = getDatabase();
  const args = m.text?.trim()?.toLowerCase();
  if (!db.db.data.sewa) {
    db.db.data.sewa = { enabled: false, groups: {} };
    db.db.write();
  }
  const currentStatus = db.db.data.sewa.enabled;
  const sewaGroups = Object.keys(db.db.data.sewa.groups || {});
  if (!args || args === "status") {
    return m.reply(
      `🔧 *SISTEM SEWA BOT*\n\n` +
        `Status: *${currentStatus ? "✅ AKTIF" : "❌ NONAKTIF"}*\n` +
        `Grup terdaftar: *${sewaGroups.length}*\n\n` +
        `*PERINTAH TERSEDIA:*\n` +
        `• *${m.prefix}sewabot on* — Aktifkan sistem sewa\n` +
        `• *${m.prefix}sewabot off* — Nonaktifkan sistem sewa\n` +
        `• *${m.prefix}sewabot leave* — Keluar dari semua grup non-whitelist\n\n` +
        `*KELOLA SEWA:*\n` +
        `• *${m.prefix}addsewa <link> <durasi>* — Tambah grup + auto join\n` +
        `• *${m.prefix}delsewa <link/id>* — Hapus grup dari whitelist\n` +
        `• *${m.prefix}renewsewa <link/id> <durasi>* — Perpanjang sewa\n` +
        `• *${m.prefix}listsewa* — Lihat semua grup terdaftar\n` +
        `• *${m.prefix}checksewa* — Cek sisa sewa (di grup)\n\n` +
        `*FORMAT DURASI:*\n` +
        `30i (menit) \u2022 12h (jam) \u2022 7d (hari) \u2022 1m (bulan) \u2022 1y (tahun) \u2022 lifetime\n\n` +
        `*CARA KERJA:*\n` +
        `1. Tambahkan grup dengan *${m.prefix}addsewa*\n` +
        `2. Bot otomatis join jika pakai link\n` +
        `3. Aktifkan dengan *${m.prefix}sewabot on*\n` +
        `4. Bot akan keluar dari semua grup yang tidak terdaftar\n` +
        `5. Sewa expired → bot otomatis keluar dari grup`,
    );
  }
  if (args === "off") {
    db.db.data.sewa.enabled = false;
    db.db.write();
    await m.react("✅");
    return m.reply(
      `✅ Sistem sewa dinonaktifkan\n\nBot tidak akan meninggalkan grup manapun.`,
    );
  }
  if (args === "on") {
    const pending = pendingConfirmations.get(m.sender);
    if (
      pending &&
      pending.type === "sewabot_on" &&
      Date.now() - pending.timestamp < 60000
    ) {
      return m.reply(
        `🕕 Sudah ada permintaan pending\n\nKetik *${m.prefix}sewabot confirm* untuk lanjut\nKetik *${m.prefix}sewabot cancel* untuk batal`,
      );
    }
    pendingConfirmations.set(m.sender, {
      type: "sewabot_on",
      timestamp: Date.now(),
    });
    setTimeout(() => {
      if (pendingConfirmations.get(m.sender)?.type === "sewabot_on")
        pendingConfirmations.delete(m.sender);
    }, 60000);
    return m.reply(
      `⚠️ *KONFIRMASI AKTIVASI SEWA*\n\n` +
        `Jika diaktifkan:\n` +
        `• ✅ ${sewaGroups.length} grup ter-whitelist tetap aman\n` +
        `• ❌ Semua grup lain akan ditinggalkan!\n\n` +
        `Ketik *${m.prefix}sewabot confirm* untuk lanjut\nKetik *${m.prefix}sewabot cancel* untuk batal\n\n` +
        `💡 Pastikan sudah whitelist grup penting dengan:\n*${m.prefix}addsewa <link grup> <durasi>*`,
    );
  }
  if (args === "confirm" || args === "yes" || args === "y") {
    const pending = pendingConfirmations.get(m.sender);
    if (!pending || pending.type !== "sewabot_on") {
      return m.reply(
        `❌ Tidak ada permintaan pending\nKetik *${m.prefix}sewabot on* dulu`,
      );
    }
    pendingConfirmations.delete(m.sender);
    db.db.data.sewa.enabled = true;
    db.db.write();
    await m.react("🕕");
    await m.reply(`🕕 Sistem sewa diaktifkan, memproses auto-leave...`);
    try {
      global.isFetchingGroups = true;
      const allGroups = await sock.groupFetchAllParticipating();
      global.isFetchingGroups = false;
      const allGroupIds = Object.keys(allGroups);
      const unlistedGroups = allGroupIds.filter(
        (id) => !sewaGroups.includes(id),
      );
      let leftCount = 0;
      let failedCount = 0;
      for (const groupId of unlistedGroups) {
        try {
          try {
            await sock.sendText(
              groupId,
              `⛔ Grup ini tidak terdaftar dalam sistem sewa.\nBot akan meninggalkan grup ini.\n\nHubungi owner untuk sewa bot.`,
              null,
              {
                contextInfo: saluranCtx(),
              },
            );
            await new Promise((r) => setTimeout(r, 2000));
          } catch (err) {
            // Abaikan error jika gagal mengirim pesan (misal grup dikunci admin)
          }

          await sock.groupLeave(groupId);
          leftCount++;
          await new Promise((r) => setTimeout(r, 3000));
        } catch {
          failedCount++;
        }
      }
      await m.react("✅");
      return m.reply(
        `✅ *SEWA BOT AKTIF*\n\n` +
          `Grup whitelist: *${sewaGroups.length}*\n` +
          `Keluar dari: *${leftCount}* grup\n` +
          `Gagal: *${failedCount}* grup`,
      );
    } catch (e) {
      await m.react("✅");
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  if (args === "leave") {
    if (!currentStatus)
      return m.reply(`❌ Aktifkan sewabot dulu dengan *${m.prefix}sewabot on*`);
    await m.react("🕕");
    await m.reply(`🕕 Mengambil daftar grup...`);
    global.sewaLeaving = true;
    try {
      global.isFetchingGroups = true;
      const allGroups = await sock.groupFetchAllParticipating();
      global.isFetchingGroups = false;
      const allGroupIds = Object.keys(allGroups);
      const unlistedGroups = allGroupIds.filter(
        (id) => !sewaGroups.includes(id),
      );
      if (unlistedGroups.length === 0) {
        delete global.sewaLeaving;
        await m.react("✅");
        return m.reply(`✅ Tidak ada grup yang perlu ditinggalkan`);
      }
      await m.reply(
        `📊 Total: ${allGroupIds.length} grup\nWhitelist: ${sewaGroups.length}\nAkan keluar dari: ${unlistedGroups.length} grup`,
      );
      let leftCount = 0;
      let failedCount = 0;
      for (const groupId of unlistedGroups) {
        try {
          try {
            await sock.sendText(
              groupId,
              `👋 Grup ini tidak terdaftar dalam sistem sewa.\nBot akan meninggalkan grup ini.\n\nHubungi owner untuk sewa bot.`,
              null,
              {
                contextInfo: saluranCtx(),
              },
            );
            await new Promise((r) => setTimeout(r, 3000));
          } catch (err) {
            // Abaikan error pesan agar bot tetap bisa keluar
          }

          await sock.groupLeave(groupId);
          leftCount++;
          await new Promise((r) => setTimeout(r, 5000));
        } catch {
          failedCount++;
        }
      }
      delete global.sewaLeaving;
      await m.react("✅");
      return m.reply(
        `✅ Selesai\n\nBerhasil keluar: *${leftCount}* grup\nGagal: *${failedCount}* grup`,
      );
    } catch (e) {
      delete global.sewaLeaving;
      await m.react("☢");
      await m.reply(te(m.prefix, m.command, m.pushName));
    }
  }
  if (args === "cancel" || args === "no" || args === "n") {
    const pending = pendingConfirmations.get(m.sender);
    if (!pending || pending.type !== "sewabot_on")
      return m.reply(`❌ Tidak ada permintaan pending`);
    pendingConfirmations.delete(m.sender);
    await m.react("❌");
    return m.reply(
      `❌ Aktivasi dibatalkan\nWhitelist grup dulu dengan *${m.prefix}addsewa*`,
    );
  }
  return m.reply(
    `❌ Perintah tidak valid\n\nKetik *${m.prefix}sewabot* untuk melihat panduan lengkap`,
  );
}
export { pluginConfig as config, handler, pendingConfirmations };
