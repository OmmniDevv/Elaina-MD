/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";
const pluginConfig = {
  name: "tolak",
  alias: ["reject", "no", "gaktau"],
  category: "fun",
  description: "Menolak tembakan dari seseorang",
  usage: ".tolak @tag",
  example: ".tolak @628xxx",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

const rejectionQuotes = [
  "Sabar ya, yang lebih baik pasti datang! 🌟",
  "Belum jodoh bukan berarti tidak ada jodoh 💪",
  "Move on! Banyak ikan di laut! 🐟",
  "Yang sabar ya, cinta sejati akan datang 💕",
  "Jangan patah semangat, tetap semangat! 🔥",
  "Penolakan adalah awal dari keberhasilan 💪",
  "Masih banyak kesempatan di luar sana! ✨",
  "Yakin masih ada yang lebih cocok buat kamu! 🌈",
];

async function handler(m, { sock }) {
  const db = getDatabase();

  let shooterJid = null;

  if (m.quoted) {
    shooterJid = m.quoted.sender;
  } else if (m.mentionedJid?.[0]) {
    shooterJid = m.mentionedJid[0];
  }

  if (!shooterJid) {
    const sessions = global.tembakSessions || {};
    const mySession = Object.entries(sessions).find(
      ([key, val]) => val.target === m.sender && val.chat === m.chat,
    );

    if (mySession) {
      shooterJid = mySession[1].shooter;
    }
  }

  if (!shooterJid) {
    return m.reply(
      `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
        `> Reply pesan tembakan + \`${m.prefix}tolak\`\n` +
        `> Atau \`${m.prefix}tolak @tag\``,
    );
  }

  if (shooterJid === m.sender) {
    return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Tidak bisa menolak diri sendiri!`);
  }

  if (shooterJid === m.botNumber) {
    return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Bot tidak punya hati untuk ditolak!`);
  }

  let shooterData = db.getUser(shooterJid) || {};
  let myData = db.getUser(m.sender) || {};

  if (!shooterData.fun) shooterData.fun = {};
  if (!myData.fun) myData.fun = {};

  if (
    shooterData.fun.pasangan !== m.sender &&
    shooterData.fun.tembakTarget !== m.sender
  ) {
    return m.reply(
      `❌ *ᴛɪᴅᴀᴋ ᴍᴇɴᴇᴍʙᴀᴋ*\n\n` +
        `> @${shooterJid.split("@")[0]} tidak sedang menembakmu`,
      { mentions: [shooterJid] },
    );
  }

  delete shooterData.fun.pasangan;
  delete shooterData.fun.tembakTarget;
  delete myData.fun.pasangan;

  if (!shooterData.fun.ditolakCount) shooterData.fun.ditolakCount = 0;
  shooterData.fun.ditolakCount++;

  db.setUser(shooterJid, shooterData);
  db.setUser(m.sender, myData);

  const sessionKey = `${m.chat}_${m.sender}`;
  if (global.tembakSessions?.[sessionKey]) {
    delete global.tembakSessions[sessionKey];
  }

  const quote =
    rejectionQuotes[Math.floor(Math.random() * rejectionQuotes.length)];

  await m.react("💔");
  const ctx = saluranCtx();
  ctx.mentionedJid = [m.sender, shooterJid];

  await m.reply(
    `💔 *WADUHH, YANG SABAR YAK* @${shooterJid.split("@")[0]}\n\n` +
      `@${m.sender.split("@")[0]} menolak @${shooterJid.split("@")[0]} sebagai pacarnya\n\n` +
      `Sabar ya, masih banyak yang lain! 😢`,
    { contextInfo: ctx },
  );
}

export { pluginConfig as config, handler };
