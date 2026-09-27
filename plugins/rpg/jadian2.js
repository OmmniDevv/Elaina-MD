/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { getDatabase } from "../../src/lib/elaina-database.js";

const kataTembak = [
  `Hai.

Aku mau jujur tentang sesuatu.

Selama ini aku merasa nyaman saat ngobrol dan menghabiskan waktu denganmu.

Aku punya perasaan lebih dari sekadar teman.

Jadi...

Maukah kamu menjadi pasanganku? ❤️`,

  `Aku tidak pandai merangkai kata.

Tapi aku ingin mengatakan apa yang sebenarnya aku rasakan.

Semakin lama mengenalmu, semakin aku sadar kalau kamu adalah orang yang spesial bagiku.

Karena itu aku memberanikan diri untuk bertanya.

Maukah kamu menjadi pasanganku? 💖`,

  `Awalnya aku menganggap kita hanya teman biasa.

Namun waktu membuat perasaanku berubah.

Kamu selalu berhasil membuat hariku terasa lebih baik.

Hari ini aku ingin jujur.

Aku menyukaimu.

Maukah kamu menjadi pasanganku? 🌹`,

  `Di setiap waktu yang kita lalui bersama, aku selalu menemukan alasan baru untuk mengagumimu.

Bukan karena kamu sempurna.

Tapi karena kamu adalah dirimu sendiri.

Aku tidak ingin terus menyimpan perasaan ini sendirian.

Maukah kamu menjadi pasanganku? ❤️`,

  `Mungkin ini terdengar tiba-tiba.

Tapi aku sudah cukup lama menyimpan perasaan ini.

Aku suka caramu berbicara.
Aku suka caramu bersikap.
Dan aku suka kehadiranmu.

Jadi hari ini aku memilih untuk jujur.

Maukah kamu menjadi pasanganku? 💕`,
];

const pluginConfig = {
  name: "tembak2",
  alias: ["terima2", "tolak2", "putus2", "pasangan2"],
  category: "rpg",
  description: "Fitur hubungan: tembak, terima, tolak, putus, dan cek pasangan",
  usage:
    ".tembak @tag\n.terima\n.tolak\n.putus\n.pasangan",
  example: ".tembak @6281234567890",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

function cleanJid(jid) {
  return String(jid || "").trim();
}

function numberOf(jid) {
  return cleanJid(jid).split("@")[0];
}

function getPending(user) {
  if (!user.rpg || typeof user.rpg !== "object") user.rpg = {};
  if (!user.rpg.tembak || typeof user.rpg.tembak !== "object") {
    user.rpg.tembak = null;
  }
  return user.rpg.tembak;
}

async function handler(m, { sock }) {
  const db = getDatabase();

  const user = db.getUser(m.sender) || db.setUser(m.sender);
  if (!user) return m.reply("❌ Data user kamu tidak tersedia.");

  const cmd = String(m.command || "").toLowerCase().replace(/2$/, "");

  if (cmd === "tembak") {
    const who = cleanJid(m.mentionedJid?.[0] || m.quoted?.sender);

    if (!who) return m.reply("Tag orang yang mau ditembak");
    if (who === m.sender) return m.reply("Ga bisa nembak diri sendiri 😅");

    const target = db.getUser(who);
    if (!target) return m.reply("Target tidak ditemukan");

    if (user.jadian) return m.reply("Kamu sudah punya pasangan 💔");
    if (target.jadian) return m.reply("Dia sudah punya pasangan 💔");

    // Simpan request di data user target, bukan global.db.
    // Dengan begitu tetap memakai database Rimuru dan ikut autosave.
    target.rpg = target.rpg || {};
    target.rpg.tembak = {
      from: m.sender,
      time: Date.now(),
    };
    db.setUser(who, target);
    db.save();

    const surat = kataTembak[Math.floor(Math.random() * kataTembak.length)];

    return m.reply(
      `💌 @${numberOf(m.sender)} menyatakan perasaannya kepada @${numberOf(who)}

${surat}

─────────────────

Ketik *.terima* untuk menerima
Ketik *.tolak* untuk menolak`,
      { mentions: [m.sender, who] },
    );
  }

  if (cmd === "terima") {
    const req = getPending(user);

    if (!req?.from) return m.reply("Tidak ada yang menembak kamu");

    const sender = db.getUser(req.from);

    if (!sender) {
      user.rpg.tembak = null;
      db.setUser(m.sender, user);
      db.save();
      return m.reply("Data pengirim tidak ditemukan");
    }

    if (sender.jadian) {
      user.rpg.tembak = null;
      db.setUser(m.sender, user);
      db.save();
      return m.reply("Dia sudah memiliki pasangan");
    }

    user.jadian = true;
    user.pasangan = req.from;
    user.pacar = req.from;
    user.jadianTime = Date.now();
    user.rpg.tembak = null;

    sender.jadian = true;
    sender.pasangan = m.sender;
    sender.pacar = m.sender;
    sender.jadianTime = Date.now();

    db.setUser(m.sender, user);
    db.setUser(req.from, sender);
    db.save();

    return m.reply(
      `🎉 Selamat!

❤️ @${numberOf(req.from)}
❤️ @${numberOf(m.sender)}

Kalian sekarang resmi berpacaran 💍`,
      { mentions: [req.from, m.sender] },
    );
  }

  if (cmd === "tolak") {
    const req = getPending(user);

    if (!req?.from) return m.reply("Tidak ada yang menembak kamu");

    user.rpg.tembak = null;
    db.setUser(m.sender, user);
    db.save();

    return m.reply(`💔 @${numberOf(req.from)} ditolak`, {
      mentions: [req.from],
    });
  }

  if (cmd === "putus") {
    if (!user.jadian || !user.pasangan) {
      return m.reply("Kamu sedang tidak memiliki pasangan");
    }

    const pasangan = user.pasangan;
    const target = db.getUser(pasangan);

    user.jadian = false;
    user.pasangan = "";
    user.pacar = "";
    user.jadianTime = 0;

    if (target) {
      target.jadian = false;
      target.pasangan = "";
      target.pacar = "";
      target.jadianTime = 0;
      db.setUser(pasangan, target);
    }

    db.setUser(m.sender, user);
    db.save();

    return m.reply(
      `💔 Hubungan @${numberOf(m.sender)} dan @${numberOf(pasangan)} telah berakhir.`,
      { mentions: [m.sender, pasangan] },
    );
  }

  if (cmd === "pasangan") {
    if (!user.jadian || !user.pasangan) {
      return m.reply("Kamu belum memiliki pasangan");
    }

    const waktu = Math.max(0, Date.now() - (user.jadianTime || Date.now()));
    const hari = Math.floor(waktu / 86400000);
    const jam = Math.floor(waktu / 3600000) % 24;
    const menit = Math.floor(waktu / 60000) % 60;

    return m.reply(
      `💖 *STATUS HUBUNGAN*

👤 Pasangan:
@${numberOf(user.pasangan)}

📅 Lama Jadian:
${hari} Hari ${jam} Jam ${menit} Menit`,
      { mentions: [user.pasangan] },
    );
  }
}

export { pluginConfig as config, handler };
