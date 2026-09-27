/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import { addExpWithLevelCheck } from "../../src/lib/elaina-level.js";
import config from "../../config.js";

const pluginConfig = {
  name: "daily",
  alias: ["harian", "claim"],
  category: "rpg",
  description: "Klaim hadiah harian",
  usage: ".daily",
  example: ".daily",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 0,
  energi: 0,
  isEnabled: true,
};

function msToTime(duration) {
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const seconds = Math.floor((duration / 1000) % 60);
  return `${hours} jam ${minutes} menit ${seconds} detik`;
}

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);
  const isPremium = config.isPremium?.(m.sender) || false;

  if (!user.rpg) user.rpg = {};

  const COOLDOWN = 86400000;
  const lastClaim = user.rpg.lastDaily || 0;
  const now = Date.now();

  if (now - lastClaim < COOLDOWN) {
    const remaining = COOLDOWN - (now - lastClaim);
    return m.reply(`Sabar kak, jatah absen harian kamu udah diambil! 😂\n\nTunggu *${msToTime(remaining)}* lagi ya buat ambil jatah besok. Jangan serakah! 🏃💨`);
  }

  const expReward = isPremium ? 5000 : 1000;
  const moneyReward = isPremium ? 25000 : 5000;
  const energiReward = isPremium ? 10 : 3;

  user.rpg.lastDaily = now;
  user.koin = (user.koin || 0) + moneyReward;
  user.energi = (user.energi || 0) + energiReward;

  const levelResult = await addExpWithLevelCheck(sock, m, db, user, expReward);
  db.save();

  await m.react("🎁");

  let txt = `ASIKK! Gajian harian udah cair nih kak! 🎉✨\n\n`;
  txt += `Ini jatah kamu buat hari ini:\n`;
  txt += `💸 Koin: *+Rp ${moneyReward.toLocaleString("id-ID")}*\n`;
  txt += `📈 EXP: *+${expReward.toLocaleString("id-ID")}*\n`;
  txt += `⚡ Energi: *+${energiReward}*\n\n`;
  
  if (isPremium) {
    txt += `👑 *Wih, bonus member Premium emang beda! Sultan mah bebas!* 😎💸`;
  } else {
    txt += `Mau bonus lebih gede? Yuk *Upgrade Premium* kak! Biar makin kaya! 🤑💎`;
  }

  m.reply(txt);
}

export { pluginConfig as config, handler };
