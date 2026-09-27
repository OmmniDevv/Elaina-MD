/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "bank",
  alias: ["atm", "nabung", "deposit", "tarik", "withdraw"],
  category: "rpg",
  description: "Bank system untuk menyimpan uang aman dari rampok",
  usage: ".bank <deposit/withdraw> <jumlah>",
  example: ".bank deposit 10000",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const cleanJid = m.sender.replace(/@.+/g, "");

  let user = db.getUser(m.sender);
  if (!user) {
    user = db.setUser(m.sender, {});
  }

  if (!db.db.data.users[cleanJid].rpg) {
    db.db.data.users[cleanJid].rpg = {};
  }
  if (typeof db.db.data.users[cleanJid].rpg.bank !== "number") {
    db.db.data.users[cleanJid].rpg.bank = 0;
  }

  const currentBalance = db.db.data.users[cleanJid].koin || 0;
  const currentBank = db.db.data.users[cleanJid].rpg.bank || 0;

  const args = m.args || [];
  const action = args[0]?.toLowerCase();
  const amountStr = args[1];

  if (action === "deposit" || action === "depo") {
    let amount = 0;
    if (amountStr === "all") {
      amount = currentBalance;
    } else {
      amount = parseInt(amountStr);
    }

    if (!amount || amount <= 0) return m.reply(`Hayo kak, masukin jumlah koin yang bener dong! Masa nabung angka gaib 😂💸`);
    if (currentBalance < amount) return m.reply(`Eits, uang *cash* kamu nggak cukup kak! 😭\nDi dompet cuma ada *Rp ${currentBalance.toLocaleString("id-ID")}* nih. Nyari duit dulu gih! 🏃💨`);

    db.db.data.users[cleanJid].koin = currentBalance - amount;
    db.db.data.users[cleanJid].rpg.bank = currentBank + amount;

    await db.save();

    const newBank = db.db.data.users[cleanJid].rpg.bank;
    return m.reply(`Makasih kak udah nabung di Bank RPG! 🏦💖\n\n✅ Deposit berhasil: *Rp ${amount.toLocaleString("id-ID")}*\n💳 Saldo Tabungan: *Rp ${newBank.toLocaleString("id-ID")}*\n\nUangnya kita simpen dengan aman ya! 🔒✨`);
  }

  if (action === "withdraw" || action === "tarik") {
    let amount = 0;
    if (amountStr === "all") {
      amount = currentBank;
    } else {
      amount = parseInt(amountStr);
    }

    if (!amount || amount <= 0) return m.reply(`Hayo kak, masukin jumlah koin yang bener dong! Mau narik angin? 😂💸`);
    if (currentBank < amount) return m.reply(`Yahh kak, saldo tabungan kamu nggak cukup! 😭\nDi rekening cuma ada *Rp ${currentBank.toLocaleString("id-ID")}* nih. Jangan ngadi-ngadi deh! 🫣`);

    db.db.data.users[cleanJid].rpg.bank = currentBank - amount;
    db.db.data.users[cleanJid].koin = currentBalance + amount;

    await db.save();

    const newBalance = db.db.data.users[cleanJid].koin;
    return m.reply(`Uangnya berhasil ditarik ya kak! 🏧💸\n\n✅ Penarikan: *Rp ${amount.toLocaleString("id-ID")}*\n💰 Uang Cash: *Rp ${newBalance.toLocaleString("id-ID")}*\n\nJangan boros-boros pakainya ya! 🛍️✨`);
  }

  let txt = `Halo kak! Selamat datang di Bank RPG! 🏦✨\nMau ngecek saldo atau ada keperluan lain nih?\n\n`;
  txt += `💰 Uang Dompet: *Rp ${currentBalance.toLocaleString("id-ID")}*\n`;
  txt += `💳 Saldo Tabungan: *Rp ${currentBank.toLocaleString("id-ID")}*\n\n`;
  txt += `*Layanan Bank:* 💁‍♀️\n`;
  txt += `Nabung: \`.bank deposit <jumlah>\`\n`;
  txt += `Tarik tunai: \`.bank withdraw <jumlah>\`\n\n`;
  txt += `*(Pake kata 'all' kalau mau nabung/narik semuanya sekaligus!)* 🚀`;

  await m.reply(txt);
}

export { pluginConfig as config, handler };
