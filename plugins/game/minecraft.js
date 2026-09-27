/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import {
  getOrCreateMCUser,
  getRandomOre,
  formatMoney,
  addPickExp,
  addPlayerExp,
  getUpgradedStats,
  doGachaPull,
  getStreakBonus,
  doCombat,
  doSmelt,
  doCraft,
  doJackpotPull,
  applyJackpotReward,
  getAvailableMobs,
  healPlayer,
  JACKPOT_POOLS,
} from "../../src/lib/elaina-minecraft.js";
import {
  biomes,
  travelRequirements,
  pickaxes,
  pickEnchants,
  mobData,
  RARITY_EMOJI,
  UPGRADES,
  DAILY_REWARDS,
  TOKEN_SHOP,
  GACHA_COST_COINS,
  GACHA_PITY_LIMIT,
  SMELT_RECIPES,
  CRAFT_RECIPES,
} from "../../src/lib/elaina-minecraft-data.js";
import config from "../../config.js";
import path from "path";
import fs from "fs";
import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";

const MC = 15;
const rc = (r) => RARITY_EMOJI[r] || "⬜";
const encCost = (r) =>
  ({
    common: 60000,
    rare: 600000,
    epic: 6e6,
    legendary: 6e7,
    mythic: 6e8,
    godly: 6e9,
    secret: 6e10,
  })[r] || 60000;

let thumbMC = null;
try {
  thumbMC = getAssetBuffer("rimuru-minecraft");
} catch (e) {}

function ctx() {
  const sId = config.saluran?.id || "120363412350560864@newsletter";
  const sName = config.saluran?.name || config.bot?.name || "Rimuru-AI";
  return {
    forwardingScore: 9999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: sId,
      newsletterName: sName,
      serverMessageId: 127,
    },
  };
}

function send(sock, m, text, title, body) {
  const msgId = sock.sendPreview(
    m.chat,
    {
      caption: `${config.info.website} ${text}`,
      url: `${config.info.website}`,
      title: `𝗠𝗜𝗡𝗘𝗖𝗥𝗔𝗙𝗧 𝗚𝗔𝗠𝗘𝗦`,
      description: `⛏️ tambang, 🛠️ craft, dan ⚔️ lawan mob di dunia minecraft`,
      jpegThumbnail: thumbMC,
      previewType: 0,
    },
    { quoted: m },
  );
  return { key: { id: msgId, remoteJid: m.chat, fromMe: true } };
}

