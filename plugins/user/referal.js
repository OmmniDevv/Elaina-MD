/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import crypto from "crypto";
import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "referal",
  alias: ["referral", "refer", "ref"],
  category: "user",
  description: "Sistem kode referral untuk mendapatkan EXP",
  usage: ".referal [kode]",
  example: ".referal atau .referal ABC123XYZ",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

const XP_FIRST = 2500;
const XP_OWNER = 15000;
const BONUS = {
  5: 40000,
  10: 100000,
  20: 250000,
  50: 1000000,
  100: 10000000,
};

function makeCode() {
  return crypto.randomBytes(6).toString("hex").toUpperCase();
}

function getBotNumber(sock) {
  return String(sock?.user?.id || "")
    .split(":")[0]
    .replace(/[^0-9]/g, "");
}

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender) || db.setUser(m.sender);
  if (!user) return m.reply("❌ Data user tidak dapat dibuat.");

  user.refCode ??= makeCode();
  user.refCount ??= 0;
  user.refUsed ??= false;
  db.setUser(m.sender, user);

  const code = String(m.args?.[0] || "").trim();

  if (code) {
    if (user.refUsed) {
      return m.reply("❌ Kamu sudah pernah menggunakan kode referral.");
    }

    const cleanCode = code.toUpperCase();
    const entries = Object.entries(db.data.users || {});
    const ownerEntry = entries.find(
      ([, u]) => String(u?.refCode || "").toUpperCase() === cleanCode,
    );

    if (!ownerEntry) {
      return m.reply("❌ Kode referral tidak valid.");
    }

    const [ownerJid, owner] = ownerEntry;
    const senderJid = String(m.sender).replace(/@.+/g, "");
    if (ownerJid === senderJid) {
      return m.reply("❌ Kamu tidak bisa memakai kode referral milik sendiri.");
    }

    const ownerUser = db.getUser(ownerJid) || db.setUser(ownerJid);
    if (!ownerUser) return m.reply("❌ Data pemilik referral tidak ditemukan.");

    ownerUser.refCount = Number(ownerUser.refCount || 0) + 1;
    const bonus = BONUS[ownerUser.refCount] || 0;

    db.updateExp(ownerJid, XP_OWNER + bonus);
    db.updateExp(m.sender, XP_FIRST);

    user.refUsed = true;
    db.setUser(m.sender, user);
    db.save();

    return m.reply(
      `🎉 *Referral berhasil digunakan!*\n\n` +
      `👤 Kamu: +${XP_FIRST.toLocaleString("id-ID")} EXP\n` +
      `👑 Pemilik kode: +${(XP_OWNER + bonus).toLocaleString("id-ID")} EXP\n\n` +
      `Total referral pemilik: *${ownerUser.refCount}*`,
    );
  }

  const botNumber = getBotNumber(sock);
  const link = botNumber
    ? `https://wa.me/${botNumber}?text=${encodeURIComponent(
        `${m.prefix}referal ${user.refCode}`,
      )}`
    : null;

  return m.reply(
    `🎁 *REFERRAL RIMURU*\n\n` +
      `Kode kamu: *${user.refCode}*\n` +
      `Sudah dipakai: *${user.refCount} orang*\n\n` +
      `💎 Hadiah pengguna baru: *+${XP_FIRST.toLocaleString("id-ID")} EXP*\n` +
      `👑 Hadiah pemilik kode: *+${XP_OWNER.toLocaleString("id-ID")} EXP*` +
      (link ? `\n\n🔗 Link referral:\n${link}` : ""),
  );
}

export { pluginConfig as config, handler };
