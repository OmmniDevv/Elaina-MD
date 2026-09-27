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
  name: "ngojek",
  alias: ["ojek", "gojek", "ojol"],
  category: "rpg",
  description: "Ngojek untuk mendapat uang",
  usage: ".ngojek",
  example: ".ngojek",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 120,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};

  const staminaCost = 15;
  user.rpg.stamina = user.rpg.stamina ?? 100;

  if (user.rpg.stamina < staminaCost) {
    return m.reply(`Mesin motornya udah panas banget kak, mending istirahat dulu! 🥵🏍️💨\n\nNgojek butuh *${staminaCost} Stamina*, sisa stamina kamu *${user.rpg.stamina}* doang. Ngopi dulu gih! ☕`);
  }

  user.rpg.stamina -= staminaCost;

  await m.react("🏍️");

  const orders = [
    { type: "🍔 GoFood", distance: "2km", min: 5000, max: 15000 },
    { type: "👤 GoRide", distance: "5km", min: 10000, max: 25000 },
    { type: "📦 GoSend", distance: "3km", min: 8000, max: 20000 },
    { type: "🛒 GoMart", distance: "4km", min: 12000, max: 30000 },
    { type: "👥 GoRide Plus", distance: "10km", min: 20000, max: 50000 },
  ];

  const order = orders[Math.floor(Math.random() * orders.length)];
  const earning = Math.floor(Math.random() * (order.max - order.min + 1)) + order.min;
  const tips = Math.random() > 0.7 ? Math.floor(Math.random() * 5000) + 1000 : 0;
  const totalEarning = earning + tips;

  await m.reply(`Nyalain motor, tarik gas! Mencari penumpang... 🏍️💨\nAda orderan *${order.type}* sejauh *${order.distance}* nih, Gasss! 🗺️`);
  await new Promise((r) => setTimeout(r, 3000));

  user.koin = (user.koin || 0) + totalEarning;

  const expGain = Math.floor(totalEarning / 20);
  const levelResult = await addExpWithLevelCheck(sock, m, db, user, expGain);

  db.save();

  await m.react("✅");

  let txt = `ALHAMDULILLAH ORDERAN KELAR! 🏍️✨\n\n`;
  txt += `Rincian narik ojol hari ini:\n`;
  txt += `📱 Tipe: *${order.type}*\n`;
  txt += `💵 Tarif: *+Rp ${earning.toLocaleString("id-ID")}*\n`;
  if (tips > 0) {
    txt += `🎁 Tips Customer: *+Rp ${tips.toLocaleString("id-ID")}*\n`;
  }
  txt += `📈 EXP: *+${expGain}*\n`;
  txt += `⚡ Stamina: *-${staminaCost}*\n\n`;
  txt += `Lumayan buat nambah-nambahin jajan kak! Semangat narik lagi nanti! 🔥💪`;

  m.reply(txt);
}

export { pluginConfig as config, handler };
