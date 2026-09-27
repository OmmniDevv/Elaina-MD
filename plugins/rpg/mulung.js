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
  name: "mulung",
  alias: ["scavenge", "kumpulsampah"],
  category: "rpg",
  description: "Memulung untuk mengumpulkan barang",
  usage: ".mulung",
  example: ".mulung",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 300,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};
  if (!user.inventory) user.inventory = {};

  const staminaCost = 15;
  user.rpg.stamina = user.rpg.stamina ?? 100;

  if (user.rpg.stamina < staminaCost) {
    return m.reply(`Yaela kak, mulung aja butuh tenaga kali! 🥵🗑️\n\nStamina kamu sisa *${user.rpg.stamina}*, padahal butuh *${staminaCost}*. Istirahat gih! 🛌💤`);
  }

  user.rpg.stamina -= staminaCost;

  await m.react("🗑️");
  await m.reply(`Mengorek tempat sampah dengan penuh harapan... 🗑️👀\nSemoga hari ini dapet barang bagus! ✨`);
  await new Promise((r) => setTimeout(r, 3000));

  const drops = [
    { item: "botol", name: "🍶 Botol", min: 1, max: 10 },
    { item: "kaleng", name: "🥫 Kaleng", min: 1, max: 8 },
    { item: "kardus", name: "📦 Kardus", min: 1, max: 5 },
    { item: "sampah", name: "🗑️ Sampah", min: 1, max: 15 },
    { item: "koran", name: "📰 Koran", min: 0, max: 3 },
  ];

  let results = [];
  let moneyEarned = 0;

  for (const drop of drops) {
    const qty = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
    if (qty > 0) {
      user.inventory[drop.item] = (user.inventory[drop.item] || 0) + qty;
      results.push({ name: drop.name, qty });
      moneyEarned += qty * Math.floor(Math.random() * 50 + 10);
    }
  }

  user.koin = (user.koin || 0) + moneyEarned;

  const expGain = Math.floor(Math.random() * 200) + 50;
  const levelResult = await addExpWithLevelCheck(sock, m, db, user, expGain);

  db.save();

  await m.react("✅");

  let txt = `ASIK DAPET RONGSOKAN! 🗑️💸\n\n`;
  txt += `Kamu berhasil ngumpulin barang rongsokan nih kak:\n`;
  for (const r of results) {
    txt += `• ${r.name}: *+${r.qty}*\n`;
  }
  txt += `\nRongsokannya langsung dijual ke pengepul ya!\n`;
  txt += `💵 Hasil Jual: *+Rp ${moneyEarned.toLocaleString("id-ID")}*\n`;
  txt += `📈 EXP: *+${expGain}*\n`;
  txt += `⚡ Stamina terpakai: *-${staminaCost}*\n\n`;
  txt += `Teruslah memulung sampai kaya raya! 🔥🚀`;

  m.reply(txt);
}

export { pluginConfig as config, handler };
