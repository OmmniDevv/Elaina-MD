/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase, randomInt } from "../../src/lib/elaina-rioo-bridge.js";

const pluginConfig = {
  name: "rimuru-tebakangka",
  alias: ["tebakangka"],
  category: "game",
  description: "Tebak angka 1-100 dari Rimuru",
  usage: ".tebakangka <angka>",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

async function handler(m) {
  const guess = Number(m.args[0]);
  if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
    return m.reply(`Masukkan angka 1-100.\nContoh: ${m.prefix}tebakangka 50`);
  }

  const db = getDatabase();
  const number = randomInt(1, 100);
  const bonusExp = randomInt(0, 99);
  const bonusMoney = randomInt(0, 999);
  const user = db.getUser(m.sender) || db.setUser(m.sender, {});

  if (guess === number) {
    if (user) {
      user.exp = Number(user.exp || 0) + bonusExp;
      user.money = Number(user.money || 0) + bonusMoney;
      user.riooTebakAngkaWin = Number(user.riooTebakAngkaWin || 0) + 1;
    }
    return m.reply(`🎉 *Selamat, tebakanmu benar!*\n\n+${bonusExp} XP\n+Rp${bonusMoney}`);
  }

  if (user) user.riooTebakAngkaLose = Number(user.riooTebakAngkaLose || 0) + 1;
  return m.reply(`❌ *Kamu kalah.*\nAngka yang benar adalah *${number}*.`);
}

export { pluginConfig as config, handler };
