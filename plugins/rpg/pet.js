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
  name: "pet",
  alias: ["mypet", "hewanku", "peliharaan"],
  category: "rpg",
  description: "Kelola pet/hewan peliharaan",
  usage: ".pet <feed/train/status>",
  example: ".pet status",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 0,
  isEnabled: true,
};

const PET_TYPES = {
  cat: { name: "🐱 Kucing", baseStats: { attack: 5, defense: 3, luck: 5 }, evolve: "lion" },
  dog: { name: "🐕 Anjing", baseStats: { attack: 8, defense: 5, luck: 2 }, evolve: "wolf" },
  bird: { name: "🐦 Burung", baseStats: { attack: 4, defense: 2, luck: 8 }, evolve: "phoenix" },
  fish: { name: "🐟 Ikan", baseStats: { attack: 2, defense: 2, luck: 10 }, evolve: "dragon" },
  rabbit: { name: "🐰 Kelinci", baseStats: { attack: 3, defense: 4, luck: 6 }, evolve: "thunderbunny" },
  lion: { name: "🦁 Singa", baseStats: { attack: 15, defense: 10, luck: 8 }, evolve: null },
  wolf: { name: "🐺 Serigala", baseStats: { attack: 18, defense: 12, luck: 5 }, evolve: null },
  phoenix: { name: "🔥 Phoenix", baseStats: { attack: 12, defense: 8, luck: 15 }, evolve: null },
  dragon: { name: "🐉 Naga", baseStats: { attack: 20, defense: 15, luck: 12 }, evolve: null },
  thunderbunny: { name: "⚡ Thunder Bunny", baseStats: { attack: 10, defense: 12, luck: 18 }, evolve: null },
};

const FOOD_ITEMS = {
  bread: { name: "🍞 Roti", hunger: 10, exp: 5 },
  fish: { name: "🐟 Ikan", hunger: 20, exp: 10 },
  meat: { name: "🍖 Daging", hunger: 30, exp: 15 },
  fruit: { name: "🍎 Buah", hunger: 15, exp: 8 },
  premium_food: { name: "⭐ Premium Food", hunger: 50, exp: 30 },
};

