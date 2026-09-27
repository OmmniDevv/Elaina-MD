/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "guild",
  alias: ["clan", "team", "kelompok"],
  category: "rpg",
  description: "Sistem guild/clan",
  usage: ".guild <create/join/leave/info>",
  example: ".guild create DragonSlayers",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 0,
  isEnabled: true,
};

function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};

  const args = m.args || [];
  const action = args[0]?.toLowerCase();
  const guildName = args.slice(1).join(" ");

  const guilds = db.db?.data?.guilds || {};

  if (!action || !["create", "join", "leave", "info", "list", "members", "deposit"].includes(action)) {
    let txt = `🏰 *SERIKAT GUILD RPG* 🏰\n\n`;
    txt += `Bangun atau gabung ke serikat buat dapet *benefit* bareng temen-temen lu!\n\n`;
    txt += `*Daftar Perintah:*\n`;
    txt += `🗡️ \`${m.prefix}guild create <nama>\` (Bikin Guild)\n`;
    txt += `🛡️ \`${m.prefix}guild join <nama>\` (Gabung Guild)\n`;
    txt += `🏃 \`${m.prefix}guild leave\` (Keluar Guild)\n`;
    txt += `📜 \`${m.prefix}guild info\` (Cek Stats Guild)\n`;
    txt += `👥 \`${m.prefix}guild members\` (Cek Anggota)\n`;
    txt += `💰 \`${m.prefix}guild deposit <amount>\` (Donasi Kas)\n`;
    txt += `🏆 \`${m.prefix}guild list\` (Top Guilds)\n\n`;

    if (user.rpg.guildId) {
      const myGuild = guilds[user.rpg.guildId];
      txt += `📌 Status: Tergabung di *${myGuild?.name || "Unknown"}*`;
    } else {
      txt += `📌 Status: *Jomblo Guild (Kagak Punya Temen)*`;
    }
    return m.reply(txt);
  }

  if (action === "list") {
    const guildList = Object.values(guilds);
    if (guildList.length === 0) {
      return m.reply(`Belum ada guild di server ini! Bikin dong pake \`${m.prefix}guild create <nama>\``);
    }

    let txt = `🏆 *DAFTAR TOP GUILD* 🏆\n\n`;
    for (const g of guildList.slice(0, 10)) {
      txt += `🏰 *${g.name}* (Lv. ${g.level || 1})\n`;
      txt += `👥 Member: ${g.members?.length || 0}/50\n`;
      txt += `💰 Kas Kasir: Rp ${(g.treasury || 0).toLocaleString()}\n`;
      txt += `──────────────\n`;
    }
    return m.reply(txt);
  }

  if (action === "create") {
    if (user.rpg.guildId) {
      return m.reply(`Rakus lu! Kan udah punya guild. Leave dulu sana kalau mau bikin baru!`);
    }

    if (!guildName || guildName.length < 3) {
      return m.reply(`Nama guild minimal *3 huruf* bos!`);
    }

    if (guildName.length > 20) {
      return m.reply(`Nama guild kepanjangan, maksimal *20 huruf* aja!`);
    }

    const existingGuild = Object.values(guilds).find((g) => g.name.toLowerCase() === guildName.toLowerCase());
    if (existingGuild) {
      return m.reply(`Yahh, nama *${guildName}* udah dipake kelompok lain! Cari nama yang lebih keren!`);
    }

    const createCost = 10000;
    if ((user.koin || 0) < createCost) {
      return m.reply(`Miskin amat mau jadi ketua? Butuh *Rp 10.000* buat biaya administrasi pendaftaran Guild!`);
    }

    user.koin -= createCost;

    const guildId = `guild_${Date.now()}`;
    if (!db.db.data.guilds) db.db.data.guilds = {};

    db.db.data.guilds[guildId] = {
      id: guildId,
      name: guildName,
      leader: m.sender,
      members: [m.sender],
      treasury: 0,
      level: 1,
      exp: 0,
      createdAt: Date.now(),
    };

    user.rpg.guildId = guildId;
    db.save();

    let txt = `🎉 *GUILD RESMI BERDIRI!* 🎉\n\n`;
    txt += `Papan nama *${guildName}* telah dipasang di markas baru!\n\n`;
    txt += `👑 Ketua: @${m.sender.split("@")[0]}\n`;
    txt += `💸 Biaya Bangunan: *-Rp ${createCost.toLocaleString()}*\n\n`;
    txt += `> _Ajak temen-temen lu buat gabung pake \`.guild join ${guildName}\`!_`;

    return m.reply(txt, { mentions: [m.sender] });
  }

  if (action === "join") {
    if (user.rpg.guildId) {
      return m.reply(`Lu udah punya kelompok bro! Nggak bisa *double agent* di sini.`);
    }

    if (!guildName) {
      return m.reply(`Tulis nama guild yang mau dimasukin!\nContoh: \`${m.prefix}guild join DragonSlayers\``);
    }

    const targetGuild = Object.values(guilds).find((g) => g.name.toLowerCase() === guildName.toLowerCase());
    if (!targetGuild) {
      return m.reply(`Guild *${guildName}* nggak ketemu! Typo kali lu?`);
    }

    if (targetGuild.members?.length >= 50) {
      return m.reply(`Maaf bang, kapasitas markas guild *${targetGuild.name}* udah full (50/50)!`);
    }

    targetGuild.members = targetGuild.members || [];
    targetGuild.members.push(m.sender);
    user.rpg.guildId = targetGuild.id;
    db.save();

    return m.reply(`✅ Selamat datang di barak! Lu sekarang resmi jadi anggota guild *${targetGuild.name}*! ⚔️`);
  }

  if (action === "leave") {
    if (!user.rpg.guildId) {
      return m.reply(`Lu aja belum masuk guild mana-mana, mau leave darimana coba? 😂`);
    }

    const myGuild = guilds[user.rpg.guildId];
    if (!myGuild) {
      user.rpg.guildId = null;
      db.save();
      return m.reply(`Guild lu kayaknya udah bubar atau di-*delete*. Data udah di-reset.`);
    }

    if (myGuild.leader === m.sender && myGuild.members?.length > 1) {
      return m.reply(`Woy ketua! Masa mau ninggalin anggota gitu aja? Transfer kepemimpinan dulu ke member lain atau kick semua anggotanya! 😡`);
    }

    myGuild.members = (myGuild.members || []).filter((m) => m !== m.sender);

    if (myGuild.members.length === 0) {
      delete guilds[user.rpg.guildId];
    }

    const guildName = myGuild.name;
    user.rpg.guildId = null;
    db.save();

    return m.reply(`🏃 Lu cabut dari markas *${guildName}* dan kembali jadi ronin tanpa tuan!`);
  }

  if (action === "info") {
    if (!user.rpg.guildId) {
      return m.reply(`Lu nggak punya guild bos! Cari temen sana!`);
    }

    const myGuild = guilds[user.rpg.guildId];
    if (!myGuild) {
      return m.reply(`Guild tidak ditemukan!`);
    }

    let txt = `🏰 *PAPAN INFO GUILD* 🏰\n\n`;
    txt += `👑 Nama: *${myGuild.name}*\n`;
    txt += `👤 Leader: @${myGuild.leader?.split("@")[0]}\n`;
    txt += `📊 Level: *${myGuild.level || 1}*\n`;
    txt += `👥 Anggota: *${myGuild.members?.length || 0}/50*\n`;
    txt += `💰 Uang Kas: *Rp ${(myGuild.treasury || 0).toLocaleString()}*\n`;

    return m.reply(txt, { mentions: [myGuild.leader] });
  }

  if (action === "members") {
    if (!user.rpg.guildId) {
      return m.reply(`Cieee nggak punya guild...`);
    }

    const myGuild = guilds[user.rpg.guildId];
    if (!myGuild) {
      return m.reply(`Guild tidak ditemukan!`);
    }

    const memberList = (myGuild.members || [])
      .map((m, i) => {
        const isLeader = m === myGuild.leader ? " 👑" : " 🗡️";
        return `${i + 1}. @${m.split("@")[0]}${isLeader}`;
      })
      .join("\n");

    return m.reply(`👥 *DAFTAR ANGGOTA ${myGuild.name}*\n\n${memberList}`, { mentions: myGuild.members });
  }

  if (action === "deposit") {
    if (!user.rpg.guildId) {
      return m.reply(`Lu mau donasi ke panti asuhan mana? Lu aja nggak punya guild!`);
    }

    const myGuild = guilds[user.rpg.guildId];
    if (!myGuild) {
      return m.reply(`Guild tidak ditemukan!`);
    }

    const amount = parseInt(args[1]) || 0;
    if (amount < 100) {
      return m.reply(`Pelit amat! Minimal donasi kas *Rp 100* lah!`);
    }

    if ((user.koin || 0) < amount) {
      return m.reply(`Duit lu kurang bro buat donasi segitu!`);
    }

    user.koin -= amount;
    myGuild.treasury = (myGuild.treasury || 0) + amount;
    db.save();

    return m.reply(`✅ *DONASI KAS BERHASIL!*\n\nLu barusan masukin *Rp ${amount.toLocaleString()}* ke brankas Guild!\nTotal Kas Sekarang: *Rp ${myGuild.treasury.toLocaleString()}* 🏰💰`);
  }
}

export { pluginConfig as config, handler };