const pluginConfig = {
  name: "mct",
  alias: ["minecraft"],
  category: "game",
  description: "Minecraft - Mining & Crafting Game",
  usage: ".mct <command>",
  example: ".mct help",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const cmd = m.command || m.body?.split(" ")[0]?.slice(1)?.toLowerCase() || "";
  const args = m.args || m.body?.split(" ").slice(1) || [];
  const sub = args[0]?.toLowerCase() || "";
  const sa = args.slice(1);

  if (cmd === "minecraft") {
    if (!sub || sub === "on" || sub === "off") {
      if (!m.isGroup) return m.reply("_Toggle hanya di grup_");
      if (!m.isOwner && !m.isAdmin) return m.reply("_Hanya admin/owner_");
      const gd = db.getGroup(m.chat) || {};
      if (sub === "on") {
        gd.minecraftEnabled = true;
        db.setGroup(m.chat, gd);
        return send(
          sock,
          m,
          `*🧱 MINECRAFT ENABLED*\n\n🎮 Semua member wajib main Minecraft!\n🪧 Ketik \`.mct help\` untuk mulai`,
          "🧱 Minecraft ON",
          "✅ Aktif",
        );
      }
      if (sub === "off") {
        gd.minecraftEnabled = false;
        db.setGroup(m.chat, gd);
        return send(
          sock,
          m,
          `*🧱 MINECRAFT DISABLED*`,
          "🧱 Minecraft OFF",
          "❌ Nonaktif",
        );
      }
      return m.reply(
        `*🧱 Minecraft:* ${gd.minecraftEnabled ? "✅ ON" : "❌ OFF"}\n\`.minecraft on/off\``,
      );
    }
  }

  if (cmd !== "mct" && cmd !== "minecraft") return;

  if (!sub || sub === "help" || sub === "menu") {
    return send(
      sock,
      m,
      `*🧱 MINECRAFT GAME*\n_⛏️ Sistem pertambangan & 🛠️ crafting terlengkap_\n\n` +
        `*⛏️ MINING*\n\`.mct mine\` _⛏️ Mulai menambang_\n\`.mct collect\` _📦 Ambil hasil_\n\`.mct sell\` _💸 Jual ore_\n\`.mct orebook\` _📚 Koleksi ore_\n\`.mct top\` _🏆 Leaderboard_\n\n` +
        `*⚔️ COMBAT*\n\`.mct fight\` _👹 Daftar mob_\n\`.mct fight <mob>\` _⚔️ Lawan mob_\n\`.mct heal\` _❤️ Sembuhkan HP_\n\`.mct stats\` _📊 Stats detail_\n\n` +
        `*👤 PROFILE*\n\`.mct me\` _🪪 Profil kamu_\n\`.mct daily\` _🎁 Daily reward_\n\n` +
        `*🗺️ BIOME & PICKAXE*\n\`.mct travel\` _🗺️ Daftar biome_\n\`.mct travel <biome>\` _🚪 Pindah biome_\n\`.mct shop\` _🛒 Toko pickaxe_\n\`.mct buy <pick>\` _💰 Beli pickaxe_\n\`.mct equip <pick>\` _🪓 Pasang pickaxe_\n\`.mct picks\` _🎒 Koleksi pickaxe_\n\`.mct enchant <key>\` _✨ Enchant pickaxe_\n\`.mct enchants\` _📜 Daftar enchant_\n\`.mct pickup\` _⬆️ Upgrade pickaxe_\n\n` +
        `*🔥 CRAFTING & SMELTING*\n\`.mct smelt\` _🔥 Smelt semua ore_\n\`.mct craft\` _🛠️ Daftar resep_\n\`.mct craft <id>\` _🧪 Craft item_\n\`.mct inv\` _🎒 Inventory_\n\n` +
        `*👑 PRESTIGE*\n\`.mct prestige\` _👑 Info prestige_\n\`.mct tokens\` _🪙 Token store_\n\`.mct upgrade\` _📈 Upgrade stats_\n\`.mct gacha\` _🎰 Gacha_\n\`.mct gacha ticket\` _🎟️ Gacha pakai tiket_\n\n` +
        `*🎰 JACKPOT*\n\`.mct jackpot\` _🎰 Daftar jackpot_\n\`.mct jackpot <tier>\` _💎 Main jackpot_\n_🎁 Jackpot bisa kasih _Premium_, _Partner_, _Energi_, _Limit_, bahkan _UNLIMITED_!_`,
      "🧱 Minecraft Game",
      "⛏️ Mining & 🛠️ Crafting",
    );
  }

  if (sub === "mine") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    if (mc.miningPending && mc.miningPending.length > 0)
      return m.reply(`_📦 Masih ada hasil tambang!_ \`.mct collect\` _dulu._`);
    const now = Date.now();
    if (mc.lastMineTime && now - mc.lastMineTime < MC * 1000)
      return m.reply(
        `_⏳ Tunggu *${Math.ceil((MC * 1000 - (now - mc.lastMineTime)) / 1000)}* detik_`,
      );
    const pk = mc.usedPickaxe || "woodpick";
    const pick = mc.pickaxes[pk];
    if (!pick) return m.reply(`_🪓 Pickaxe aktif tidak ada!_ \`.mct picks\``);
    const bk = mc.currentBiome || "plains";
    const st = getUpgradedStats(mc, pick);
    const ePick = {
      ...pick,
      luck: st.luck,
      speed: st.speed,
      fortuneBonus: st.fortune,
      sellMultiplier: st.sellMultiplier,
    };
    const ores = [];
    let tv = 0;
    for (let i = 0; i < (pick.comboOre || 1); i++) {
      const ore = getRandomOre(ePick, bk);
      if (ore) {
        ore.price = Math.round(ore.price * getStreakBonus(mc.streak || 0).mult);
        ores.push(ore);
        tv += ore.price;
      }
    }
    mc.miningPending = ores;
    mc.lastMineTime = now;
    mc.streak = (mc.streak || 0) + 1;
    await send(
      sock,
      m,
      `*_⛏️ Menambang di ${biomes[bk]?.name || bk}..._*\n_🪓 Pick: ${pick.name} | 🍀 Luck: ${(st.luck * 100).toFixed(1)}%_`,
      "⛏️ Menambang...",
      biomes[bk]?.name || "",
    );
    await new Promise((r) =>
      setTimeout(
        r,
        Math.min(Math.max(2000, 5000 - (pick.speed || 0) * 3000), 4000),
      ),
    );
    let txt = `*⛏️ HASIL MENAMBANG!*\n\n`;
    for (const o of ores) {
      txt += `${rc(o.rarity)} *${o.name}*\n   _💰 ${formatMoney(o.price)} | 📦 x${o.stack}_\n`;
    }
    txt += `\n*💰 Total: ${formatMoney(tv)}*`;
    if (mc.streak >= 3) txt += `\n_🔥 Streak: ${mc.streak}x_`;
    txt += `\n\n\`.mct collect\` untuk 📦 mengambil!`;
    db.markDirty("users");
    return send(sock, m, txt, "⛏️ Hasil Menambang!", `💰 ${formatMoney(tv)}`);
  }

  if (sub === "collect") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    if (!mc.miningPending || mc.miningPending.length === 0)
      return m.reply(`_📭 Tidak ada hasil._ \`.mct mine\` _dulu!_`);
    const ores = mc.miningPending;
    let tv = 0,
      te = 0,
      nf = [];
    for (const ore of ores) {
      tv += ore.price;
      te += Math.max(10, Math.floor(ore.price / 50));
      const cn = ore.name.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").trim();
      if (!mc.oreFound.includes(cn)) {
        mc.oreFound.push(cn);
        nf.push(cn);
      }
    }
    mc.money = (mc.money || 0) + tv;
    mc.blocksMined =
      (mc.blocksMined || 0) + ores.reduce((a, o) => a + (o.stack || 1), 0);
    mc.totalEarned = (mc.totalEarned || 0) + tv;
    mc.inventory = [...(mc.inventory || []), ...ores];
    const rlu = addPickExp(mc, mc.usedPickaxe || "woodpick", te);
    const plu = addPlayerExp(mc, te);
    mc.miningPending = [];
    let txt = `*📦 HASIL DIAMBIL!*\n\n💰 +${formatMoney(tv)}\n⭐ +${te} EXP\n🧱 +${ores.length} ore\n`;
    if (nf.length > 0) txt += `\n*🆕 Ore Baru:* ${nf.join(", ")}`;
    if (rlu) txt += `\n\n${rlu}`;
    if (plu) txt += `\n*⬆️ LEVEL UP! Level ${mc.level}*`;
    db.markDirty("users");
    return send(sock, m, txt, "📦 Hasil Diambil!", `💰 +${formatMoney(tv)}`);
  }

  if (sub === "sell") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    if (!mc.inventory || mc.inventory.length === 0)
      return m.reply(`_🎒 Inventory kosong!_ \`.mct mine\` _dulu._`);
    let tv = 0;
    for (const item of mc.inventory) tv += item.price || 0;
    const sb = UPGRADES.fortune.effect(mc.fortuneUpgrade || 0);
    const pick = mc.pickaxes[mc.usedPickaxe || "woodpick"];
    const rsm = pick ? pick.sellMultiplier || 0 : 0;
    const fv = Math.round(tv * (1 + sb + rsm));
    const fc2 = mc.inventory.length;
    mc.money = (mc.money || 0) + fv;
    mc.totalEarned = (mc.totalEarned || 0) + fv;
    mc.inventory = [];
    db.markDirty("users");
    return send(
      sock,
      m,
      `*💸 ORE TERJUAL!*\n\n📦 Jumlah: ${fc2}\n💰 Total: ${formatMoney(fv)}\n🏦 Saldo: ${formatMoney(mc.money)}`,
      "💸 Ore Terjual!",
      `💰 ${formatMoney(fv)}`,
    );
  }

  if (sub === "me") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    const pick = mc.pickaxes[mc.usedPickaxe || "woodpick"];
    return send(
      sock,
      m,
      `*👤 PROFIL PENAMBANG*\n\n*⬆️ Level:* ${mc.level} _(${mc.exp}/${mc.expToNextLevel} EXP)_\n*💰 Uang:* ${formatMoney(mc.money)}\n*❤️ HP:* ${mc.hp}/${mc.maxHp}\n*⚔️ ATK:* ${mc.atk}\n*🧱 Blocks:* ${mc.blocksMined}\n*🪓 Pick:* ${pick ? pick.name : "🪵 Wooden Pickaxe"} _(Lv.${pick ? pick.level : 1})_\n*🗺️ Biome:* ${biomes[mc.currentBiome] ? biomes[mc.currentBiome].name : mc.currentBiome}\n*🔥 Streak:* ${mc.streak || 0}\n*⚔️ Combat:* ${mc.combatWins || 0}W/${mc.combatLosses || 0}L\n*👑 Prestige:* ${mc.prestige || 0}\n*🪙 Tokens:* ${mc.prestigeTokens || 0}\n*🎟️ Tickets:* ${mc.gachaTickets || 0}\n*📚 OreBook:* ${mc.oreFound ? mc.oreFound.length : 0}\n*📈 Upgrades:*\n  _🍀 Luck: Lv.${mc.luckUpgrade || 0}_\n  _⚡ Speed: Lv.${mc.speedUpgrade || 0}_\n  _💎 Fortune: Lv.${mc.fortuneUpgrade || 0}_\n  _⚔️ Combat: Lv.${mc.combatUpgrade || 0}_`,
      "👤 Profil",
      `⬆️ Level ${mc.level}`,
    );
  }

  if (sub === "stats") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    const pick = mc.pickaxes[mc.usedPickaxe || "woodpick"];
    const st = getUpgradedStats(mc, pick);
    let txt = `*📊 STATS DETAIL*\n\n*🪓 Pick: ${pick ? pick.name : "Tidak Ada"}*\n  _⬆️ Lv.${pick ? pick.level : 1}/${pick ? pick.maxLevel : 5} | ⭐ EXP ${pick ? pick.exp : 0}/${pick ? pick.expToNextLevel : 100}_\n  _🍀 Luck: ${(st.luck * 100).toFixed(1)}% | ⚡ Speed: ${(st.speed * 100).toFixed(1)}%_\n  _💎 Fortune: +${(st.fortune * 100).toFixed(1)}% | 💰 Sell: +${(st.sellMultiplier * 100).toFixed(1)}%_\n`;
    if (pick && pick.enchant) {
      const e = pickEnchants[pick.enchant];
      txt += `  _✨ Enchant: ${e ? e.name : pick.enchant} (${e ? e.rarity : "?"})_\n`;
    }
    txt += `\n*⚔️ Combat*\n  _⚔️ ATK: ${mc.atk} | ❤️ HP: ${mc.hp}/${mc.maxHp}_\n  _🔥 Combat Bonus: +${(UPGRADES.combat.effect(mc.combatUpgrade || 0) * 100).toFixed(1)}%_\n  _🏆 Wins: ${mc.combatWins || 0} | 💀 Losses: ${mc.combatLosses || 0}_\n`;
    txt += `\n*📈 Upgrades*\n  _🍀 Luck: Lv.${mc.luckUpgrade || 0} (+${(UPGRADES.luck.effect(mc.luckUpgrade || 0) * 100).toFixed(1)}%)_\n  _⚡ Speed: Lv.${mc.speedUpgrade || 0} (+${(UPGRADES.speed.effect(mc.speedUpgrade || 0) * 100).toFixed(1)}%)_\n  _💎 Fortune: Lv.${mc.fortuneUpgrade || 0} (+${(UPGRADES.fortune.effect(mc.fortuneUpgrade || 0) * 100).toFixed(1)}%)_\n  _⚔️ Combat: Lv.${mc.combatUpgrade || 0} (+${(UPGRADES.combat.effect(mc.combatUpgrade || 0) * 100).toFixed(1)}%)_`;
    return send(sock, m, txt, "📊 Stats Detail", pick ? pick.name : "");
  }

  if (sub === "orebook") {
    const user = getOrCreateMCUser(db, m.sender);
    const found = user.minecraft.oreFound || [];
    if (found.length === 0)
      return m.reply(`_📚 Ore Book kosong!_ \`.mct mine\` _dulu_`);
    let txt = `*📚 ORE BOOK* _(${found.length} ore)_\n\n`;
    for (const [k, b] of Object.entries(biomes)) {
      const fl = b.listOre.filter((o) =>
        found.includes(o.name.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").trim()),
      );
      if (fl.length > 0) {
        txt += `*${b.name}*\n`;
        for (const o of fl) txt += `  ${rc(o.rarity)} ${o.name}\n`;
        txt += `\n`;
      }
    }
    return send(sock, m, txt.trim(), "📚 Ore Book", `🧱 ${found.length} ore`);
  }

  if (sub === "travel") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    if (!sa[0]) {
      let txt = `*🗺️ DAFTAR BIOME*\n\n`;
      for (const [k, b] of Object.entries(biomes)) {
        const req = travelRequirements[k];
        const ok = (mc.travelFound || []).includes(k);
        txt += `${ok ? "✅" : "🔒"} *${b.name}*${mc.currentBiome === k ? " _< Now_" : ""}\n`;
        txt += req
          ? `   _💰 ${formatMoney(req.money)} | 🧱 ${req.blocks} blocks_\n`
          : `   _🆓 Free_\n`;
      }
      return send(
        sock,
        m,
        txt + `\n\`.mct travel <biome>\``,
        "🗺️ Daftar Biome",
        biomes[mc.currentBiome || "plains"]?.name || "",
      );
    }
    const tk = sa[0].toLowerCase();
    if (!biomes[tk]) return m.reply(`_🗺️ Biome tidak ada!_ \`.mct travel\``);
    if (mc.currentBiome === tk)
      return m.reply(`_📍 Sudah di ${biomes[tk].name}!_`);
    const req = travelRequirements[tk];
    if (req) {
      if ((mc.money || 0) < req.money)
        return m.reply(`_💸 Uang kurang! Butuh ${formatMoney(req.money)}_`);
      if ((mc.blocksMined || 0) < req.blocks)
        return m.reply(`_🧱 Blocks kurang! Butuh ${req.blocks}_`);
      mc.money -= req.money;
    }
    if (!(mc.travelFound || []).includes(tk))
      mc.travelFound = [...(mc.travelFound || []), tk];
    mc.currentBiome = tk;
    db.markDirty("users");
    return send(
      sock,
      m,
      `*🚪 PINDAH BIOME!*\n\n📍 Sekarang di *${biomes[tk].name}*\n🧱 ${biomes[tk].listOre.length} jenis ore tersedia`,
      "🚪 Travel!",
      biomes[tk].name,
    );
  }

  if (sub === "shop") {
    let txt = `*🛒 TOKO PICKAXE*\n\n`;
    for (const [k, pick] of Object.entries(pickaxes)) {
      if (pick.price > 0)
        txt += `*${pick.name}*\n   _💰 ${formatMoney(pick.price)}_\n   _🍀 Luck +${(pick.luck * 100).toFixed(0)}% | ⚡ Speed +${(pick.speed * 100).toFixed(0)}% | 📦 Combo: ${pick.comboOre}_\n   _${pick.description}_\n\n`;
    }
    return send(
      sock,
      m,
      txt + `\`.mct buy <pick>\``,
      "🛒 Toko Pickaxe",
      "🪓 Pilih pickaxe terbaik",
    );
  }

  if (sub === "buy") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    const pk = sa[0] ? sa[0].toLowerCase() : "";
    if (!pk) return m.reply(`_🪓 Tentukan pickaxe!_ \`.mct shop\``);
    if (!pickaxes[pk]) return m.reply(`_🪓 Pickaxe tidak ada!_ \`.mct shop\``);
    if (mc.pickaxes[pk])
      return m.reply(`_✅ Sudah punya ${pickaxes[pk].name}!_`);
    if (pickaxes[pk].price === 0)
      return m.reply(`_🪙 Pickaxe ini dari Token/Prestige!_`);
    if ((mc.money || 0) < pickaxes[pk].price)
      return m.reply(
        `_💸 Uang kurang! Butuh ${formatMoney(pickaxes[pk].price)}_`,
      );
    mc.money -= pickaxes[pk].price;
    mc.pickaxes[pk] = { ...pickaxes[pk] };
    db.markDirty("users");
    return send(
      sock,
      m,
      `*🛍️ PICKAXE DIBELI!*\n\n*${pickaxes[pk].name}*\n_🪓 Ketik_ \`.mct equip ${pk}\` _untuk memasang_`,
      "🪓 Pickaxe Baru!",
      pickaxes[pk].name,
    );
  }

  if (sub === "equip") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    const pk = sa[0] ? sa[0].toLowerCase() : "";
    if (!pk) return m.reply(`_🪓 Tentukan pickaxe!_ \`.mct picks\``);
    if (!mc.pickaxes[pk])
      return m.reply(`_📭 Tidak punya pickaxe ini!_ \`.mct picks\``);
    mc.usedPickaxe = pk;
    db.markDirty("users");
    return send(
      sock,
      m,
      `*🪓 PICKAXE DIPASANG!*\n\n*${mc.pickaxes[pk].name}* _✅ sekarang aktif_`,
      "🪓 Equip Pickaxe!",
      mc.pickaxes[pk].name,
    );
  }

  if (sub === "picks") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    const pks = mc.pickaxes || {};
    if (Object.keys(pks).length === 0)
      return m.reply(`_📭 Tidak punya pickaxe!_`);
    let txt = `*🎒 KOLEKSI PICKAXE*\n\n`;
    for (const [k, pick] of Object.entries(pks)) {
      txt += `*${pick.name}*${mc.usedPickaxe === k ? " _✅ AKTIF_" : ""}\n  _⬆️ Lv.${pick.level || 1}/${pick.maxLevel} | 🍀 Luck ${(pick.luck * 100).toFixed(0)}% | ⚡ Speed ${(pick.speed * 100).toFixed(0)}%_\n`;
      if (pick.enchant)
        txt += `  _✨ Enchant: ${pickEnchants[pick.enchant] ? pickEnchants[pick.enchant].name : pick.enchant}_\n`;
    }
    return send(
      sock,
      m,
      txt + `\n\`.mct equip <pick>\``,
      "🎒 Koleksi Pickaxe",
      `🪓 ${Object.keys(pks).length} pickaxe`,
    );
  }

  if (sub === "enchant") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    const pk = mc.usedPickaxe || "woodpick";
    const pick = mc.pickaxes[pk];
    if (!pick) return m.reply(`_🪓 Pickaxe aktif tidak ada!_`);
    const ek = sa[0] ? sa[0].toLowerCase() : "";
    if (!ek) {
      if (pick.enchant) {
        const e = pickEnchants[pick.enchant];
        return m.reply(
          `_✨ Enchant saat ini: *${e ? e.name : pick.enchant}* (${e ? e.rarity : "?"})_\n\`.mct enchant <key>\` untuk ganti`,
        );
      }
      return m.reply(`_✨ Tentukan enchant!_ \`.mct enchants\``);
    }
    if (!pickEnchants[ek])
      return m.reply(`_✨ Enchant tidak ada!_ \`.mct enchants\``);
    const ench = pickEnchants[ek];
    const cost = encCost(ench.rarity);
    if ((mc.money || 0) < cost)
      return m.reply(`_💸 Uang kurang! Butuh ${formatMoney(cost)}_`);
    mc.money -= cost;
    pick.enchant = ek;
    db.markDirty("users");
    return send(
      sock,
      m,
      `*✨ ENCHANT DIPASANG!*\n\n*${ench.name}* _(${ench.rarity})_ ke *${pick.name}*\n_${ench.desc}_\n_💰 Biaya: ${formatMoney(cost)}_`,
      "✨ Enchant!",
      ench.name,
    );
  }

  if (sub === "enchants") {
    const byR = {};
    for (const [k, e] of Object.entries(pickEnchants)) {
      if (!byR[e.rarity]) byR[e.rarity] = [];
      byR[e.rarity].push({ key: k, name: e.name, desc: e.desc });
    }
    let txt = `*📜 DAFTAR ENCHANTMENT*\n\n`;
    for (const r of [
      "common",
      "rare",
      "epic",
      "legendary",
      "mythic",
      "godly",
      "secret",
    ]) {
      const list = byR[r];
      if (!list) continue;
      txt += `${rc(r)} *${r.toUpperCase()}* _${formatMoney(encCost(r))}_\n`;
      for (const e of list) txt += `  \`${e.key}\`: ${e.name} _${e.desc}_\n`;
      txt += `\n`;
    }
    return send(
      sock,
      m,
      txt.trim() + `\n\`.mct enchant <key>\``,
      "📜 Enchantments",
      "✨ Pilih enchant",
    );
  }

  if (sub === "pickup") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    const pk = mc.usedPickaxe || "woodpick";
    const pick = mc.pickaxes[pk];
    if (!pick) return m.reply(`_🪓 Pickaxe aktif tidak ada!_`);
    if (pick.level >= pick.maxLevel)
      return m.reply(`_⬆️ Pickaxe sudah max level!_`);
    const cost =
      Math.floor(pick.price * 0.1 * pick.level) || 12000 * pick.level;
    if ((mc.money || 0) < cost)
      return m.reply(`_💸 Uang kurang! Butuh ${formatMoney(cost)}_`);
    mc.money -= cost;
    const res = addPickExp(mc, pk, Math.floor(pick.expToNextLevel * 0.5));
    db.markDirty("users");
    return send(
      sock,
      m,
      res
        ? `*⬆️ PICKAXE UPGRADED!*\n\n${res}\n_💰 Biaya: ${formatMoney(cost)}_`
        : `*⭐ PICKAXE EXP UP!*\n\n⭐ +${Math.floor(pick.expToNextLevel * 0.5)} EXP\n_💰 Biaya: ${formatMoney(cost)}_`,
      "⬆️ Pickaxe Upgrade!",
      pick.name,
    );
  }

  if (sub === "fight") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    if (!sa[0]) {
      const mobs = getAvailableMobs(mc);
      if (mobs.length === 0)
        return m.reply(`_👹 Tidak ada mob tersedia! Naikkan level dulu._`);
      let txt = `*👹 DAFTAR MOB*\n\n_❤️ HP: ${mc.hp}/${mc.maxHp} | ⚔️ ATK: ${mc.atk}_\n\n`;
      for (const mob of mobs) {
        txt += `${rc(mob.rarity)} *${mob.name}*\n  _❤️ HP: ${mob.hp} | ⚔️ ATK: ${mob.atk} | ⬆️ Lv.${mob.minLevel}+_  \n`;
      }
      txt += `\n\`.mct fight <mob>\` untuk ⚔️ menyerang!`;
      return send(sock, m, txt, "👹 Daftar Mob", `👾 ${mobs.length} mob`);
    }
    const mk = sa[0].toLowerCase();
    if (!mobData[mk]) return m.reply(`_👹 Mob tidak ada!_ \`.mct fight\``);
    const result = doCombat(mc, mk);
    if (result.error) return m.reply(`_${result.error}_`);
    db.markDirty("users");
    if (result.won) {
      let txt = `*🏆 KAMU MENANG!*\n\n⚔️ Melawan *${result.mobName}*\n\n`;
      for (const line of result.log) txt += `${line}\n`;
      txt += `\n*⭐ EXP:* +${result.expGain}`;
      if (result.drops.length > 0) {
        txt += `\n*🎁 Drops:*`;
        for (const d of result.drops)
          txt += `\n  ${d.name} _💰 ${formatMoney(d.value)}_`;
      }
      return send(sock, m, txt, "🏆 Menang!", result.mobName);
    } else {
      let txt = `*💀 KAMU KALAH!*\n\n⚔️ Melawan *${result.mobName}*\n\n`;
      for (const line of result.log) txt += `${line}\n`;
      txt += `\n_❤️ HP tersisa: ${mc.hp}/${mc.maxHp}_\n\`.mct heal\` untuk ❤️ sembuh`;
      return send(sock, m, txt, "💀 Kalah!", result.mobName);
    }
  }

  if (sub === "heal") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    const result = healPlayer(mc);
    if (result.error) return m.reply(`_${result.error}_`);
    db.markDirty("users");
    return send(
      sock,
      m,
      `*❤️ HEAL!*\n\n❤️ HP: ${result.hp}/${mc.maxHp}\n_💰 Biaya: ${formatMoney(result.cost)}_`,
      "❤️ Heal!",
      `❤️ ${result.hp}`,
    );
  }

  if (sub === "smelt") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    const result = doSmelt(mc);
    if (result.count === 0)
      return m.reply(`_🔥 Tidak ada ore yang bisa di-smelt!_`);
    mc.money = (mc.money || 0) + result.totalValue;
    mc.totalEarned = (mc.totalEarned || 0) + result.totalValue;
    let txt = `*🔥 SMELTING SELESAI!*\n\n`;
    for (const s of result.smelted)
      txt += `${s.from} → ${s.to} _💰 ${formatMoney(s.value)}_\n`;
    txt += `\n*💰 Total: ${formatMoney(result.totalValue)}*\n*🏦 Saldo: ${formatMoney(mc.money)}*`;
    db.markDirty("users");
    return send(
      sock,
      m,
      txt,
      "🔥 Smelting!",
      `💰 ${formatMoney(result.totalValue)}`,
    );
  }

  if (sub === "craft") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    if (!sa[0]) {
      let txt = `*🛠️ DAFTAR CRAFTING*\n\n`;
      for (const [k, r] of Object.entries(CRAFT_RECIPES)) {
        const canCraft = (mc.level || 1) >= r.requiredLevel;
        txt += `${canCraft ? "✅" : "🔒"} *${r.name}* _\`${k}\`_\n  _💰 Value: ${formatMoney(r.value)} | ⬆️ Lv.${r.requiredLevel}+_\n  _🧪 Bahan:_\n`;
        for (const [ing, cnt] of Object.entries(r.ingredients))
          txt += `    _${ing} x${cnt}_\n`;
        txt += `\n`;
      }
      return send(
        sock,
        m,
        txt + `\`.mct craft <id>\``,
        "🛠️ Crafting",
        "🧪 Pilih resep",
      );
    }
    const result = doCraft(mc, sa[0].toLowerCase());
    if (result.error) return m.reply(`_${result.error}_`);
    db.markDirty("users");
    return send(
      sock,
      m,
      `*🛠️ CRAFTING BERHASIL!*\n\n*${result.item}*\n_💰 Value: ${formatMoney(result.value)}_`,
      "🛠️ Crafted!",
      result.item,
    );
  }

  if (sub === "inv" || sub === "inventory") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    if (!mc.inventory || mc.inventory.length === 0)
      return m.reply(`_🎒 Inventory kosong!_`);
    const grouped = {};
    for (const item of mc.inventory) {
      const key = item.name;
      if (!grouped[key]) grouped[key] = { name: item.name, count: 0, value: 0 };
      grouped[key].count++;
      grouped[key].value += item.price || 0;
    }
    let txt = `*🎒 INVENTORY*\n\n`;
    let totalV = 0;
    for (const g of Object.values(grouped)) {
      txt += `${g.name} _📦 x${g.count} | 💰 ${formatMoney(g.value)}_\n`;
      totalV += g.value;
    }
    txt += `\n*💰 Total Value: ${formatMoney(totalV)}*`;
    return send(
      sock,
      m,
      txt,
      "🎒 Inventory",
      `📦 ${mc.inventory.length} items`,
    );
  }

  if (sub === "daily") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    const now = new Date();
    if (mc.lastDaily) {
      const diff = now.getTime() - new Date(mc.lastDaily).getTime();
      if (diff < 86400000)
        return m.reply(
          `_🎁 Daily sudah diambil! Tunggu *${Math.ceil((86400000 - diff) / 3600000)}* jam._`,
        );
    }
    const ld = mc.lastDaily ? new Date(mc.lastDaily) : null;
    mc.dailyStreak =
      ld && now.getTime() - ld.getTime() < 172800000
        ? (mc.dailyStreak || 0) + 1
        : 1;
    let rw = DAILY_REWARDS[0];
    for (const r of DAILY_REWARDS) {
      if (mc.dailyStreak >= r.streak) rw = r;
    }
    mc.money = (mc.money || 0) + rw.money;
    mc.gachaTickets = (mc.gachaTickets || 0) + rw.tickets;
    mc.lastDaily = now.toISOString();
    db.markDirty("users");
    return send(
      sock,
      m,
      `*🎁 DAILY REWARD!*\n\n*🔥 Streak:* ${mc.dailyStreak} hari\n💰 +${formatMoney(rw.money)}\n🎟️ +${rw.tickets} Tiket Gacha\n*🏦 Saldo:* ${formatMoney(mc.money)}`,
      "🎁 Daily Reward!",
      `🔥 Streak ${mc.dailyStreak}`,
    );
  }

  if (sub === "gacha") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    const useT = sa[0] && sa[0].toLowerCase() === "ticket";
    if (useT) {
      if ((mc.gachaTickets || 0) < 1)
        return m.reply(`_🎟️ Tiket habis! Punya ${mc.gachaTickets || 0}_`);
      mc.gachaTickets -= 1;
    } else {
      if ((mc.money || 0) < GACHA_COST_COINS)
        return m.reply(
          `_💸 Uang kurang! Butuh ${formatMoney(GACHA_COST_COINS)}_`,
        );
      mc.money -= GACHA_COST_COINS;
    }
    const result = doGachaPull(mc);
    const item = result.item;
    let txt = `*🎰 GACHA RESULT!*\n\n`;
    switch (item.type) {
      case "pickaxe":
        if (pickaxes[item.value] && !mc.pickaxes[item.value]) {
          mc.pickaxes[item.value] = { ...pickaxes[item.value] };
          txt += `🪓 DAPAT PICKAXE: *${item.label}*\n`;
        } else if (mc.pickaxes[item.value]) {
          const ref = Math.floor(
            (pickaxes[item.value] ? pickaxes[item.value].price : 0) * 0.3 ||
              120000,
          );
          mc.money = (mc.money || 0) + ref;
          txt += `♻️ Duplikat: *${item.label}* _💰 +${formatMoney(ref)}_\n`;
        }
        break;
      case "tickets":
        mc.gachaTickets = (mc.gachaTickets || 0) + item.value;
        txt += `🎟️ +${item.value} Tiket\n`;
        break;
      case "tokens":
        mc.prestigeTokens = (mc.prestigeTokens || 0) + item.value;
        txt += `🪙 +${item.value} Tokens\n`;
        break;
      case "coins":
        mc.money = (mc.money || 0) + item.value;
        txt += `💰 +${formatMoney(item.value)}\n`;
        break;
      case "enchant_scroll": {
        const avail = Object.entries(pickEnchants).filter(
          ([, v]) => v.rarity === item.value,
        );
        if (avail.length > 0) {
          const [ek2, ed] = avail[Math.floor(Math.random() * avail.length)];
          const pk2 = mc.usedPickaxe || "woodpick";
          if (mc.pickaxes[pk2]) {
            mc.pickaxes[pk2].enchant = ek2;
            txt += `✨ Enchant: *${ed.name}* _(${item.value})_ ke pickaxe!\n`;
          }
        }
        break;
      }
      case "xp_boost":
        mc.exp = (mc.exp || 0) + Math.floor(mc.expToNextLevel * 0.5);
        txt += `⭐ XP Boost x${item.value}!\n`;
        break;
      default:
        txt += `${item.label}\n`;
    }
    if (result.isSSR) txt += `\n*🌈 SSR PULL!*`;
    if (result.pity) txt += `\n*🔥 Pity Activated!*`;
    txt += `\n\n_🔥 Pity: ${mc.gachaPity}/${GACHA_PITY_LIMIT}_\n_🏦 Saldo: ${formatMoney(mc.money)} | 🎟️ Tiket: ${mc.gachaTickets}_`;
    db.markDirty("users");
    return send(
      sock,
      m,
      txt,
      "🎰 Gacha!",
      result.isSSR ? "🌈 SSR PULL!" : "🎁 Result",
    );
  }

  if (sub === "upgrade") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    const type = sa[0] ? sa[0].toLowerCase() : "";
    if (!type || !UPGRADES[type]) {
      let txt = `*📈 UPGRADE SHOP*\n\n`;
      for (const [k, u] of Object.entries(UPGRADES)) {
        const lv = mc[k + "Upgrade"] || 0;
        txt += `*${u.name}* _(Lv.${lv}/${u.maxLevel})_\n  _${u.desc}_\n  ${lv >= u.maxLevel ? "_✅ MAXED_" : `_💰 Next: ${formatMoney(u.getCost(lv))}_`}\n\n`;
      }
      return send(
        sock,
        m,
        txt + `\`.mct upgrade <luck/speed/fortune/combat>\``,
        "📈 Upgrade Shop",
        "⬆️ Tingkatkan stats",
      );
    }
    const upg = UPGRADES[type];
    const lv = mc[type + "Upgrade"] || 0;
    if (lv >= upg.maxLevel) return m.reply(`_✅ Sudah max!_`);
    const cost = upg.getCost(lv);
    if ((mc.money || 0) < cost)
      return m.reply(`_💸 Uang kurang! Butuh ${formatMoney(cost)}_`);
    mc.money -= cost;
    mc[type + "Upgrade"] = lv + 1;
    if (type === "combat")
      mc.atk = 4 + Math.floor(mc.level * 0.5) + (lv + 1) * 3;
    db.markDirty("users");
    return send(
      sock,
      m,
      `*⬆️ ${upg.name} LEVEL UP!*\n\n_⬆️ Level ${lv + 1}_\n_💰 Biaya: ${formatMoney(cost)}_\n_${upg.desc}_`,
      "📈 Upgrade!",
      `${upg.name} Lv.${lv + 1}`,
    );
  }

  if (sub === "prestige") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    const cp = mc.prestige || 0;
    if (sa[0] && sa[0].toLowerCase() === "confirm") {
      const reqs = [
        { blocks: 500, money: 2e10 },
        { blocks: 1500, money: 2e12 },
        { blocks: 4000, money: 2e14 },
        { blocks: 10000, money: 2e19 },
        { blocks: 25000, money: 2e22 },
      ];
      const req = reqs[cp];
      if (!req) return m.reply(`_👑 Sudah max prestige!_`);
      if ((mc.blocksMined || 0) < req.blocks)
        return m.reply(`_🧱 Blocks kurang! Butuh ${req.blocks}_`);
      if ((mc.money || 0) < req.money)
        return m.reply(`_💸 Uang kurang! Butuh ${formatMoney(req.money)}_`);
      mc.prestige = cp + 1;
      mc.money = Math.floor(mc.money * 0.1);
      mc.blocksMined = 0;
      mc.streak = 0;
      mc.prestigeTokens =
        (mc.prestigeTokens || 0) + [60, 180, 600, 1200, 6000][cp];
      const titles = [
        "Penambang Baru",
        "Veteran",
        "Master Miner",
        "Legend",
        "Transcendent",
        "God of Mining",
      ];
      if (cp === 0 && !mc.pickaxes.prestigepick)
        mc.pickaxes.prestigepick = { ...pickaxes.prestigepick };
      if (cp === 2 && !mc.pickaxes.cosmicpick)
        mc.pickaxes.cosmicpick = { ...pickaxes.cosmicpick };
      db.markDirty("users");
      return send(
        sock,
        m,
        `*👑 PRESTIGE UP!*\n\n*🏷️ Title:* ${titles[mc.prestige]}\n*🪙 Tokens:* ${mc.prestigeTokens}\n\n_💸 Uang -90%, 🧱 blocks count reset_`,
        "👑 PRESTIGE!",
        titles[mc.prestige],
      );
    }
    let txt = `*👑 PRESTIGE SYSTEM*\n\n*👑 Prestige:* ${cp}\n*🪙 Tokens:* ${mc.prestigeTokens || 0}\n\n`;
    const allReqs = [
      { lv: 1, blocks: 500, money: 2e10, rw: "Prestige Pickaxe + 60 tokens" },
      { lv: 2, blocks: 1500, money: 2e12, rw: "Luck +20% + 180 tokens" },
      { lv: 3, blocks: 4000, money: 2e14, rw: "Cosmic Pickaxe + 600 tokens" },
      { lv: 4, blocks: 10000, money: 2e19, rw: "2x EXP + 1200 tokens" },
      { lv: 5, blocks: 25000, money: 2e22, rw: "Omega Pickaxe + 6000 tokens" },
    ];
    for (const r of allReqs)
      txt += `${cp >= r.lv ? "✅" : "🔒"} *P${r.lv}*: _🧱 ${r.blocks} blocks | 💰 ${formatMoney(r.money)}_\n  _${r.rw}_\n\n`;
    return send(
      sock,
      m,
      txt + `\`.mct prestige confirm\` _(hati-hati!)_`,
      "👑 Prestige",
      `P${cp}`,
    );
  }

  if (sub === "tokens") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    if (!sa[0]) {
      let txt = `*🪙 TOKEN STORE*\n\n*🪙 Tokens:* ${mc.prestigeTokens || 0}\n\n`;
      for (const item of TOKEN_SHOP)
        txt += `*${item.name}* _🪙 ${item.cost} tokens_\n`;
      return send(
        sock,
        m,
        txt + `\n\`.mct tokens <id>\``,
        "🪙 Token Store",
        `🪙 ${mc.prestigeTokens || 0} tokens`,
      );
    }
    const iid = sa[0].toLowerCase();
    const item = TOKEN_SHOP.find((i) => i.id === iid);
    if (!item) return m.reply(`_🛒 Item tidak ada!_ \`.mct tokens\``);
    if ((mc.prestigeTokens || 0) < item.cost)
      return m.reply(`_🪙 Tokens kurang! Butuh ${item.cost}_`);
    mc.prestigeTokens -= item.cost;
    switch (item.type) {
      case "pickaxe":
        if (pickaxes[item.value] && !mc.pickaxes[item.value]) {
          mc.pickaxes[item.value] = { ...pickaxes[item.value] };
        } else {
          mc.prestigeTokens += item.cost;
          return m.reply(`_✅ Sudah punya pickaxe ini!_`);
        }
        break;
      case "tickets":
        mc.gachaTickets = (mc.gachaTickets || 0) + item.value;
        break;
      case "coins":
        mc.money = (mc.money || 0) + item.value;
        break;
    }
    db.markDirty("users");
    return send(
      sock,
      m,
      `*🛍️ ITEM DIBELI!*\n\n*${item.name}* _seharga 🪙 ${item.cost} tokens_`,
      "🪙 Token Store!",
      item.name,
    );
  }

  if (sub === "jackpot") {
    const user = getOrCreateMCUser(db, m.sender);
    const mc = user.minecraft;
    if (!sa[0]) {
      let txt = `*🎰 JACKPOT SYSTEM*\n\n_💎 Sistem jackpot dengan hadiah super besar!_\n_🎁 Bisa dapat _Premium_, _Partner_, _Energi_, _Limit_, bahkan _UNLIMITED_!_\n\n`;
      for (const pool of JACKPOT_POOLS) {
        txt += `*${pool.name}*\n  _💰 Biaya: ${formatMoney(pool.cost)}_\n  _🎯 Rate: ${pool.weight}%_\n  _🎁 Rewards:_\n`;
        for (const rw of pool.rewards) {
          const label =
            {
              coins: "Koin",
              energi: "Energi",
              limit: "Limit",
              tickets: "Gacha Tickets",
              tokens: "Prestige Tokens",
              exp_boost: "EXP Boost",
              premium_7d: "Premium 7 Hari",
              premium_30d: "Premium 30 Hari",
              partner_7d: "Partner 7 Hari",
              partner_30d: "Partner 30 Hari",
              unlimited_energi: "UNLIMITED Energi",
              unlimited_limit: "UNLIMITED Limit",
              owner_reward: "OWNER REWARD",
            }[rw.type] || rw.type;
          txt += `    _${label}: ${rw.min === rw.max ? rw.min : `${rw.min}-${rw.max}`} (${rw.weight}%)_\n`;
        }
        txt += `\n`;
      }
      return send(
        sock,
        m,
        txt + `\`.mct jackpot <iron/gold/diamond/netherite/dragon>\``,
        "🎰 Jackpot!",
        "💎 Hadiah Super Besar",
      );
    }
    const poolId = sa[0].toLowerCase();
    const pool = JACKPOT_POOLS.find((p) => p.id === poolId);
    if (!pool) return m.reply(`_🎰 Tier tidak ada!_ \`.mct jackpot\``);
    if ((mc.money || 0) < pool.cost)
      return m.reply(`_💸 Uang kurang! Butuh ${formatMoney(pool.cost)}_`);
    mc.money -= pool.cost;
    const result = doJackpotPull(mc, poolId);
    if (!result) return m.reply(`_❌ Gagal! Coba lagi._`);
    const applied = applyJackpotReward(db, mc, m.sender, result);
    db.markDirty("users");
    let txt = `*🎰 ${pool.name.toUpperCase()}!*\n\n`;
    const isBig = [
      "premium_7d",
      "premium_30d",
      "partner_7d",
      "partner_30d",
      "unlimited_energi",
      "unlimited_limit",
      "owner_reward",
    ].includes(result.reward.type);
    if (isBig) txt += `*💥 JACKPOT BESAR!*\n\n`;
    txt += `${applied.desc}\n\n_💰 Biaya: ${formatMoney(pool.cost)}_\n_🏦 Saldo: ${formatMoney(mc.money)}_`;
    return send(
      sock,
      m,
      txt,
      isBig ? "💥 JACKPOT BESAR!" : `🎰 ${pool.name}`,
      applied.desc,
    );
  }

  if (sub === "top") {
    const users = db.db.data.users || {};
    const rankings = [];
    for (const [jid, ud] of Object.entries(users)) {
      if (ud.minecraft)
        rankings.push({
          jid,
          blocksMined: ud.minecraft.blocksMined || 0,
          money: ud.minecraft.money || 0,
          level: ud.minecraft.level || 1,
          prestige: ud.minecraft.prestige || 0,
        });
    }
    if (rankings.length === 0) return m.reply(`_👤 Belum ada pemain!_`);
    rankings.sort((a, b) => {
      if (b.prestige !== a.prestige) return b.prestige - a.prestige;
      if (b.blocksMined !== a.blocksMined) return b.blocksMined - a.blocksMined;
      return b.money - a.money;
    });
    let txt = `*🏆 LEADERBOARD MINECRAFT*\n\n`;
    const top = rankings.slice(0, 10);
    for (let i = 0; i < top.length; i++) {
      const p = top[i];
      const medal =
        i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
      txt += `${medal} @${p.jid}\n  _👑 P${p.prestige} | 🧱 ${p.blocksMined} blocks | 💰 ${formatMoney(p.money)}_\n`;
    }
    return send(sock, m, txt.trim(), "🏆 Leaderboard", "👑 Top Pemain");
  }
}

export { pluginConfig as config, handler };
