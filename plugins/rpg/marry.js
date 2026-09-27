/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "marry",
  alias: ["nikah", "wedding", "propose"],
  category: "rpg",
  description: "Menikahi player lain",
  usage: ".marry @user",
  example: ".marry @user",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 60,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};

  const target = m.mentionedJid?.[0] || m.quoted?.sender;

  if (!target) {
    let txt = `💒 *CATATAN SIPIL RPG* 💒\n\n`;
    txt += `Mau melamar ayang? Tag orangnya di sini!\n\n`;
    txt += `*Cara Melamar:*\n`;
    txt += `👉 \`${m.prefix}marry @user\`\n\n`;
    txt += `*Syarat:* \n`;
    txt += `💍 Biaya Nikah: *Rp 50.000*\n`;
    txt += `(Pastikan doi belum punya pasangan ya!)`;
    return m.reply(txt);
  }

  if (target === m.sender) {
    return m.reply(`Aduh kasihan banget jomblo kronis... Masa mau nikah sama diri sendiri? Cari jodoh sana! 😭💔`);
  }

  const partner = db.getUser(target) || db.setUser(target);
  if (!partner.rpg) partner.rpg = {};

  if (user.rpg.spouse) {
    return m.reply(`HEH! Lu kan udah punya pasangan si @${user.rpg.spouse.split("@")[0]}!\nMau poligami? Di server ini nggak boleh! Cerai dulu gih sana pakai \`.divorce\` 😡🔪`, { mentions: [user.rpg.spouse] });
  }

  if (partner.rpg.spouse) {
    return m.reply(`Sakit tak berdarah... 🥀\n@${target.split("@")[0]} ternyata udah nikah sama orang lain!\nLangkahmu terhenti di *friendzone*...`, { mentions: [target] });
  }

  const marriageCost = 50000;
  if ((user.koin || 0) < marriageCost) {
    return m.reply(`Astaga... miskin kok nekat mau nikah? 🤦‍♂️\nBiaya KUA dan katering *Rp 50.000*, tapi duit lu cuma *Rp ${(user.koin || 0).toLocaleString("id-ID")}*.\nKerja keras dulu bang!`);
  }

  user.koin -= marriageCost;
  user.rpg.spouse = target;
  user.rpg.marriedAt = Date.now();
  partner.rpg.spouse = m.sender;
  partner.rpg.marriedAt = Date.now();

  db.save();

  await m.react("💍");

  let txt = `💒 *PENGUMUMAN PERNIKAHAN!!* 💒\n\n`;
  txt += `Segenap penghuni server mengucapkan selamat kepada:\n\n`;
  txt += `👨‍💼/👰 @${m.sender.split("@")[0]}\n`;
  txt += `           💖 dengan 💖\n`;
  txt += `👨‍💼/👰 @${target.split("@")[0]}\n\n`;
  txt += `🎉 *MEREKA RESMI MENJADI PASANGAN!* 🎉\n\n`;
  txt += `💍 Biaya Resepsi: *Rp -${marriageCost.toLocaleString("id-ID")}*\n\n`;
  txt += `> _"Semoga langgeng sampai akhir hayat server ini!" - Pendeta Bot_ 🥺💕`;

  await m.reply(txt, { mentions: [m.sender, target] });
}

export { pluginConfig as config, handler };
