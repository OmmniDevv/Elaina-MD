/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "cook",
  alias: ["masak"],
  category: "rpg",
  description: "Memasak makanan untuk menambah health",
  usage: ".cook",
  example: ".cook",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 60,
  energi: 0,
  isEnabled: true,
};

const RECIPES = {
  fish_soup: { name: "🍲 Sup Ikan", materials: { fish: 2 }, heal: 30 },
  grilled_meat: { name: "🍖 Daging Panggang", materials: { rabbit: 1, wood: 1 }, heal: 40 },
  apple_pie: { name: "🥧 Pie Apel", materials: { apple: 3 }, heal: 25 },
  steak: { name: "🥩 Steak", materials: { boar: 1, coal: 1 }, heal: 60 },
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};
  if (!user.inventory) user.inventory = {};

  user.rpg.health = user.rpg.health || 100;
  user.rpg.maxHealth = user.rpg.maxHealth || 100;

  if (user.rpg.health >= user.rpg.maxHealth) {
    return m.reply(`Perut kamu masih kenyang kak! 🤢\nNggak usah masak dulu, nanti kekenyangan malah susah jalan! 🏃💨`);
  }

  let cooked = null;
  for (const [key, recipe] of Object.entries(RECIPES)) {
    let canCook = true;
    for (const [mat, qty] of Object.entries(recipe.materials)) {
      if ((user.inventory[mat] || 0) < qty) {
        canCook = false;
        break;
      }
    }
    if (canCook) {
      cooked = { key, ...recipe };
      break;
    }
  }

  if (!cooked) {
    let txt = `Halo Chef! Mau masak apa hari ini? 🍳👨‍🍳\n\n`;
    txt += `Ini daftar resep yang bisa kamu bikin:\n\n`;
    for (const [key, recipe] of Object.entries(RECIPES)) {
      txt += `*${recipe.name}*\n`;
      txt += `❤️ Heal: +${recipe.heal} HP\n`;
      txt += `📦 Bahan yang dibutuhin:\n`;
      for (const [mat, qty] of Object.entries(recipe.materials)) {
        const has = user.inventory[mat] || 0;
        txt += `• ${has >= qty ? "✅" : "❌"} ${mat}: ${has}/${qty}\n`;
      }
      txt += `\n`;
    }
    txt += `(Bot bakal otomatis masak resep pertama yang bahannya cukup!)`;
    return m.reply(txt);
  }

  for (const [mat, qty] of Object.entries(cooked.materials)) {
    user.inventory[mat] -= qty;
  }

  await m.react("🍳");
  await m.reply(`Srengg... Srenggg... 🔥🍳\nLagi masak *${cooked.name}* nih, wanginya enak banget! 🤤`);
  await new Promise((r) => setTimeout(r, 3000));

  const oldHealth = user.rpg.health;
  user.rpg.health = Math.min(user.rpg.health + cooked.heal, user.rpg.maxHealth);

  db.save();

  await m.react("✅");

  let txt = `NYAM NYAM! Masakan Matang! 🍽️✨\n\n`;
  txt += `Kamu langsung makan *${cooked.name}* dan ngerasa baikan!\n`;
  txt += `❤️ HP Pulih: ${oldHealth} 📈 *${user.rpg.health}*\n\n`;
  txt += `Lanjut petualang lagi gass! 🚀🔥`;

  await m.reply(txt);
}

export { pluginConfig as config, handler };
