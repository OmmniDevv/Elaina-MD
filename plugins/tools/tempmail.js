/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import { TempMailCreate, TempMailInbox } from "../../src/scraper/tempmail.js";

const pluginConfig = {
  name: "tempmail",
  alias: ["tmpmail", "tmp", "trashmail"],
  category: "tools",
  description: "Buat email sementara & cek inbox",
  usage: ".tempmail create/inbox",
  example: ".tempmail create",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m) {
  const db = getDatabase();
  const option = m.text?.toLowerCase()?.trim();

  if (!option) {
    const saved = db.getUser(m.sender)?.tempmail;
    return m.reply(
      `📧 *Temp Mail*\n\n` +
        `Buat email sementara yang bisa terima pesan — cocok buat daftar akun tanpa kasih email asli.\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}tempmail create* — Bikin email baru\n` +
        `> *${m.prefix}tempmail inbox* — Cek pesan masuk\n\n` +
        (saved
          ? `> Email aktif: *${saved}*\n`
          : `> Belum punya email, ketik *${m.prefix}tempmail create* dulu\n`) +
        `\n_Email ini bersifat sementara, bisa hilang kapan saja_`
    );
  }

  if (option === "create") {
    m.react("🕕");
    const result = await TempMailCreate();

    if (!result.status) {
      m.react("☢");
      return m.reply(`❌ *Gagal Bikin Email*\n\n> ${result.error}`);
    }

    const userData = db.getUser(m.sender) || {};
    userData.tempmail = result.email;
    db.setUser(m.sender, userData);

    m.react("✅");
    return m.reply(
      `📧 *Email Sementara Dibuat!*\n\n` +
        `> 📬 Email: *${result.email}*\n\n` +
        `Sekarang kamu bisa pakai email ini buat daftar apa aja.\n` +
        `Cek pesan masuk dengan *${m.prefix}tempmail inbox*\n\n` +
        `_Email ini sementara, jangan dipakai buat hal penting_`
    );
  }

  if (option === "inbox") {
    const saved = db.getUser(m.sender)?.tempmail;
    if (!saved) {
      m.react("❌");
      return m.reply(
        `❌ *Belum Ada Email*\n\n` +
          `Kamu belum bikin email sementara.\n` +
          `Ketik *${m.prefix}tempmail create* dulu.`
      );
    }

    m.react("🕕");
    const result = await TempMailInbox(saved);

    if (!result.status) {
      m.react("☢");
      return m.reply(`❌ *Gagal Cek Inbox*\n\n> ${result.error}`);
    }

    if (result.count === 0) {
      m.react("📭");
      return m.reply(
        `📭 *Inbox Kosong*\n\n` +
          `> Email: *${saved}*\n\n` +
          `Belum ada pesan masuk. Coba cek lagi nanti.`
      );
    }

    let txt = `📬 *Inbox — ${result.count} Pesan*\n\n`;
    txt += `> Email: *${saved}*\n\n`;

    for (const msg of result.messages) {
      txt += `*━━━━━━━━━━━━━━━━━━━━*\n`;
      txt += `> 📧 Dari: *${msg.from}*\n`;
      txt += `> 📌 Subjek: *${msg.subject}*\n`;
      txt += `> 🕐 ${msg.created_at}\n`;
      txt += `> 📝 ${msg.body_text?.substring(0, 500) || "(tidak ada isi)"}\n\n`;
    }

    m.react("✅");
    return m.reply(txt.trim());
  }

  return m.reply(
    `❌ *Opsi Tidak Valid*\n\n> Gunakan *${m.prefix}tempmail create* atau *${m.prefix}tempmail inbox*`
  );
}

export { pluginConfig as config, handler };
