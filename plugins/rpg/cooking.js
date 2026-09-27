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
  name: "cooking",
  alias: ["chef"],
  category: "rpg",
  description: "Masak makanan untuk stamina dan HP",
  usage: ".cooking <recipe>",
  example: ".cooking friedrice",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 60,
  energi: 1,
  isEnabled: true,
};

const RECIPES = {
  bread: { name: "🍞 Roti", materials: { wheat: 2 }, effect: { stamina: 10, health: 5 }, exp: 30 },
  friedrice: { name: "🍚 Nasi Goreng", materials: { rice: 2, egg: 1 }, effect: { stamina: 25, health: 15 }, exp: 60 },
  steak: { name: "🥩 Steak", materials: { meat: 2, herb: 1 }, effect: { stamina: 40, health: 30 }, exp: 100 },
  soup: { name: "🍲 Sup", materials: { carrot: 2, potato: 2, meat: 1 }, effect: { stamina: 35, health: 40 }, exp: 90 },
  sushi: { name: "🍣 Sushi", materials: { fish: 3, rice: 2 }, effect: { stamina: 30, health: 25 }, exp: 80 },
  cake: { name: "🍰 Kue", materials: { wheat: 3, egg: 2, strawberry: 2 }, effect: { stamina: 50, health: 20 }, exp: 120 },
  ramen: { name: "🍜 Ramen", materials: { wheat: 2, egg: 1, meat: 1, herb: 1 }, effect: { stamina: 45, health: 35 }, exp: 110 },
  pizza: { name: "🍕 Pizza", materials: { wheat: 3, tomato: 2, meat: 2 }, effect: { stamina: 60, health: 30 }, exp: 140 },
  smoothie: { name: "🥤 Smoothie", materials: { strawberry: 3, watermelon: 1 }, effect: { stamina: 30, mana: 20 }, exp: 70 },
  elixir_food: { name: "✨ Elixir Food", materials: { herb: 5, diamond: 1, gold: 2 }, effect: { stamina: 100, health: 100, mana: 50 }, exp: 300 },
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.inventory) user.inventory = {};
  if (!user.rpg) user.rpg = {};

  const args = m.args || [];
  const recipeName = args[0]?.toLowerCase();

  if (!recipeName) {
    let txt = `Halo Master Chef! Mau masak resep yang mana nih? 👨‍🍳🍳\n\n`;
    txt += `*Daftar Resep Rahasia:*\n`;

    for (const [key, recipe] of Object.entries(RECIPES)) {
      const mats = Object.entries(recipe.materials)
        .map(([m, qty]) => `${qty}x ${m}`)
        .join(", ");
      const effects = Object.entries(recipe.effect)
        .map(([e, v]) => `+${v} ${e}`)
        .join(", ");
      txt += `\n*${recipe.name}*\n`;
      txt += `📦 Bahan: ${mats}\n`;
      txt += `💫 Efek: ${effects}\n`;
      txt += `👉 Ketik: \`.cooking ${key}\`\n`;
    }

    return m.reply(txt);
  }

  const recipe = RECIPES[recipeName];
  if (!recipe) {
    return m.reply(`Hayo, resep apaan tuh? Nggak ada di buku menu kak! 😂\nCek daftar resepnya pake \`.cooking\` ya!`);
  }

  const missingMaterials = [];
  for (const [material, needed] of Object.entries(recipe.materials)) {
    const have = user.inventory[material] || 0;
    if (have < needed) {
      missingMaterials.push(`• ${material}: ${have}/${needed}`);
    }
  }

  if (missingMaterials.length > 0) {
    return m.reply(`Eits, bahan kamu belum lengkap buat masak *${recipe.name}*! 😭\n\nYang kurang:\n${missingMaterials.join("\n")}\n\nCari bahannya dulu gih! 🛒🏃`);
  }

  await m.react("👨‍🍳");
  await m.reply(`Srengg... Srenggg... 🔥🍳\nLagi masak *${recipe.name}* nih, wanginya nyebar sekampung! 🤤`);
  await new Promise((r) => setTimeout(r, 3000));

  for (const [material, needed] of Object.entries(recipe.materials)) {
    user.inventory[material] -= needed;
    if (user.inventory[material] <= 0) delete user.inventory[material];
  }

  const userLevel = user.level || 1;
  const maxStamina = 100;
  const maxHealth = 100 + userLevel * 5;
  const maxMana = 50 + userLevel * 3;

  if (recipe.effect.stamina) {
    user.rpg.stamina = Math.min(maxStamina, (user.rpg.stamina ?? 100) + recipe.effect.stamina);
  }
  if (recipe.effect.health) {
    user.rpg.health = Math.min(maxHealth, (user.rpg.health || 100) + recipe.effect.health);
  }
  if (recipe.effect.mana) {
    user.rpg.mana = Math.min(maxMana, (user.rpg.mana || 50) + recipe.effect.mana);
  }

  await addExpWithLevelCheck(sock, m, db, user, recipe.exp);
  db.save();

  await m.react("✅");

  const effectTexts = Object.entries(recipe.effect)
    .map(([e, v]) => `• ${e.toUpperCase()}: +${v}`)
    .join("\n");

  return m.reply(
    `TADAA! MASAKAN MATANG! 🍽️✨\n\n` +
      `Kamu langsung melahap *${recipe.name}* yang enak banget!\n` +
      `Efek yang kamu dapet:\n` +
      `${effectTexts}\n\n` +
      `📈 Bonus EXP Masak: *+${recipe.exp}*\n\n` +
      `Kenyang banget rasanya, siap tempur lagi! 🔥`
  );
}

export { pluginConfig as config, handler };
