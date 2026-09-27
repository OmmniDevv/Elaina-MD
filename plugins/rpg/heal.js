/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "heal",
  alias: ["sembuh", "recover"],
  category: "rpg",
  description: "Pulihkan health dengan istirahat (gratis tapi lama)",
  usage: ".heal",
  example: ".heal",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 600,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};
  user.rpg.health = user.rpg.health || 100;
  user.rpg.maxHealth = user.rpg.maxHealth || 100;
  user.rpg.stamina = user.rpg.stamina || 100;
  user.rpg.maxStamina = user.rpg.maxStamina || 100;

  if (user.rpg.health >= user.rpg.maxHealth && user.rpg.stamina >= user.rpg.maxStamina) {
    return m.reply(`Eits, badan kamu masih seger bugar kak! 🏋️✨\nNggak usah istirahat dulu, mending lanjut petualang aja! 🚀`);
  }

  await m.react("🛌");
  await m.reply("Tidur dulu ah... Zzz... 🛌💤");
  await new Promise((r) => setTimeout(r, 3000));

  const healthRecover = 30;
  const staminaRecover = 50;

  const oldHealth = user.rpg.health;
  const oldStamina = user.rpg.stamina;

  user.rpg.health = Math.min(user.rpg.health + healthRecover, user.rpg.maxHealth);
  user.rpg.stamina = Math.min(user.rpg.stamina + staminaRecover, user.rpg.maxStamina);

  let txt = `Hooammm... seger banget abis tidur! 🥱🌞\n\n`;
  txt += `Status kamu udah pulih nih:\n`;
  txt += `❤️ Health: ${oldHealth} 📈 *${user.rpg.health}*\n`;
  txt += `⚡ Stamina: ${oldStamina} 📈 *${user.rpg.stamina}*\n\n`;
  txt += `Kalo males nunggu istirahat, kamu bisa beli potion di \`.shop\` dan ketik \`.use potion\` buat heal instant ya! 🥤💖`;

  db.save();
  await m.reply(txt);
}

export { pluginConfig as config, handler };
