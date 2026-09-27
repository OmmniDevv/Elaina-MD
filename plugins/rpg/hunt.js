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
  name: "hunt",
  alias: ["berburu", "hunting"],
  category: "rpg",
  description: "Berburu hewan untuk mendapatkan daging dan kulit",
  usage: ".hunt",
  example: ".hunt",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 90,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};
  if (!user.inventory) user.inventory = {};

  const staminaCost = 25;
  user.rpg.stamina = user.rpg.stamina || 100;

  if (user.rpg.stamina < staminaCost) {
    return m.reply(`⚡ Aduh kak, stamina kamu habis!\n\nButuh *${staminaCost} Stamina* buat pergi berburu.\nStamina kamu sisa: *${user.rpg.stamina}*`);
  }

  user.rpg.stamina -= staminaCost;

  await m.reply("🏹 _Mengendap-endap di balik semak belukar... Menyiapkan anak panah..._ 🌿🤫");
  await new Promise((r) => setTimeout(r, 2500));

  const animals = [
    { name: "🐰 Kelinci Hutan", item: "rabbit", chance: 50, exp: 100 },
    { name: "🦌 Rusa Jantan", item: "deer", chance: 30, exp: 200 },
    { name: "🐗 Babi Hutan Liar", item: "boar", chance: 20, exp: 300 },
    { name: "🐻 Beruang Madu", item: "bear", chance: 10, exp: 500 },
    { name: "🦁 Singa Padang Rumput", item: "lion", chance: 5, exp: 800 },
    { name: "🐉 Anak Naga Kuno", item: "dragon", chance: 1, exp: 2000 },
  ];

  const rand = Math.random() * 100;
  let caught = null;

  for (const animal of animals.sort((a, b) => a.chance - b.chance)) {
    if (rand <= animal.chance) {
      caught = animal;
      break;
    }
  }

  if (!caught) {
    caught = animals.find((a) => a.item === "rabbit");
  }

  user.inventory[caught.item] = (user.inventory[caught.item] || 0) + 1;
  const levelResult = await addExpWithLevelCheck(sock, m, db, user, caught.exp);

  db.save();

  let txt = `🏹 *TANGKAPAN BERHASIL!* 🏹\n\n`;
  txt += `Wah jago banget bidikannya kak! Kamu berhasil menembak:\n`;
  txt += `🎯 *${caught.name}* (+1)\n\n`;
  txt += `*Hasil Perburuan:*\n`;
  txt += `✨ EXP Bertambah: *+${caught.exp}*\n`;
  txt += `⚡ Stamina Terpakai: *-${staminaCost}*`;

  await m.reply(txt);
}

export { pluginConfig as config, handler };
