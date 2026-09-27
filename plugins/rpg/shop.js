/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "shop",
  alias: ["beli", "jual", "toko", "store", "buy", "sell"],
  category: "rpg",
  description: "Beli dan jual item RPG",
  usage: ".shop <buy/sell> <item> <jumlah>",
  example: ".shop buy potion 1",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

const ITEMS = {
  potion: { price: 500, type: "buyable", name: "🥤 Health Potion" },
  mpotion: { price: 500, type: "buyable", name: "🧪 Mana Potion" },
  stamina: { price: 1000, type: "buyable", name: "⚡ Stamina Potion" },

  common: { price: 2000, type: "buyable", name: "📦 Common Crate" },
  uncommon: { price: 10000, type: "buyable", name: "🛍️ Uncommon Crate" },
  mythic: { price: 50000, type: "buyable", name: "🎁 Mythic Crate" },
  legendary: { price: 200000, type: "buyable", name: "💎 Legendary Crate" },

  wheat: { price: 50, type: "buyable", name: "🌾 Gandum" },
  rice: { price: 50, type: "buyable", name: "🍚 Beras" },
  egg: { price: 100, type: "buyable", name: "🥚 Telur" },
  meat: { price: 300, type: "buyable", name: "🥩 Daging" },
  herb: { price: 150, type: "buyable", name: "🌿 Herba" },
  carrot: { price: 50, type: "buyable", name: "🥕 Wortel" },
  potato: { price: 50, type: "buyable", name: "🥔 Kentang" },
  strawberry: { price: 80, type: "buyable", name: "🍓 Stroberi" },
  watermelon: { price: 100, type: "buyable", name: "🍉 Semangka" },
  apple: { price: 50, type: "buyable", name: "🍎 Apel" },

  rock: { price: 20, type: "sellable", name: "🪨 Batu" },
  coal: { price: 50, type: "sellable", name: "⚫ Batubara" },
  iron: { price: 200, type: "sellable", name: "⛓️ Besi" },
  gold: { price: 1000, type: "sellable", name: "🥇 Emas" },
  diamond: { price: 5000, type: "sellable", name: "💠 Berlian" },
  emerald: { price: 10000, type: "sellable", name: "💚 Emerald" },

  trash: { price: 10, type: "sellable", name: "🗑️ Sampah" },
  fish: { price: 100, type: "sellable", name: "🐟 Ikan" },
  prawn: { price: 200, type: "sellable", name: "🦐 Udang" },
  octopus: { price: 500, type: "sellable", name: "🐙 Gurita" },
  shark: { price: 2000, type: "sellable", name: "🦈 Hiu" },
  whale: { price: 10000, type: "sellable", name: "🐳 Paus" },
  
  leather: { price: 50, type: "sellable", name: "👞 Kulit" },
  mysterybox: { price: 1500, type: "sellable", name: "📦 Mystery Box" },
  kunai: { price: 100, type: "sellable", name: "🗡️ Kunai" },
  shuriken: { price: 150, type: "sellable", name: "⚔️ Shuriken" },
  chakra: { price: 500, type: "sellable", name: "🌀 Chakra" },
  scroll: { price: 2000, type: "sellable", name: "📜 Scroll Ninja" },
  bowlramen: { price: 800, type: "sellable", name: "🍜 Ramen" },
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);
  const args = m.args || [];

  const action = args[0]?.toLowerCase();

  if (!action || (action !== "buy" && action !== "sell")) {
    let txt = `🏪 *Toko Kelontong RPG* ✨\n\n`;
    txt += `Halo kak! Selamat datang di toko kelontong.\nMau beli potion atau jual barang rongsokan nih? 😂\n\n`;
    
    txt += `*Cara Transaksi:* 💸\n`;
    txt += `Ketik \`.shop buy <nama> <jumlah>\` buat beli.\n`;
    txt += `Ketik \`.shop sell <nama> <jumlah>\` buat jual.\n\n`;

    txt += `*🛍️ Barang yang Dijual (BUY):*\n`;
    for (const [key, item] of Object.entries(ITEMS)) {
      if (item.type === "buyable") {
        txt += `${item.name}: *Rp ${item.price.toLocaleString("id-ID")}*\n`;
      }
    }
    txt += `\n`;

    txt += `*💰 Barang yang Diterima (SELL):*\n`;
    for (const [key, item] of Object.entries(ITEMS)) {
      if (item.type === "sellable") {
        txt += `${item.name}: *Rp ${item.price.toLocaleString("id-ID")}*\n`;
      }
    }

    return m.reply(txt);
  }

  const itemKey = args[1]?.toLowerCase();
  const amount = parseInt(args[2]) || 1;

  if (!itemKey || !ITEMS[itemKey]) {
    return m.reply(`Aduh kak, barang *${args[1] || "itu"}* nggak ada di daftar! 😭❌\nCoba cek lagi list barangnya ketik \`.shop\` ya.`);
  }

  const item = ITEMS[itemKey];

  if (action === "buy") {
    if (item.type !== "buyable") {
      return m.reply(`Hayo lho kak, barang *${item.name}* ini khusus buat dijual, nggak bisa dibeli! 🫣❌`);
    }

    const totalCost = item.price * amount;
    if ((user.koin || 0) < totalCost) {
      return m.reply(`Yahh, koin kamu kurang nih kak buat beli *${amount}x ${item.name}*! 😭😭\nKoin kamu: *Rp ${(user.koin || 0).toLocaleString("id-ID")}*\nKurang *Rp ${(totalCost - (user.koin || 0)).toLocaleString("id-ID")}* lagi. Nyari duit dulu gih! 💸🏃💨`);
    }

    user.koin = (user.koin || 0) - totalCost;
    user.inventory = user.inventory || {};
    user.inventory[itemKey] = (user.inventory[itemKey] || 0) + amount;

    db.save();
    return m.reply(`MAKASIH BANYAK KAK! 🎉✨\n\nKamu berhasil borong:\n🛒 Item: *${amount}x ${item.name}*\n💸 Total Bayar: *Rp ${totalCost.toLocaleString("id-ID")}*\n\nDitunggu kedatangannya lagi ya! 💖🛍️`);
  }

  if (action === "sell") {
    if (item.type !== "sellable") {
      return m.reply(`Maaf kak, toko kita nggak nerima barang *${item.name}* ini! Nggak laku dijual lagi soalnya 😂❌`);
    }

    const userInventory = user.inventory || {};
    const userStock = userInventory[itemKey] || 0;

    if (userStock < amount) {
      return m.reply(`Loh kak, barangnya kurang nih! 🫣\nKamu cuma punya *${userStock}x ${item.name}*, masa mau jual *${amount}*? Jangan ngibul dong! 😂❌`);
    }

    const totalProfit = item.price * amount;

    user.inventory = user.inventory || {};
    user.inventory[itemKey] = userStock - amount;
    user.koin = (user.koin || 0) + totalProfit;

    db.save();
    return m.reply(`CINGG! UANG MASUK! 💰✨\n\nKamu berhasil ngejual:\n📦 Item: *${amount}x ${item.name}*\n🤑 Total Dapat: *Rp ${totalProfit.toLocaleString("id-ID")}*\n\nMakasih ya udah cuci gudang di sini! 🎉💖`);
  }
}

export { pluginConfig as config, handler };
