/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import config from "../../config.js";
import path from "path";
import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";
import fs from "fs";
const pluginConfig = {
  name: "jodoh",
  alias: ["match", "shipcouple", "ship"],
  category: "fun",
  description: "Jodohkan 2 member random dengan kecocokan",
  usage: ".jodoh",
  example: ".jodoh",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

let thumbFun = null;
try {
  thumbFun = getAssetBuffer("rimuru-games");
} catch (e) {}

const loveQuotes = [
  "Cinta sejati tidak pernah mengenal jarak 💕",
  "Dua hati yang bersatu takkan terpisahkan 💗",
  "Kalian seperti puzzle yang sempurna 🧩",
  "Match made in heaven! ✨",
  "Chemistry-nya kuat banget! 🔥",
  "Couple goals banget sih kalian 💑",
  "Destiny brought you together 🌟",
  "Perfect match detected! 💘",
];

const compatibilityEmoji = (percent) => {
  if (percent >= 90) return "💕💕💕💕💕";
  if (percent >= 70) return "💕💕💕💕";
  if (percent >= 50) return "💕💕💕";
  if (percent >= 30) return "💕💕";
  return "💕";
};

const compatibilityText = (percent) => {
  if (percent >= 90) return "JODOH SEJATI! 💍";
  if (percent >= 70) return "Sangat Cocok! 💖";
  if (percent >= 50) return "Lumayan Cocok 💗";
  if (percent >= 30) return "Bisa Dicoba 💓";
  return "Butuh Usaha Lebih 💔";
};

const isRegistrationRequired = (db) => {
  return (
    db.setting("registrationRequired") ?? config.registration?.enabled ?? false
  );
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const botNumber = sock.user?.id?.split(":")[0] + "@s.whatsapp.net";

  let groupMeta;
  try {
    groupMeta = m.groupMetadata;
  } catch (e) {
    return m.reply("❌ *ɢᴀɢᴀʟ*\n\n> Tidak bisa mengambil data grup!");
  }

  const participants = groupMeta.participants || [];
  const memberJids = participants
    .map((p) => p.jid || p.id)
    .filter((jid) => jid && jid !== botNumber);

  if (memberJids.length < 2) {
    return m.reply("❌ *ɢᴀɢᴀʟ*\n\n> Minimal ada 2 member untuk dijodohkan!");
  }

  const allUsers = db.getAllUsers();
  const registrationRequired = isRegistrationRequired(db);
  const registeredMembers = memberJids.filter((jid) => {
    const cleanJid = jid.replace(/@.+/g, "");
    return allUsers[cleanJid]?.isRegistered;
  });
  const registeredInGroup = memberJids.filter((jid) => {
    const cleanJid = jid.replace(/@.+/g, "");
    const user = allUsers[cleanJid];
    return user?.isRegistered && user.regGender;
  });

  if (registrationRequired && registeredMembers.length < 2) {
    return m.reply(
      "❌ *ɢᴀɢᴀʟ*\n\n> Mode wajib daftar aktif. Minimal harus ada 2 member yang sudah terdaftar di grup ini!",
    );
  }

  let person1 = null;
  let person2 = null;
  let usedRegistration = false;

  if (registeredInGroup.length >= 2) {
    const males = registeredInGroup.filter((jid) => {
      const cleanJid = jid.replace(/@.+/g, "");
      return allUsers[cleanJid]?.regGender === "Laki-laki";
    });
    const females = registeredInGroup.filter((jid) => {
      const cleanJid = jid.replace(/@.+/g, "");
      return allUsers[cleanJid]?.regGender === "Perempuan";
    });

    if (males.length > 0 && females.length > 0) {
      person1 = males[Math.floor(Math.random() * males.length)];
      person2 = females[Math.floor(Math.random() * females.length)];
      usedRegistration = true;
    } else {
      const shuffled = registeredInGroup.sort(() => Math.random() - 0.5);
      person1 = shuffled[0];
      person2 = shuffled[1];
      usedRegistration = true;
    }
  }

  if (!person1 || !person2) {
    const candidateMembers = registrationRequired
      ? registeredMembers
      : memberJids;
    const shuffled = candidateMembers.sort(() => Math.random() - 0.5);
    person1 = shuffled[0];
    person2 = shuffled[1];
  }

  const compatibility = Math.floor(Math.random() * 100) + 1;
  const quote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];

  const user1Data = allUsers[person1.replace(/@.+/g, "")];
  const user2Data = allUsers[person2.replace(/@.+/g, "")];

  let label1 = "👨";
  let label2 = "👩";
  let name1 = `@${person1.split("@")[0]}`;
  let name2 = `@${person2.split("@")[0]}`;

  if (user1Data?.regGender === "Laki-laki") label1 = "👨";
  else if (user1Data?.regGender === "Perempuan") label1 = "👩";
  else label1 = Math.random() > 0.5 ? "👨" : "👩";

  if (user2Data?.regGender === "Laki-laki") label2 = "👨";
  else if (user2Data?.regGender === "Perempuan") label2 = "👩";
  else label2 = label1 === "👨" ? "👩" : "👨";

  if (user1Data?.regName)
    name1 = `*${user1Data.regName}* (@${person1.split("@")[0]})`;
  if (user2Data?.regName)
    name2 = `*${user2Data.regName}* (@${person2.split("@")[0]})`;

  const progressBar = (() => {
    const filled = Math.floor(compatibility / 10);
    const empty = 10 - filled;
    return "█".repeat(filled) + "░".repeat(empty);
  })();

  let text = `💘 *ᴊᴏᴅᴏʜ ʀᴀɴᴅᴏᴍ*\n\n`;
  text += `╭┈┈⬡「 💑 *ᴘᴀsᴀɴɢᴀɴ* 」\n`;
  text += `┃ ${label1} ${name1}\n`;
  text += `┃ ❤️\n`;
  text += `┃ ${label2} ${name2}\n`;
  text += `╰┈┈┈┈┈┈┈┈⬡\n\n`;
  text += `╭┈┈⬡「 📊 *ᴋᴇᴄᴏᴄᴏᴋᴀɴ* 」\n`;
  text += `┃ ${progressBar} *${compatibility}%*\n`;
  text += `┃ ${compatibilityEmoji(compatibility)}\n`;
  text += `┃ Status: *${compatibilityText(compatibility)}*\n`;
  text += `╰┈┈┈┈┈┈┈┈⬡\n\n`;
  if (usedRegistration) {
    text += `> ✨ _Dijodohkan berdasarkan data registrasi_\n`;
  }
  if (registrationRequired) {
    text += `> 🔒 _Mode wajib daftar aktif, hanya member terdaftar yang dipilih_\n`;
  }
  text += `> _"${quote}"_`;

  await m.react("💕");
  await m.reply(text, { mentions: [person1, person2] });
}

export { pluginConfig as config, handler };
