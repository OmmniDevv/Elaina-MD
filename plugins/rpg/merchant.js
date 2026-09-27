/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
const pluginConfig = {
  name: "merchant",
  alias: ["npc", "toko", "tokoku"],
  category: "rpg",
  description: "Jual beli item ke NPC merchant",
  usage: ".merchant <buy/sell> <item> <qty>",
  example: ".merchant buy potion 5",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

const SHOP_ITEMS = {
  potion: { name: "🧪 Potion", buyPrice: 100, sellPrice: 50, desc: "Pulihkan 50 HP" },
  manapotion: { name: "💙 Mana Potion", buyPrice: 150, sellPrice: 75, desc: "Pulihkan 50 Mana" },
  antidote: { name: "💊 Antidote", buyPrice: 80, sellPrice: 40, desc: "Sembuhkan racun" },
  bread: { name: "🍞 Roti", buyPrice: 30, sellPrice: 15, desc: "Pulihkan 10 stamina" },
  energydrink: { name: "⚡ Energy Drink", buyPrice: 200, sellPrice: 100, desc: "Pulihkan 50 stamina" },
  pickaxe: { name: "⛏️ Beliung", buyPrice: 500, sellPrice: 250, desc: "Untuk mining" },
  fishingrod: { name: "🎣 Joran", buyPrice: 400, sellPrice: 200, desc: "Untuk memancing" },
  wood: { name: "🪵 Kayu", buyPrice: 50, sellPrice: 25, desc: "Material dasar" },
  iron: { name: "🔩 Besi", buyPrice: 80, sellPrice: 40, desc: "Material logam" },
  leather: { name: "🧶 Kulit", buyPrice: 60, sellPrice: 30, desc: "Material armor" },
  string: { name: "🧵 Benang", buyPrice: 40, sellPrice: 20, desc: "Material busur" },
  herb: { name: "🌿 Herba", buyPrice: 70, sellPrice: 35, desc: "Bahan alchemy" },
  gold: { name: "🪙 Emas", buyPrice: 500, sellPrice: 250, desc: "Material langka" },
  diamond: { name: "💎 Berlian", buyPrice: 2000, sellPrice: 1000, desc: "Material mewah" },
};

function handler(m) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.inventory) user.inventory = {};

  const args = m.args || [];
  const action = args[0]?.toLowerCase();
  const itemKey = args[1]?.toLowerCase();
  const qty = Math.max(1, parseInt(args[2]) || 1);

  if (!action || !["buy", "sell", "list"].includes(action)) {
    let txt = `🏪 *ᴍᴇʀᴄʜᴀɴᴛ sʜᴏᴘ*\n\n`;
    txt += `> Selamat datang di toko!\n\n`;
    txt += `*📋 *ᴄᴏᴍᴍᴀɴᴅ:*
\n`;
    txt += `> ${m.prefix}merchant list\n`;
    txt += `> ${m.prefix}merchant buy <item> <qty>\n`;
    txt += `> ${m.prefix}merchant sell <item> <qty>\n`;
    txt += `\n\n`;
    txt += `💰 *Balance:* ${(user.koin || 0).toLocaleString()}`;
    return m.reply(txt);
  }

  if (action === "list") {
    let txt = `🏪 *ᴅᴀꜰᴛᴀʀ ɪᴛᴇᴍ*\n\n`;
    txt += `*📦 *sʜᴏᴘ:*
\n`;

    for (const [key, item] of Object.entries(SHOP_ITEMS)) {
      txt += `> ${item.name}\n`;
      txt += `> 💵 Beli: ${item.buyPrice.toLocaleString()}\n`;
      txt += `> 💰 Jual: ${item.sellPrice.toLocaleString()}\n`;
      txt += `> 📝 ${item.desc}\n`;
      txt += `> → \`${key}\`\n`;
      txt += `> \n`;
    }
    txt += ``;

    return m.reply(txt);
  }

  if (action === "buy") {
    if (!itemKey) {
      return m.reply(`❌ Tentukan item!\n\n> Contoh: \`${m.prefix}merchant buy potion 5\``);
    }

    const item = SHOP_ITEMS[itemKey];
    if (!item) {
      return m.reply(`❌ Item tidak ditemukan!\n\n> Ketik \`${m.prefix}merchant list\` untuk melihat daftar.`);
    }

    const totalCost = item.buyPrice * qty;
    if ((user.koin || 0) < totalCost) {
      return m.reply(`❌ *ʙᴀʟᴀɴᴄᴇ ᴋᴜʀᴀɴɢ*\n\n` + `> Harga: ${totalCost.toLocaleString()}\n` + `> Balance: ${(user.koin || 0).toLocaleString()}`);
    }

    user.koin -= totalCost;
    user.inventory[itemKey] = (user.inventory[itemKey] || 0) + qty;
    db.save();

    return m.reply(
      `✅ *ᴘᴇᴍʙᴇʟɪᴀɴ ʙᴇʀʜᴀsɪʟ*\n\n` +
        `*🛒 *ᴅᴇᴛᴀɪʟ:*
\n` +
        `> 📦 Item: *${item.name}*\n` +
        `> 📊 Qty: *${qty}*\n` +
        `> 💵 Total: *-${totalCost.toLocaleString()}*\n` +
        `> 💰 Sisa: *${user.koin.toLocaleString()}*\n` +
        ``,
    );
  }

  if (action === "sell") {
    if (!itemKey) {
      return m.reply(`❌ Tentukan item!\n\n> Contoh: \`${m.prefix}merchant sell iron 10\``);
    }

    const item = SHOP_ITEMS[itemKey];
    if (!item) {
      return m.reply(`❌ Item tidak bisa dijual ke merchant!`);
    }

    const have = user.inventory[itemKey] || 0;
    if (have < qty) {
      return m.reply(`❌ *ɪᴛᴇᴍ ᴋᴜʀᴀɴɢ*\n\n` + `> Punya: ${have}\n` + `> Mau jual: ${qty}`);
    }

    const totalEarn = item.sellPrice * qty;
    user.koin = (user.koin || 0) + totalEarn;
    user.inventory[itemKey] -= qty;
    if (user.inventory[itemKey] <= 0) delete user.inventory[itemKey];
    db.save();

    return m.reply(
      `✅ *ᴘᴇɴᴊᴜᴀʟᴀɴ ʙᴇʀʜᴀsɪʟ*\n\n` +
        `*💰 *ᴅᴇᴛᴀɪʟ:*
\n` +
        `> 📦 Item: *${item.name}*\n` +
        `> 📊 Qty: *${qty}*\n` +
        `> 💵 Total: *+${totalEarn.toLocaleString()}*\n` +
        `> 💰 Balance: *${user.koin.toLocaleString()}*\n` +
        ``,
    );
  }
}

export { pluginConfig as config, handler };
