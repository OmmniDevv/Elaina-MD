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
  name: "blacksmith",
  alias: ["tempa", "forge", "pandai"],
  category: "rpg",
  description: "Tempa senjata dan armor dari material",
  usage: ".blacksmith <item>",
  example: ".blacksmith sword",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 120,
  energi: 1,
  isEnabled: true,
};

const RECIPES = {
  sword: { materials: { iron: 3, wood: 2 }, result: "sword", name: "⚔️ Pedang Besi", exp: 200, price: 500 },
  shield: { materials: { iron: 4, leather: 2 }, result: "shield", name: "🛡️ Perisai Besi", exp: 250, price: 600 },
  helmet: { materials: { iron: 2, leather: 1 }, result: "helmet", name: "⛑️ Helm Besi", exp: 150, price: 400 },
  armor: { materials: { iron: 5, leather: 3 }, result: "armor", name: "🦺 Armor Besi", exp: 350, price: 800 },
  axe: { materials: { iron: 2, wood: 3 }, result: "axe", name: "🪓 Kapak Besi", exp: 180, price: 450 },
  pickaxe: { materials: { iron: 3, wood: 2 }, result: "pickaxe", name: "⛏️ Beliung", exp: 180, price: 450 },
  bow: { materials: { wood: 4, string: 2 }, result: "bow", name: "🏹 Busur", exp: 200, price: 500 },
  arrow: { materials: { wood: 1, iron: 1 }, result: "arrow", name: "🏹 Anak Panah x10", exp: 50, price: 100, qty: 10 },
  goldsword: { materials: { gold: 5, diamond: 2, iron: 3 }, result: "goldsword", name: "🗡️ Pedang Emas", exp: 500, price: 2000 },
  diamondarmor: { materials: { diamond: 8, iron: 5, leather: 3 }, result: "diamondarmor", name: "💎 Armor Berlian", exp: 800, price: 5000 },
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.inventory) user.inventory = {};
  if (!user.rpg) user.rpg = {};

  const args = m.args || [];
  const itemName = args[0]?.toLowerCase();

  if (!itemName) {
    let txt = `Halo petualang! Selamat datang di tempat Pandai Besi! 🔨⚒️\nAda yang bisa kubantu tempa hari ini?\n\n`;
    txt += `*Daftar Senjata & Armor:*\n`;

    for (const [key, recipe] of Object.entries(RECIPES)) {
      const mats = Object.entries(recipe.materials)
        .map(([m, qty]) => `${qty}x ${m}`)
        .join(", ");
      txt += `\n*${recipe.name}*\n`;
      txt += `📦 Bahan: ${mats}\n`;
      txt += `📈 EXP: +${recipe.exp}\n`;
      txt += `👉 Ketik: \`.blacksmith ${key}\`\n`;
    }
    txt += `\n💡 *Tips:* Materialnya bisa dicari lewat \`.mining\` atau \`.hunt\` lho!`;

    return m.reply(txt);
  }

  const recipe = RECIPES[itemName];
  if (!recipe) {
    return m.reply(`Hadeh, panduan bikin apaan tuh? Nggak ada di catatanku kak! 😂\nCek list yang bener pake \`.blacksmith\` ya!`);
  }

  const missingMaterials = [];
  for (const [material, needed] of Object.entries(recipe.materials)) {
    const have = user.inventory[material] || 0;
    if (have < needed) {
      missingMaterials.push(`• ${material}: ${have}/${needed}`);
    }
  }

  if (missingMaterials.length > 0) {
    return m.reply(`Eits, bahannya belum cukup buat nempa *${recipe.name}* nih! 😭\n\nKekurangannya:\n${missingMaterials.join("\n")}\n\nKumpulin dulu deh, baru balik ke sini! 🏃💨`);
  }

  await m.react("🔨");
  await m.reply(`Ting! Ting! Cshhh... 🔥🔨\nMenempa logam untuk membuat *${recipe.name}*... Prosesnya bakal sedikit makan waktu!`);
  await new Promise((r) => setTimeout(r, 4000));

  for (const [material, needed] of Object.entries(recipe.materials)) {
    user.inventory[material] -= needed;
    if (user.inventory[material] <= 0) delete user.inventory[material];
  }

  const resultQty = recipe.qty || 1;
  user.inventory[recipe.result] = (user.inventory[recipe.result] || 0) + resultQty;

  await addExpWithLevelCheck(sock, m, db, user, recipe.exp);
  db.save();

  await m.react("✅");

  let txt = `TEMPAAN BERHASIL KAK! ⚔️🛡️\n\n`;
  txt += `Gila, hasilnya rapi banget! Ini barang buatan tangan kita:\n`;
  txt += `🔨 Item: *${recipe.name}*\n`;
  txt += `📊 Jumlah: *+${resultQty}*\n`;
  txt += `📈 EXP Crafting: *+${recipe.exp}*\n\n`;
  txt += `Siap buat dipake berantem nih! 😎🔥`;

  return m.reply(txt);
}

export { pluginConfig as config, handler };
