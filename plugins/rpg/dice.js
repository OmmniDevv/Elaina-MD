/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import { sendRpgPreview } from "../../src/lib/elaina-context.js";

const pluginConfig = {
  name: "dice",
  alias: ["dadu", "roll"],
  category: "rpg",
  description: "Lempar dadu untuk gambling",
  usage: ".dice <1-6> <bet>",
  example: ".dice 6 5000",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  const args = m.args || [];
  const guess = parseInt(args[0]);
  const bet = parseInt(args[1]);

  if (!guess || guess < 1 || guess > 6) {
    return m.reply(
      `🎲 *Bandar Dadu Jalanan* 🎲\n\n` +
        `Tebak angka yang bakal keluar! (1-6)\n\n` +
        `*Cara Main:*\n` +
        `👉 \`.dice <angka> <taruhan>\`\n\n` +
        `*Contoh:*\n` +
        `👉 \`.dice 6 5000\``
    );
  }

  if (!bet || bet < 1000) {
    return m.reply(`Mana ada bandar nerima taruhan segitu! Minimal bawa *Rp 1.000* sini! 🎲`);
  }

  if ((user.koin || 0) < bet) {
    return m.reply(`Duit lu kurang bos! Di saku cuma ada *Rp ${(user.koin || 0).toLocaleString("id-ID")}*. Jangan ngutang di mari! 😤`);
  }

  user.koin -= bet;

  await sendRpgPreview(sock, m.chat, `🎲 Bandar mengocok dadu di dalam mangkok kayu... *krok krok krok*...`, "🎲 DADU JALANAN", "Rolling!", { quoted: m });
  await new Promise((r) => setTimeout(r, 2500));

  const result = Math.floor(Math.random() * 6) + 1;
  const diceEmoji = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][result - 1];

  const isWin = guess === result;

  let txt = `*MANGKOK DIBUKA!* 🎲💥\n\n`;
  txt += `Tebakan Lu: *${guess}*\n`;
  txt += `Mata Dadu: *${result}* ${diceEmoji}\n\n`;

  if (isWin) {
    const winnings = bet * 5;
    user.koin = (user.koin || 0) + winnings;
    txt += `🎉 *GILA LU HOKI BANGET!*\n`;
    txt += `💰 Uang Berlipat 5x: *+Rp ${winnings.toLocaleString("id-ID")}*`;
  } else {
    txt += `🤣 *HAHAHA MAMPUS LU SALAH!*\n`;
    txt += `💸 Duit Lu Ditarik Bandar: *-Rp ${bet.toLocaleString("id-ID")}*`;
  }

  db.save();
  await sendRpgPreview(sock, m.chat, txt, "🎲 HASIL DADU", "Result!", { quoted: m });
}

export { pluginConfig as config, handler };
