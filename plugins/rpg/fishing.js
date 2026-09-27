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
  name: "fishing",
  alias: ["rpgfish", "mancing"],
  category: "rpg",
  description: "Memancing untuk mendapatkan ikan (RPG)",
  usage: ".fishing",
  example: ".fishing",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 60,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};
  if (!user.inventory) user.inventory = {};

  const staminaCost = 15;
  user.rpg.stamina = user.rpg.stamina || 100;

  if (user.rpg.stamina < staminaCost) {
    return m.reply(`Aduh kak, stamina kamu abis nih! 😭⚡\n\nBuat mancing butuh *${staminaCost} Stamina*, tapi punya kamu sisa *${user.rpg.stamina}*.\nIstirahat dulu gih biar seger lagi! 🛌💤`);
  }

  user.rpg.stamina -= staminaCost;

  await m.react("🎣");
  await m.reply(`Melempar kail ke air yang tenang... 🌊🎣\nSssttt, jangan berisik biar ikannya makan umpan! 🤫👀`);
  await new Promise((r) => setTimeout(r, 4000));

  const drops = [
    { item: "trash", chance: 20, name: "🗑️ Sampah", exp: 10 },
    { item: "fish", chance: 50, name: "🐟 Ikan", exp: 100 },
    { item: "prawn", chance: 30, name: "🦐 Udang", exp: 150 },
    { item: "octopus", chance: 15, name: "🐙 Gurita", exp: 300 },
    { item: "shark", chance: 5, name: "🦈 Hiu", exp: 800 },
    { item: "whale", chance: 1, name: "🐳 Paus", exp: 2000 },
  ];

  const rand = Math.random() * 100;
  let caught = drops[0];

  for (const drop of drops.sort((a, b) => a.chance - b.chance)) {
    if (rand <= drop.chance) {
      caught = drop;
      break;
    }
  }

  const qty = 1;
  user.inventory[caught.item] = (user.inventory[caught.item] || 0) + qty;

  const expReward = caught.exp;
  const levelResult = await addExpWithLevelCheck(sock, m, db, user, expReward);

  db.save();

  await m.react("✅");

  let txt = `HAPPP! Kailnya ditarik! 🎣💦\n\nWah, kamu berhasil dapetin:\n`;
  if (caught.item === "trash") {
    txt += `> ${caught.name} 🤢\nYahh dapetnya sampah kak... Lumayan lah dapet *+${expReward} EXP* pengalaman buang sampah pada tempatnya! 😂\n\n`;
  } else {
    txt += `> *${caught.name}* 🎉✨\nAsik banget! Kamu juga dapet *+${expReward} EXP* nih!\n\n`;
  }
  
  txt += `⚡ Stamina terpakai: *-${staminaCost}*\n`;
  txt += `\nIkan/sampahnya udah masuk ke tas (\`.inv\`) ya! Jangan lupa mancing lagi nanti! 💖🌊`;

  await m.reply(txt);
}

export { pluginConfig as config, handler };
