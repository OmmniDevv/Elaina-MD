/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import { addExpWithLevelCheck } from "../../src/lib/elaina-level.js";

const pluginConfig = {
  name: "nambalban",
  alias: ["tambal", "bengkel"],
  category: "rpg",
  description: "Buka jasa tambal ban, awas ban meledak!",
  usage: ".nambalban",
  example: ".nambalban",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 150,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};
  
  const staminaCost = 14;
  user.rpg.stamina = user.rpg.stamina ?? 100;

  if (user.rpg.stamina < staminaCost) {
    return m.reply(`Pompa angin macet, tangan kapalan! 🤕\n\nNambal butuh *${staminaCost} Stamina*, sisa stamina kamu *${user.rpg.stamina}*. Minum es teh dulu! 🧊`);
  }

  user.rpg.stamina -= staminaCost;
  await m.react("🛠️");
  await m.reply(`Sssshh... ngecek ban bocor pakai air sabun... 🫧\nKetemu paku nancep! 📍`);
  await new Promise(r => setTimeout(r, 3000));

  const gacha = Math.random();

  if (gacha < 0.15) {
    const healthLoss = 15;
    user.rpg.health = Math.max(0, (user.rpg.health ?? 100) - healthLoss);
    await m.react("💥");
    return m.reply(`DUAAAAR! BANNYA MELEDAK! 💥😭\n\nKamu mompa kerasa kenceng dan ban truk itu meledak di depan muka!\n💔 HP berkurang: -${healthLoss}\n⚡ Stamina: -${staminaCost}\n💵 Pendapatan: 0\n\nMuka item kena asep ban, apes bener! 💀`);
  }

  const earning = Math.floor(Math.random() * 20000) + 10000;
  user.koin = (user.koin || 0) + earning;
  const expGain = Math.floor(earning / 25);
  await addExpWithLevelCheck(sock, m, db, user, expGain);

  await m.react("✅");
  m.reply(`HASIL NAMBAL BAN! 🛠️✨\n\n💵 Pendapatan: *+Rp ${earning.toLocaleString("id-ID")}*\n📈 EXP: *+${expGain}*\n⚡ Stamina: -${staminaCost}\n\nSemoga di jalan nggak bocor lagi tuh orang! 💨`);
}

export { pluginConfig as config, handler };
