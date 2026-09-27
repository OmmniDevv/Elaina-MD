/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "transfer",
  alias: ["tf", "kirim", "pay"],
  category: "rpg",
  description: "Transfer uang atau item ke user lain",
  usage: ".transfer <money/nama_item> <jumlah> @user",
  example: ".transfer money 10000 @tag",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

function handler(m, { sock }) {
  const db = getDatabase();
  const sender = db.getUser(m.sender);

  const args = m.args || [];
  if (args.length < 3) {
    let txt = `🏦 *BANK SENTRAL RPG* 🏦\n\n`;
    txt += `Layanan pengiriman Koin & Barang Antar-Player!\n\n`;
    txt += `*Format Pengiriman:*\n`;
    txt += `👉 \`.transfer money 10000 @user\` (Untuk Koin)\n`;
    txt += `👉 \`.transfer potion 5 @user\` (Untuk Item)\n`;
    return m.reply(txt);
  }

  const type = args[0].toLowerCase();
  const amount = parseInt(args[1]);
  const target = m.mentionedJid?.[0] || m.quoted?.sender;

  if (!target) {
    return m.reply(`Alamat paket nggak jelas bos! Tag dulu user yang mau dikirimin! 📦🔍`);
  }

  if (target === m.sender) {
    return m.reply(`Ngapain transfer ke kantong sendiri? Kurang kerjaan lu ya! 😂❌`);
  }

  if (!amount || amount <= 0) {
    return m.reply(`Woy bos! Mau kirim angin doang? Jumlahnya harus lebih dari *0*! 🌬️`);
  }

  const recipient = db.getUser(target) || db.setUser(target);

  if (type === "money" || type === "balance" || type === "koin") {
    if ((sender.koin || 0) < amount) {
      return m.reply(`Transaksi DITOLAK! ❌\nSaldo ATM lu nggak cukup. Saldo: *Rp ${(sender.koin || 0).toLocaleString("id-ID")}* | Mau TF: *Rp ${amount.toLocaleString("id-ID")}* 💸`);
    }

    sender.koin -= amount;
    recipient.koin = (recipient.koin || 0) + amount;

    db.setUser(m.sender, sender);
    db.setUser(target, recipient);
    db.save();
    
    let txt = `💸 *TRANSFER BERHASIL!* 💸\n\n`;
    txt += `Bank Sentral telah mengirim dana:\n`;
    txt += `💳 Nominal: *Rp ${amount.toLocaleString("id-ID")}*\n`;
    txt += `👤 Penerima: @${target.split("@")[0]}\n\n`;
    txt += `> _"Terima kasih telah menggunakan layanan Bank Bot!"_ 🏦✨`;

    return m.reply(txt, { mentions: [target] });
  } else {
    sender.inventory = sender.inventory || {};
    recipient.inventory = recipient.inventory || {};

    if ((sender.inventory[type] || 0) < amount) {
      return m.reply(`Paket gagal diproses! ❌\nBarang *${type}* di gudang lu cuma ada *${sender.inventory[type] || 0}* pcs. Lu mau ngirim *${amount}* darimana? 📦`);
    }

    sender.inventory[type] -= amount;
    recipient.inventory[type] = (recipient.inventory[type] || 0) + amount;

    db.setUser(m.sender, sender);
    db.setUser(target, recipient);
    db.save();

    let txt = `📦 *PAKET TELAH SAMPAI!* 📦\n\n`;
    txt += `Kurir berhasil mengantarkan barang:\n`;
    txt += `🎁 Isi Paket: *${type}* (x${amount})\n`;
    txt += `👤 Penerima: @${target.split("@")[0]}\n\n`;
    txt += `> _"Paket Pakeeetttt!!" - Kurir Bot_ 🛵💨`;

    return m.reply(txt, { mentions: [target] });
  }
}

export { pluginConfig as config, handler };
