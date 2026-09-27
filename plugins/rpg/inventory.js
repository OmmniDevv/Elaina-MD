/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "inventory",
  alias: ["inv", "tas", "bag"],
  category: "rpg",
  description: "Melihat isi inventory RPG",
  usage: ".inventory",
  example: ".inventory",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

const ITEMS = {
  common: { emote: "📦", name: "Common Crate" },
  uncommon: { emote: "🛍️", name: "Uncommon Crate" },
  mythic: { emote: "🎁", name: "Mythic Crate" },
  legendary: { emote: "💎", name: "Legendary Crate" },

  rock: { emote: "🪨", name: "Batu" },
  coal: { emote: "⚫", name: "Batubara" },
  iron: { emote: "⛓️", name: "Besi" },
  gold: { emote: "🥇", name: "Emas" },
  diamond: { emote: "💠", name: "Berlian" },
  emerald: { emote: "💚", name: "Emerald" },

  trash: { emote: "🗑️", name: "Sampah" },
  fish: { emote: "🐟", name: "Ikan" },
  prawn: { emote: "🦐", name: "Udang" },
  octopus: { emote: "🐙", name: "Gurita" },
  shark: { emote: "🦈", name: "Hiu" },
  whale: { emote: "🐳", name: "Paus" },

  potion: { emote: "🥤", name: "Health Potion" },
  mpotion: { emote: "🧪", name: "Mana Potion" },
  stamina: { emote: "⚡", name: "Stamina Potion" },

  herb: { emote: "🌿", name: "Herba" },
  leather: { emote: "👞", name: "Kulit" },
  mysterybox: { emote: "📦", name: "Mystery Box" },

  kunai: { emote: "🗡️", name: "Kunai" },
  shuriken: { emote: "⚔️", name: "Shuriken" },
  chakra: { emote: "🌀", name: "Chakra" },
  scroll: { emote: "📜", name: "Scroll Ninja" },
  bowlramen: { emote: "🍜", name: "Ramen" },
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);
  if (!user.inventory) user.inventory = {};

  let invText = `🎒 *Isi Tas Kamu Nih Kak!* ✨\n\n`;

  invText += `❤️ HP: *${user.rpg?.health || 100}*\n`;
  invText += `💸 Koin: *${(user.koin || 0).toLocaleString("id-ID")}*\n`;
  invText += `📈 EXP: *${(user.exp || 0).toLocaleString("id-ID")}*\n\n`;

  let hasItem = false;
  const categories = {
    "📦 *Koleksi Crates*": ["common", "uncommon", "mythic", "legendary"],
    "⛏️ *Hasil Tambang*": [
      "rock",
      "coal",
      "iron",
      "gold",
      "diamond",
      "emerald",
    ],
    "🎣 *Hasil Mancing*": [
      "trash",
      "fish",
      "prawn",
      "octopus",
      "shark",
      "whale",
    ],
    "🌿 *Hasil Dungeon*": ["herb", "leather", "mysterybox"],
    "🧪 *Potions & Buffs*": ["potion", "mpotion", "stamina"],
    "⛩️ *Perlengkapan Shinobi*": ["kunai", "shuriken", "chakra", "scroll", "bowlramen"],
  };

  for (const [catName, items] of Object.entries(categories)) {
    let catText = "";
    for (const itemKey of items) {
      const count = user.inventory[itemKey] || 0;
      if (count > 0) {
        const item = ITEMS[itemKey];
        catText += `${item.emote} ${item.name}: *${count}x*\n`;
        hasItem = true;
      }
    }
    if (catText) {
      invText += `${catName}\n`;
      invText += catText;
      invText += `\n`;
    }
  }

  if (!hasItem) {
    invText += `Loh, tas kamu masih kosong melompong kak! 🕸️\n`;
    invText += `Yuk main command RPG lain buat dapetin item seru! 🚀\n`;
  } else {
    invText += `Ketik *.use <nama item>* buat pake barangnya ya! 🎒💖\n`;
  }

  await m.reply(invText);
}

export { pluginConfig as config, handler };
