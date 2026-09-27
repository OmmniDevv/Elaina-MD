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
  name: "berladang",
  alias: ["farm", "tanam", "berkebun"],
  category: "rpg",
  description: "Berladang untuk mendapat hasil panen",
  usage: ".berladang",
  example: ".berladang",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 180,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};
  if (!user.inventory) user.inventory = {};

  const staminaCost = 20;
  user.rpg.stamina = user.rpg.stamina ?? 100;

  if (user.rpg.stamina < staminaCost) {
    return m.reply(`Aduh kak, encok nih badan! 🥵\n\nBuat nyangkul butuh *${staminaCost} Stamina*, sisa stamina kamu *${user.rpg.stamina}*.\nMakan atau istirahat dulu gih! 🛌💤`);
  }

  user.rpg.stamina -= staminaCost;

  await m.react("🌾");
  await m.reply(`Menyiapkan cangkul dan menyiram tanah... 🌱💧\nSemoga hari ini panen berlimpah!`);
  await new Promise((r) => setTimeout(r, 3000));

  const crops = [
    { item: "padi", name: "🌾 Padi", chance: 90, min: 2, max: 8, price: 100 },
    { item: "jagung", name: "🌽 Jagung", chance: 70, min: 1, max: 5, price: 150 },
    { item: "tomat", name: "🍅 Tomat", chance: 50, min: 1, max: 4, price: 200 },
    { item: "wortel", name: "🥕 Wortel", chance: 40, min: 1, max: 3, price: 250 },
    { item: "strawberry", name: "🍓 Strawberry", chance: 20, min: 1, max: 2, price: 500 },
    { item: "melon", name: "🍈 Melon", chance: 10, min: 1, max: 1, price: 1000 },
  ];

  let results = [];
  let totalValue = 0;

  for (const crop of crops) {
    if (Math.random() * 100 <= crop.chance) {
      const qty = Math.floor(Math.random() * (crop.max - crop.min + 1)) + crop.min;
      user.inventory[crop.item] = (user.inventory[crop.item] || 0) + qty;
      const value = qty * crop.price;
      totalValue += value;
      results.push({ name: crop.name, qty, value });
    }
  }

  if (results.length === 0) {
    user.inventory["padi"] = (user.inventory["padi"] || 0) + 1;
    results.push({ name: "🌾 Padi", qty: 1, value: 100 });
    totalValue = 100;
  }

  const expGain = Math.floor(totalValue / 10) + Math.floor(Math.random() * 100);
  const levelResult = await addExpWithLevelCheck(sock, m, db, user, expGain);

  db.save();

  await m.react("✅");

  let txt = `PANEN RAYA KAK! 🚜🌾\n\n`;
  txt += `Gila, kebun kamu hari ini ngasilin banyak banget:\n`;
  for (const r of results) {
    txt += `• ${r.name}: *+${r.qty}* (Est. Rp ${r.value.toLocaleString("id-ID")})\n`;
  }
  txt += `\n💰 Total Estimasi Nilai: *Rp ${totalValue.toLocaleString("id-ID")}*\n`;
  txt += `📈 EXP Petani: *+${expGain}*\n`;
  txt += `⚡ Stamina: *-${staminaCost}*\n\n`;
  txt += `Kamu bisa jual hasil panen ini ke pasar pakai \`${m.prefix}sellall\` ya! 🧺✨`;

  m.reply(txt);
}

export { pluginConfig as config, handler };
