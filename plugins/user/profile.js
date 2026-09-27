/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from "../../config.js";
import { getDatabase } from "../../src/lib/elaina-database.js";
import { getRole } from "./level.js";
import fs from "fs";
import { getDevice } from '@rexxhayanasi/elaina-baileys';

const pluginConfig = {
  name: "profile",
  alias: ["me", "profil", "myprofile", "my", "stats", "status"],
  category: "user",
  description: "Melihat profil user dengan RPG stats",
  usage: ".profile [@user]",
  example: ".profile",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

const EXP_PER_LEVEL = 10000;

function formatNumber(num) {
  return num?.toLocaleString("id-ID") || "0";
}

function getLevelBar(current, target) {
  const totalBars = 10;
  const filledBars = Math.min(
    Math.floor((current / target) * totalBars),
    totalBars,
  );
  const emptyBars = totalBars - filledBars;
  return "▰".repeat(filledBars) + "▱".repeat(emptyBars);
}

async function handler(m, { sock }) {
  const db = getDatabase();
  const target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;

  const user = db.getUser(target) || db.setUser(target);

  const isLid = target.endsWith('@lid');
  const isGroup = target.endsWith('@g.us');

  const resolvedJid = isLid && sock.getJid ? sock.getJid(target) : target;
  const phone = resolvedJid.split('@')[0].split(':')[0];
  const deviceId = m.quoted?.key?.id?.split('/')[0] || m.key?.id?.split('/')[0] || (resolvedJid.match(/:(\d+)@/) || [])[1] || null;

  const safe = async (fn) => {
    try { return await fn(); } catch { return null; }
  };

  const [
    onWa,
    ppUrl,
    statusRes,
    bizProfile,
    catalogRes,
    collections,
    lidFromJid,
    contactQuery,
    deviceInfo,
  ] = await Promise.all([
    safe(() => sock.onWhatsApp(phone)),
    safe(() => sock.profilePictureUrl(resolvedJid, 'image')),
    safe(() => sock.fetchStatus(resolvedJid)),
    safe(() => sock.getBusinessProfile(resolvedJid)),
    safe(() => sock.getCatalog({ jid: resolvedJid, limit: 5 })),
    safe(() => sock.getCollections(resolvedJid, 5)),
    safe(() => sock.getLidFromJid(resolvedJid)),
    safe(() => sock.getContact(resolvedJid)),
    safe(() => getDevice(resolvedJid, sock)),
  ]);

  const exists = onWa?.[0]?.exists ?? false;
  const canonicalJid = onWa?.[0]?.jid || resolvedJid;
  const lid = m.key?.participant || lidFromJid || onWa?.[0]?.lid || null;
  const isBot = deviceInfo?.isBot || contactQuery?.isBot || false;
  const statusObj = Array.isArray(statusRes) ? statusRes[0] : statusRes;
  const status = statusObj?.status?.status || statusObj?.status || null;
  const statusTs = statusObj?.status?.setAt || statusObj?.setAt || null;

  const isBiz = !!bizProfile && Object.keys(bizProfile).length > 0;
  const products = catalogRes?.products?.length || 0;
  const collectionsCount = collections?.collections?.length || 0;

  const fmtDate = (ts) => {
    if (!ts) return null;
    const d = ts instanceof Date ? ts : new Date(Number(ts) * (String(ts).length <= 10 ? 1000 : 1));
    return isNaN(d) ? null : d.toLocaleString('id-ID');
  };

  if (!user.rpg) user.rpg = {};
  const userExp = user.exp || 0;
  const userLevel = Math.floor(userExp / EXP_PER_LEVEL) + 1;
  user.rpg.level = userLevel;
  user.rpg.health = user.rpg.health || 100;
  user.rpg.maxHealth = 100 + (userLevel - 1) * 10;
  user.rpg.mana = user.rpg.mana || 100;
  user.rpg.maxMana = 100 + (userLevel - 1) * 5;
  user.rpg.stamina = user.rpg.stamina || 100;
  user.rpg.maxStamina = 100 + (userLevel - 1) * 5;

  const currentLevelExp = (userLevel - 1) * EXP_PER_LEVEL;
  const levelUpExp = userLevel * EXP_PER_LEVEL;
  const expInLevel = userExp - currentLevelExp;
  const expNeeded = levelUpExp - currentLevelExp;
  const role = getRole(userLevel);
  const isOwnerUser = config.isOwner(target);
  const isPremiumUser = config.isPremium(target);

  let ppMedia = null;
  try {
    const ppUrl = await sock.profilePictureUrl(target, "image");
    if (ppUrl) {
      ppMedia = { url: ppUrl };
    } else {
      throw new Error("No PP");
    }
  } catch {
    const fallbackUrl = config.assets["pp-kosong"];
    if (fallbackUrl) {
      ppMedia = { url: fallbackUrl };
    } else {
      ppMedia = { url: "https://i.imgur.com/TuItj4L.png" };
    }
  }

  let caption = `Halo kak @${phone}! 👋\n`;
  caption += `Ini adalah rincian lengkap dari profil, status, dan seluruh aset yang kakak miliki saat ini di dalam sistem bot:\n\n`;
  
  caption += `*〔 👤 INFORMASI PRIBADI 〕*\n`;
  caption += `- *Nama Asli:* ${user.name || m.pushName || "User"}\n`;
  if (user.isRegistered) {
      caption += `- *Nama Daftar:* ${user.regName} (${user.regAge} tahun, ${user.regGender})\n`;
  }
  caption += `- *Tag / Mention:* @${target.split("@")[0]}\n`;
  caption += `- *Status Akun:* ${isOwnerUser ? "👑 Owner" : isPremiumUser ? "💎 Premium" : "🆓 Free User"}\n`;
  if (user.isBanned) caption += `- *Banned:* 🚫 Ya (Tidak bisa akses fitur bot)\n`;
  if (user.registeredAt) {
      caption += `- *Tanggal Terdaftar:* ${new Date(user.registeredAt).toLocaleDateString("id-ID")}\n`;
  }
  if (user.clanId) caption += `- *Klan / Guild:* ${user.clanId}\n`;
  if (user.rpg && user.rpg.spouse) {
      caption += `- *Pasangan (Spouse):* @${user.rpg.spouse.split("@")[0]}\n`;
  }

  caption += `\n*〔 ⚔️ RPG STATS & LEVEL 〕*\n`;
  caption += `- *Role / Pangkat:* ${role}\n`;
  caption += `- *Level Saat Ini:* ${user.rpg.level}\n`;
  caption += `- *Total Exp:* ${formatNumber(userExp)} XP\n`;
  caption += `- *Kesehatan (Health):* ❤️ ${user.rpg.health} / ${user.rpg.maxHealth}\n`;
  caption += `- *Mana (Magic):* 💧 ${user.rpg.mana} / ${user.rpg.maxMana}\n`;
  caption += `- *Stamina:* ⚡ ${user.rpg.stamina} / ${user.rpg.maxStamina}\n`;
  caption += `- *Progress Ke Level ${user.rpg.level + 1}:*\n  ${getLevelBar(expInLevel, expNeeded)}\n  _${formatNumber(expInLevel)} / ${formatNumber(expNeeded)} XP_\n`;

  caption += `\n*〔 💰 ASET & KEUANGAN 〕*\n`;
  caption += `- *Koin Tunai:* 🪙 Rp ${user.koin?.toLocaleString("id-ID") || 0} _(Digunakan untuk fitur RPG)_\n`;
  caption += `- *Uang di Bank:* 🏦 Rp ${user.rpg?.bank?.toLocaleString("id-ID") || 0} _(Aman dari resiko perampokan)_\n`;
  caption += `- *Sisa Energi:* ⚡ ${isOwnerUser || isPremiumUser ? "∞ Tak Terbatas" : user.energi} _(Dibutuhkan setiap kali memakai command)_\n`;

  caption += `\n*〔 📱 WHATSAPP INFO 〕*\n`;
  caption += `- *Nomor:* +${phone}\n`;
  caption += `- *Eksistensi WA:* ${exists ? 'Ya' : 'Tidak'}\n`;
  caption += `- *JID:* ${canonicalJid}\n`;
  caption += `- *LID:* ${lid || '-'}\n`;
  caption += `- *Tipe:* ${isGroup ? 'Group' : (isLid ? 'LID' : 'S.WhatsApp.Net')}\n`;
  caption += `- *Bot WhatsApp:* ${isBot ? 'Ya' : 'Bukan'}\n`;
  caption += `- *Device ID:* ${deviceId || '-'}\n`;

  caption += `\n*〔 ℹ️ BIO & PROFILE 〕*\n`;
  caption += `- *Avatar:* ${ppUrl ? 'Ada' : 'Tidak Ada'}\n`;
  caption += `- *Bio:* ${status || '-'}\n`;
  caption += `- *Bio Set:* ${fmtDate(statusTs) || '-'}\n`;

  caption += `\n*〔 🏢 BUSINESS INFO 〕*\n`;
  caption += `- *Tipe Akun:* ${isBiz ? 'WhatsApp Business' : 'WhatsApp Biasa'}\n`;
  if (isBiz) {
    caption += `- *Deskripsi:* ${bizProfile.description || '-'}\n`;
    caption += `- *Website:* ${(bizProfile.website || []).join(', ') || '-'}\n`;
    caption += `- *Email:* ${bizProfile.email || '-'}\n`;
    caption += `- *Alamat:* ${bizProfile.address || '-'}\n`;
    caption += `- *Kategori:* ${(bizProfile.categories || []).map(c => c.name || c).join(', ') || '-'}\n`;
    caption += `- *Verified:* ${bizProfile.isProfileLinked ? 'Ya' : 'Tidak'}\n`;
    
    if (products > 0 || collectionsCount > 0) {
      caption += `\n*〔 🛍️ CATALOG 〕*\n`;
      caption += `- *Total Produk:* ${products}\n`;
      caption += `- *Koleksi:* ${collectionsCount}\n`;
    }
  }

  caption += `\n*〔 🤖 BOT VIEWPOINT 〕*\n`;
  caption += `- *Bot JID:* ${sock.user?.id || '-'}\n`;
  caption += `- *Bot Platform:* ${sock.authState?.creds?.platform || process.platform || '-'}\n`;
  caption += `- *Runtime:* Node ${process.version}\n`;

  if (user.inventory && Object.keys(user.inventory).length > 0) {
      const invItems = Object.entries(user.inventory).filter(([_, qty]) => qty > 0);
      if (invItems.length > 0) {
          caption += `\n*〔 🎒 ISI INVENTORY 〕*\n`;
          caption += `Barang-barang yang berhasil kakak kumpulkan:\n`;
          invItems.forEach(([item, qty]) => {
              caption += `- *${item.charAt(0).toUpperCase() + item.slice(1)}:* sejumlah ${qty} item\n`;
          });
      }
  }

  if (user.unlockedFeatures && user.unlockedFeatures.length > 0) {
      caption += `\n*〔 🔓 FITUR PREMIUM TERBUKA 〕*\n`;
      caption += `Fitur eksklusif yang sudah kakak beli secara permanen:\n`;
      user.unlockedFeatures.forEach(fitur => {
          caption += `- *${fitur}*\n`;
      });
  }

  const mentions = [target];
  if (user.rpg.spouse) mentions.push(user.rpg.spouse);

  const msgOptions = { caption, mentions };
  if (ppMedia) {
    msgOptions.image = ppMedia;
  }

  await sock.sendMessage(m.chat, msgOptions, { quoted: m });
}

export { pluginConfig as config, handler };
