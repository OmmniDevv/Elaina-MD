/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "casino",
  alias: ["judi", "gamble"],
  category: "rpg",
  description: "Bermain casino untuk judi",
  usage: ".casino <jumlah>",
  example: ".casino 10000",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);
  const args = m.args || [];

  let bet = args[0];

  if (!bet) {
    let txt = `🎰 *LAS VEGAS KELILING* 🎰\n\n`;
    txt += `Selamat datang di Kasino! Mau ngadu nasib sama bandar?\n\n`;
    txt += `*Cara Taruhan:*\n`;
    txt += `👉 \`${m.prefix}casino <jumlah>\`\n\n`;
    txt += `Contoh:\n`;
    txt += `👉 \`${m.prefix}casino 10000\`\n`;
    txt += `👉 \`${m.prefix}casino all\` (Nekat bener!)`;
    return m.reply(txt);
  }

  if (/^all$/i.test(bet)) {
    bet = user.koin || 0;
  } else {
    bet = parseInt(bet);
  }

  if (isNaN(bet) || bet < 1000) {
    return m.reply(`Hadeh... mau judi kok modal receh? 💸\nMinimal taruhan di sini *Rp 1.000* bro!`);
  }

  if (bet > (user.koin || 0)) {
    return m.reply(`Jangan ngutang bos! 😂\nUang lu cuma *Rp ${(user.koin || 0).toLocaleString("id-ID")}* tapi sok-sokan taruhan *Rp ${bet.toLocaleString("id-ID")}*.\nSana kerja dulu!`);
  }

  await m.react("🎰");
  await m.reply(`🎲 Bandar mengocok dadu dan memutar roda Roulette... Tahan napas lu!`);
  await new Promise((r) => setTimeout(r, 2500));

  const playerScore = Math.floor(Math.random() * 100);
  const botScore = Math.floor(Math.random() * 100);

  let result, emoji, moneyChange, bandarTaunt;

  if (playerScore > botScore) {
    result = "MENANG!";
    emoji = "🎉";
    moneyChange = bet;
    user.koin = (user.koin || 0) + bet;
    bandarTaunt = `"Cih! Kebetulan doang lu hoki kali ini." - *Bandar* 😒`;
  } else if (playerScore < botScore) {
    result = "KALAH TELAK!";
    emoji = "💸";
    moneyChange = -bet;
    user.koin = (user.koin || 0) - bet;
    bandarTaunt = `"AHAHA! Udah miskin makin miskin lu! Pulang sana!" - *Bandar* 😈`;
  } else {
    result = "SERI!";
    emoji = "🤝";
    moneyChange = 0;
    bandarTaunt = `"Hoo... Imbang ya? Boleh juga nyali lu." - *Bandar* 👀`;
  }

  db.save();

  await m.react(emoji);

  let txt = `🎰 *MEJA KASINO DITUTUP!* 🎰\n\n`;
  txt += `*Papan Skor:*\n`;
  txt += `👤 Poin Lu: *${playerScore}*\n`;
  txt += `🤖 Poin Bandar: *${botScore}*\n\n`;
  txt += `*Hasil: ${emoji} ${result}*\n`;
  if (moneyChange !== 0) {
    txt += `Uang Bandar: *${moneyChange > 0 ? "+" : ""}Rp ${moneyChange.toLocaleString("id-ID")}*\n\n`;
  } else {
    txt += `Uang Kembali (Balik Modal)\n\n`;
  }
  txt += `${bandarTaunt}\n\n`;
  txt += `*Sisa Saldo Lu:* Rp ${(user.koin || 0).toLocaleString("id-ID")}`;

  m.reply(txt);
}

export { pluginConfig as config, handler };
