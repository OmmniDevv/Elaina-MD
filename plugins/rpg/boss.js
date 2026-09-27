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
  name: "boss",
  alias: ["raidboss", "bigboss"],
  category: "rpg",
  description: "Lawan boss untuk hadiah besar",
  usage: ".boss",
  example: ".boss",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 600,
  energi: 3,
  isEnabled: true,
};

const BOSSES = [
  {
    name: "🐉 Elder Dragon",
    hp: 500,
    attack: 50,
    minLevel: 10,
    exp: 2000,
    gold: 5000,
    drops: ["dragonscale", "dragonbone"],
  },
  {
    name: "👹 Demon Lord",
    hp: 400,
    attack: 60,
    minLevel: 15,
    exp: 2500,
    gold: 7000,
    drops: ["demonsoul", "cursedgem"],
  },
  {
    name: "🧟 Undead King",
    hp: 350,
    attack: 45,
    minLevel: 8,
    exp: 1500,
    gold: 4000,
    drops: ["soulstone", "ancientbone"],
  },
  {
    name: "🦑 Kraken",
    hp: 600,
    attack: 40,
    minLevel: 12,
    exp: 2200,
    gold: 6000,
    drops: ["krakententacle", "seagem"],
  },
  {
    name: "🌋 Volcanic Titan",
    hp: 700,
    attack: 55,
    minLevel: 20,
    exp: 3000,
    gold: 10000,
    drops: ["titancore", "lavagem"],
  },
  {
    name: "❄️ Frost Queen",
    hp: 450,
    attack: 50,
    minLevel: 18,
    exp: 2800,
    gold: 8000,
    drops: ["frostheart", "icecrown"],
  },
  {
    name: "⚡ Thunder God",
    hp: 550,
    attack: 65,
    minLevel: 25,
    exp: 4000,
    gold: 15000,
    drops: ["thunderstone", "divinecore"],
  },
];

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};
  if (!user.inventory) user.inventory = {};

  const userLevel = user.level || 1;
  const availableBosses = BOSSES.filter((b) => userLevel >= b.minLevel);

  if (availableBosses.length === 0) {
    const lowestBoss = BOSSES.reduce((a, b) => (a.minLevel < b.minLevel ? a : b));
    let txt = `Aduh kak, level kamu masih terlalu rendah buat ikutan Raid Boss! 😭\n\n`;
    txt += `Level kamu sekarang: *${userLevel}*\n`;
    txt += `Minimal level yang dibutuhkan: *${lowestBoss.minLevel}*\n\n`;
    txt += `💡 _Tips: Rajin-rajin farming EXP dari \`.dungeon\`, \`.fishing\`, atau \`.mining\` dulu yuk kak!_`;
    return m.reply(txt);
  }

  const staminaCost = 50;
  user.rpg.stamina = user.rpg.stamina ?? 100;

  if (user.rpg.stamina < staminaCost) {
    return m.reply(`⚡ Yahh stamina kamu habis kak!\n\nButuh *${staminaCost} Stamina* untuk melawan boss.\nStamina kamu sisa: *${user.rpg.stamina}*`);
  }

  user.rpg.stamina -= staminaCost;

  const boss = availableBosses[Math.floor(Math.random() * availableBosses.length)];

  await m.react("⚔️");
  let introTxt = `⚠️ *PERINGATAN BAHAYA!* ⚠️\n\n`;
  introTxt += `Aura kegelapan menyelimuti arena... *${boss.name}* telah muncul di hadapan kamu!\n\n`;
  introTxt += `❤️ Darah Boss: *${boss.hp} HP*\n`;
  introTxt += `⚔️ Kekuatan: *${boss.attack} ATK*\n\n`;
  introTxt += `_Siapkan senjatamu kak! Pertarungan dimulai..._`;
  
  await m.reply(introTxt);
  await new Promise((r) => setTimeout(r, 2500));

  const userAttack = (user.rpg.attack || 10) + userLevel * 3;
  const userDefense = (user.rpg.defense || 5) + userLevel * 2;
  const userMaxHp = (user.rpg.health || 100) + userLevel * 5;

  let userHp = userMaxHp;
  let bossHp = boss.hp;
  let round = 0;
  let battleLog = [];

  while (userHp > 0 && bossHp > 0 && round < 15) {
    round++;

    const playerDmg = Math.max(10, userAttack + Math.floor(Math.random() * 20) - 5);
    const critChance = Math.random();
    const finalPlayerDmg = critChance > 0.9 ? playerDmg * 2 : playerDmg;
    bossHp -= finalPlayerDmg;

    if (critChance > 0.9) {
      battleLog.push(`💥 *CRITICAL HIT!!* Serangan mematikanmu masuk: *-${finalPlayerDmg} HP*`);
    } else {
      battleLog.push(`⚔️ Kamu menebas boss: *-${finalPlayerDmg} HP*`);
    }

    if (bossHp <= 0) break;

    const bossDmg = Math.max(10, boss.attack - userDefense + Math.floor(Math.random() * 15));
    userHp -= bossDmg;
    battleLog.push(`👹 Boss mengamuk dan memukul mundur: *-${bossDmg} HP*`);
  }

  await m.reply(
    `⚔️ *Sengitnya Pertarungan...*\n\n${battleLog
      .slice(-6)
      .map((l) => `> ${l}`)
      .join("\n")}`,
  );
  await new Promise((r) => setTimeout(r, 1500));

  const isWin = bossHp <= 0;

  let txt = ``;

  if (isWin) {
    const expReward = boss.exp + Math.floor(Math.random() * 500);
    const goldReward = boss.gold + Math.floor(Math.random() * 2000);

    user.koin = (user.koin || 0) + goldReward;
    await addExpWithLevelCheck(sock, m, db, user, expReward);

    const droppedItems = [];
    for (const drop of boss.drops) {
      if (Math.random() > 0.5) {
        const qty = Math.floor(Math.random() * 3) + 1;
        user.inventory[drop] = (user.inventory[drop] || 0) + qty;
        droppedItems.push(`${drop} (x${qty})`);
      }
    }

    txt = `🏆 *BOSS BERHASIL DIKALAHKAN!!* 🎉\n\n`;
    txt += `Wahh gila, kamu berhasil numbangin monster raksasa *${boss.name}* kak!\n\n`;
    txt += `*🎁 Harta Karun Boss:*\n`;
    txt += `✨ EXP: *+${expReward.toLocaleString()}*\n`;
    txt += `💰 Koin Emas: *+Rp ${goldReward.toLocaleString()}*\n`;
    if (droppedItems.length > 0) {
      txt += `📦 Item Loot: *${droppedItems.join(", ")}*\n`;
    }
    txt += `\n> ❤️ Sisa HP Kamu: *${Math.max(0, userHp)}/${userMaxHp}*`;

    await m.react("🏆");
  } else {
    const goldLoss = Math.floor((user.koin || 0) * 0.15);
    user.koin = Math.max(0, (user.koin || 0) - goldLoss);
    user.rpg.health = Math.max(1, (user.rpg.health || 100) - 50);

    txt = `💀 *YAH... KAMU TERPURUK...* 💔\n\n`;
    txt += `Tenaga *${boss.name}* ternyata masih terlalu besar buat kamu kak!\n\n`;
    txt += `*Penalti Kekalahan:*\n`;
    txt += `💸 Koin Terjatuh: *-Rp ${goldLoss.toLocaleString()}*\n`;
    txt += `❤️ HP Berkurang: *-50 HP*\n\n`;
    txt += `> 💡 _Tips: Coba tingkatkan level dan perbaiki senjatamu sebelum nantangin dia lagi ya kak!_`;

    await m.react("💀");
  }

  db.save();
  return m.reply(txt);
}

export { pluginConfig as config, handler };
