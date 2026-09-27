/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "divorce",
  alias: ["cerai", "pisah"],
  category: "rpg",
  description: "Bercerai dari pasangan",
  usage: ".divorce",
  example: ".divorce",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 60,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};

  if (!user.rpg.spouse) {
    return m.reply(`Halu tingkat tinggi... Nikah aja belum masa udah mau cerai? 😂💔\nCari pasangan dulu gih pake \`.marry @user\``);
  }

  const spouseJid = user.rpg.spouse;
  const partner = db.getUser(spouseJid);

  const divorceCost = 25000;
  if ((user.koin || 0) < divorceCost) {
    return m.reply(`Aduh, biaya pengacara buat cerai mahal bos! 😭\nButuh *Rp 25.000* buat tanda tangan surat cerai, duit lu cuma *Rp ${(user.koin || 0).toLocaleString("id-ID")}*.\nTahan dulu aja berantemnya!`);
  }

  user.koin -= divorceCost;
  user.rpg.spouse = null;
  user.rpg.marriedAt = null;

  if (partner && partner.rpg) {
    partner.rpg.spouse = null;
    partner.rpg.marriedAt = null;
  }

  db.save();

  await m.react("💔");

  let txt = `⛈️ *SIDANG PERCERAIAN SELESAI* ⛈️\n\n`;
  txt += `Palu telah diketuk. Dengan berat hati, hubungan antara:\n`;
  txt += `💔 @${m.sender.split("@")[0]}\n`;
  txt += `         -- PUTUS DENGAN --\n`;
  txt += `💔 @${spouseJid.split("@")[0]}\n\n`;
  txt += `😭 *RESMI BERAKHIR! KINI KALIAN KEMBALI JOMBLO!* 😭\n\n`;
  txt += `💸 Biaya Pengacara/Sidang: *Rp -${divorceCost.toLocaleString("id-ID")}*\n\n`;
  txt += `> _"Sudah sudah... nangisnya di pojokan aja. Life must go on..." - Hakim Bot_ 🥀🚬`;

  await m.reply(txt, { mentions: [m.sender, spouseJid] });
}

export { pluginConfig as config, handler };
