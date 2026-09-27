/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "weekly",
  alias: ["mingguan"],
  category: "rpg",
  description: "Claim hadiah mingguan (lebih besar dari daily)",
  usage: ".weekly",
  example: ".weekly",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 0,
  energi: 0,
  isEnabled: true,
};

const WEEKLY_COOLDOWN = 7 * 24 * 60 * 60 * 1000;

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.cooldowns) user.cooldowns = {};
  const lastWeekly = user.cooldowns.weekly || 0;
  const now = Date.now();

  if (now - lastWeekly < WEEKLY_COOLDOWN) {
    const remaining = lastWeekly + WEEKLY_COOLDOWN - now;
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return m.reply(`Wah, jatah mingguan kamu udah ludes kak! 😂\n\nTunggu *${days} hari ${hours} jam* lagi ya buat gajian mingguan berikutnya! 🗓️💨`);
  }

  const expReward = Math.floor(Math.random() * 20000) + 10000;
  const moneyReward = Math.floor(Math.random() * 50000) + 30000;
  const crateReward = Math.floor(Math.random() * 3) + 1;

  if (!user.rpg) user.rpg = {};
  db.updateExp(m.sender, expReward);
  user.koin = (user.koin || 0) + moneyReward;

  if (!user.inventory) user.inventory = {};
  user.inventory.uncommon = (user.inventory.uncommon || 0) + crateReward;

  user.cooldowns.weekly = now;
  db.save();

  let txt = `DORRR! GAJIAN MINGGUAN CAIRRR! 🎉🎊🤑\n\n`;
  txt += `Gila, jatah kamu minggu ini gede banget:\n`;
  txt += `📈 EXP: *+${expReward.toLocaleString("id-ID")}*\n`;
  txt += `💰 Koin: *+Rp ${moneyReward.toLocaleString("id-ID")}*\n`;
  txt += `🛍️ Uncommon Crate: *+${crateReward}x*\n\n`;
  txt += `Duitnya jangan lupa ditabung ya kak di bank (\`.bank\`)! 🏦💖`;

  await m.reply(txt);
}

export { pluginConfig as config, handler };