function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};
  if (!user.inventory) user.inventory = {};

  const args = m.args || [];
  const action = args[0]?.toLowerCase();

  if (!user.rpg.pet) {
    return m.reply(
      `Kamu belum punya hewan peliharaan kak! 😭\nSedih banget bertualang sendirian...\n\n` +
        `*Cara dapetin teman:* \n` +
        `🛒 Beli di \`${m.prefix}petshop\`\n` +
        `💕 Dapat dari \`${m.prefix}breeding\`\n` +
        `🗡️ Drop rare dari boss!`
    );
  }

  const pet = user.rpg.pet;
  const petInfo = PET_TYPES[pet.type];

  if (!action || !["feed", "train", "status", "rename", "evolve"].includes(action)) {
    const maxHunger = 100;
    const hungerStatus = pet.hunger >= 70 ? "😊 Senang & Kenyang" : pet.hunger >= 40 ? "😐 Biasa Aja" : "😰 Keroncongan Parah!";

    let txt = `🐾 *Buku Identitas Peliharaan* 🐾\n\n`;
    txt += `*Profil Si ${pet.name}:*\n`;
    txt += `• Spesies: *${petInfo.name}*\n`;
    txt += `• Level: *${pet.level || 1}*\n`;
    txt += `• EXP: *${pet.exp || 0} / ${(pet.level || 1) * 100}*\n`;
    txt += `• Perut: *${pet.hunger}/${maxHunger}* (${hungerStatus})\n\n`;

    txt += `*Kekuatan Fisik:*\n`;
    txt += `⚔️ Attack: *${pet.stats?.attack || petInfo.baseStats.attack}*\n`;
    txt += `🛡️ Defense: *${pet.stats?.defense || petInfo.baseStats.defense}*\n`;
    txt += `🍀 Luck: *${pet.stats?.luck || petInfo.baseStats.luck}*\n\n`;

    txt += `*Interaksi:*\n`;
    txt += `👉 \`${m.prefix}pet feed <makanan>\` - Kasih makan\n`;
    txt += `👉 \`${m.prefix}pet train\` - Latih biar kuat\n`;
    txt += `👉 \`${m.prefix}pet rename <nama_baru>\` - Ganti nama\n`;
    if (petInfo.evolve) {
      txt += `👉 \`${m.prefix}pet evolve\` - Berevolusi (Bila cukup syarat)\n`;
    }

    return m.reply(txt);
  }

  if (action === "feed") {
    const foodKey = args[1]?.toLowerCase();

    if (!foodKey) {
      let txt = `Si ${pet.name} lagi ngeliatin kamu sambil jilat bibir... 🤤\nMau dikasih makan apa nih?\n\n`;
      txt += `*Daftar Makanan di Tasmu:*\n`;
      for (const [key, food] of Object.entries(FOOD_ITEMS)) {
        const have = user.inventory[key] || 0;
        txt += `\n*${food.name}* (Punya: ${have}x)\n`;
        txt += `🍖 Kenyang: +${food.hunger} | ✨ EXP: +${food.exp}\n`;
        txt += `👉 Kasih makan: \`.pet feed ${key}\`\n`;
      }
      return m.reply(txt);
    }

    const food = FOOD_ITEMS[foodKey];
    if (!food) {
      return m.reply(`Waduh, jangan kasih makanan aneh-aneh kak! Kasihan nanti sakit perut 😂❌`);
    }

    if ((user.inventory[foodKey] || 0) < 1) {
      return m.reply(`Kamu nggak punya *${food.name}* di tasmu! Belanja dulu sana! 🛒🏃`);
    }

    if (pet.hunger >= 100) {
      return m.reply(`Perut si ${pet.name} udah kepenuhan kak! Jangan disiksa disuruh makan terus! 🤢`);
    }

    user.inventory[foodKey]--;
    if (user.inventory[foodKey] <= 0) delete user.inventory[foodKey];

    pet.hunger = Math.min(100, pet.hunger + food.hunger);
    pet.exp = (pet.exp || 0) + food.exp;

    let levelUpMsg = "";
    const expNeeded = (pet.level || 1) * 100;
    if (pet.exp >= expNeeded) {
      pet.level = (pet.level || 1) + 1;
      pet.exp -= expNeeded;
      pet.stats = pet.stats || { ...petInfo.baseStats };
      pet.stats.attack += 2;
      pet.stats.defense += 1;
      pet.stats.luck += 1;
      levelUpMsg = `\n🎉 *WOHOO! Si ${pet.name} LEVEL UP jadi Level ${pet.level}!* 🎉`;
    }

    db.save();

    return m.reply(
      `Nyam... nyam... nyam! 🤤🍖\n\n` +
        `Si *${pet.name}* lahap banget makan *${food.name}* yang kamu kasih!\n` +
        `🍖 Perutnya keisi *+${food.hunger}* (${pet.hunger}/100)\n` +
        `✨ Dapet EXP *+${food.exp}*` +
        levelUpMsg
    );
  }

  if (action === "train") {
    if (pet.hunger < 20) {
      return m.reply(`Tega bener nyuruh latihan pas lagi kelaparan! 😭\nSi ${pet.name} perutnya keroncongan tuh, kasih makan dulu!`);
    }

    pet.hunger = Math.max(0, pet.hunger - 15);
    const expGain = 20 + Math.floor(Math.random() * 20);
    pet.exp = (pet.exp || 0) + expGain;

    let levelUpMsg = "";
    const expNeeded = (pet.level || 1) * 100;
    if (pet.exp >= expNeeded) {
      pet.level = (pet.level || 1) + 1;
      pet.exp -= expNeeded;
      pet.stats = pet.stats || { ...petInfo.baseStats };
      pet.stats.attack += 2;
      pet.stats.defense += 1;
      pet.stats.luck += 1;
      levelUpMsg = `\n🎉 *MANTAP! Si ${pet.name} LEVEL UP jadi Level ${pet.level}!* 🎉`;
    }

    db.save();

    let txt = `Hup! Hup! Hiyah!! 🏃‍♂️💨\n\n`;
    txt += `Si *${pet.name}* latihan fisik keras hari ini!\n`;
    txt += `✨ EXP Bertambah: *+${expGain}*\n`;
    txt += `😰 Rasa Lapar: *-15*\n`;
    txt += levelUpMsg;

    return m.reply(txt);
  }

  if (action === "rename") {
    const newName = args.slice(1).join(" ");
    if (!newName || newName.length < 2 || newName.length > 15) {
      return m.reply(`Nama apaan tuh kak? Jangan aneh-aneh ah, kasih yang bener (2-15 karakter)! 😂`);
    }

    const oldName = pet.name;
    pet.name = newName;
    db.save();

    return m.reply(`Sipp! Akte kelahirannya udah diubah.\nSekarang panggil dia *${newName}*! (Sebelumnya: ${oldName}) ✨`);
  }

  if (action === "evolve") {
    if (!petInfo.evolve) {
      return m.reply(`Batas keturunan si ${pet.name} cuma sampai sini kak, dia udah di bentuk sempurnanya! 🌟`);
    }

    if ((pet.level || 1) < 10) {
      return m.reply(`Sabar kak, si ${pet.name} masih ciut! Minimal *Level 10* baru bisa berevolusi (Sekarang baru level ${pet.level || 1}). 🐣`);
    }

    const evolvedPet = PET_TYPES[petInfo.evolve];
    pet.type = petInfo.evolve;
    pet.stats = { ...evolvedPet.baseStats };
    pet.level = 1;
    pet.exp = 0;

    db.save();

    return m.reply(
      `CLLINGGG!! ✨🌟\n\n` +
        `Si *${pet.name}* tiba-tiba bercahaya terang banget!\n` +
        `Wah, dia udah *berevolusi* jadi *${evolvedPet.name}* yang gagah!\n\n` +
        `Status barunya nge-reset ke awal tapi jadi jauh lebih kuat lho! Cek pake \`.pet status\` ya! 😎🔥`
    );
  }
}

export { pluginConfig as config, handler };
