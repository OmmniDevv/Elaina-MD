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
  name: "tembak",
  alias: ["nembak", "propose"],
  category: "fun",
  description: "Menembak seseorang untuk pacaran",
  usage: ".tembak @tag",
  example: ".tembak @628xxx",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 30,
  energi: 1,
  isEnabled: true,
};

if (!global.tembakSessions) global.tembakSessions = {};

const SESSION_TIMEOUT = 3600000;
const romanticQuotes = [
  "Aku bukan pilot, tapi aku bisa buat hatimu terbang tinggi bersamaku 💕",
  "Kamu tau kenapa aku suka hujan? Karena hujan itu seperti kamu, sejuk di hati 🌧️",
  "Kamu adalah alasan kenapa aku senyum tanpa sebab 😊",
  "Kalau kamu bintang, aku mau jadi langit yang selalu nemenin kamu ✨",
  "Aku gak butuh GPS, karena hatiku udah nunjuk ke arahmu 💘",
  "Kamu tau bedanya kamu sama kopi? Kopi bikin melek, kamu bikin aku nggak bisa tidur mikirin kamu ☕",
  "Boleh pinjam hatimu? Janji bakal dijaga selamanya 💖",
  "Kalau cinta itu adalah lagu, kamu adalah melodi terindahnya 🎵",
  "Aku butuh 3 hal: Matahari, Bulan, dan Kamu. Matahari untuk siang, Bulan untuk malam, Kamu untuk selamanya 🌙",
  "Kamu adalah puzzle terakhir yang kubutuhkan untuk melengkapi hidupku 🧩",
];

async function handler(m, { sock }) {
  const db = getDatabase();
  const args = m.args || [];

  let targetJid = null;

  if (m.quoted) {
    targetJid = m.quoted.sender;
  } else if (m.mentionedJid?.[0]) {
    targetJid = m.mentionedJid[0];
  } else if (args[0]) {
    let num = args[0].replace(/[^0-9]/g, "");
    if (num.length > 5 && num.length < 20) {
      targetJid = num + "@s.whatsapp.net";
    }
  }

  if (!targetJid) {
    return m.reply(
      `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
        `> \`${m.prefix}tembak @tag\`\n\n` +
        `> Contoh:\n` +
        `> \`${m.prefix}tembak @628xxx\`\n` +
        `> Reply pesan + \`${m.prefix}tembak\``,
    );
  }

  if (targetJid === m.sender) {
    return m.reply(`Tidak bisa menembak diri sendiri!`);
  }

  if (targetJid === m.botNumber) {
    return m.reply(`Bot tidak bisa pacaran!`);
  }

  let senderData = db.getUser(m.sender) || {};
  let targetData = db.getUser(targetJid) || {};

  if (!senderData.fun) senderData.fun = {};
  if (!targetData.fun) targetData.fun = {};

  if (senderData.fun.pasangan) {
    const partnerData = db.getUser(senderData.fun.pasangan);
    if (partnerData?.fun?.pasangan === m.sender) {
      return m.reply(
        `❌ *sᴜᴅᴀʜ ᴘᴜɴʏᴀ ᴘᴀsᴀɴɢᴀɴ*\n\n` +
          `Pasanganmu: @${senderData.fun.pasangan.split("@")[0]}\n` +
          `Putus dulu sama ${partnerData.name} dengan cara: \`${m.prefix}putus\``,
        { mentions: [senderData.fun.pasangan] },
      );
    }
  }

  if (targetData.fun.pasangan && targetData.fun.pasangan !== m.sender) {
    const targetPartner = db.getUser(targetData.fun.pasangan);
    if (targetPartner?.fun?.pasangan === targetJid) {
      return m.reply(
        `💔 *ᴅɪᴀ sᴜᴅᴀʜ ᴘᴀᴄᴀʀᴀɴ*\n\n` +
          `Pasangannya: @${targetData.fun.pasangan.split("@")[0]}`,
        { mentions: [targetData.fun.pasangan] },
      );
    }
  }

  if (
    targetData.fun.tembakTarget === m.sender ||
    targetData.fun.pasangan === m.sender
  ) {
    senderData.fun.pasangan = targetJid;
    targetData.fun.pasangan = m.sender;

    db.setUser(m.sender, senderData);
    db.setUser(targetJid, targetData);

    delete global.tembakSessions[`${m.chat}_${targetJid}`];

    await m.react("💕");
    return m.reply(
      `💕 *CIE CIEE :3*\n\n` +
        `@${m.sender.split("@")[0]} dan @${targetJid.split("@")[0]} resmi pacaran !\n\n` +
        `Semoga langgeng yak! 💍`,
      { mentions: [m.sender, targetJid] },
    );
  }

  senderData.fun.tembakTarget = targetJid;
  if (!senderData.fun.tembakCount) senderData.fun.tembakCount = 0;
  senderData.fun.tembakCount++;
  db.setUser(m.sender, senderData);

  global.tembakSessions[`${m.chat}_${targetJid}`] = {
    shooter: m.sender,
    target: targetJid,
    chat: m.chat,
    timestamp: Date.now(),
  };

  await m.react("💘");

  const ctx = saluranCtx();
  ctx.mentionedJid = [targetJid, m.sender];
  const sentMsg = await m.reply(
    `💘 *ADA YANG NEMBAK NIHH*\n\n` +
      `Hei @${targetJid.split("@")[0]} , kamu ditembak oleh @${m.sender.split("@")[0]} nichh\n\n` +
      `⏱️ Berlaku *1 jam* dari sekarang\n` +
      `gunakan: \`${m.prefix}terima\` / \`${m.prefix}tolak\``,
    { contextInfo: ctx },
  );

  if (sentMsg?.key?.id) {
    global.tembakSessions[`${m.chat}_${targetJid}`].messageId = sentMsg.key.id;
  }
}

async function answerHandler(m, sock) {
  if (!m.body) return false;

  const text = m.body.trim().toLowerCase();
  if (text !== "terima" && text !== "tolak") return false;
  if (!m.quoted) return false;

  const db = getDatabase();

  const allSessions = Object.entries(global.tembakSessions || {}).filter(
    ([key, val]) => val.target === m.sender && val.chat === m.chat,
  );

  if (allSessions.length === 0) return false;

  const validSession = allSessions.find(([key, val]) => {
    return Date.now() - val.timestamp < 3600000;
  });

  if (!validSession) return false;

  const [sessKey, sessData] = validSession;

  if (text === "terima") {
    let shooterData = db.getUser(sessData.shooter) || {};
    let targetData = db.getUser(m.sender) || {};

    if (!shooterData.fun) shooterData.fun = {};
    if (!targetData.fun) targetData.fun = {};

    shooterData.fun.pasangan = m.sender;
    targetData.fun.pasangan = sessData.shooter;

    db.setUser(sessData.shooter, shooterData);
    db.setUser(m.sender, targetData);

    delete global.tembakSessions[sessKey];

    await m.react("💕");
    await m.reply(
      `💕 *WIDIHHHH, CIE CIE DITERIMA* @${sessData.shooter.split("@")[0]}\n\n` +
        `@${m.sender.split("@")[0]} dan @${sessData.shooter.split("@")[0]} resmi pacaran\n\n` +
        `Semoga langgeng dan bahagia 💍`,
      { mentions: [m.sender, sessData.shooter] },
    );

    return true;
  }

  if (text === "tolak") {
    let shooterData = db.getUser(sessData.shooter) || {};
    let targetData = db.getUser(m.sender) || {};

    if (!shooterData.fun) shooterData.fun = {};
    if (!targetData.fun) targetData.fun = {};

    delete shooterData.fun.pasangan;
    delete shooterData.fun.tembakTarget;
    delete targetData.fun.pasangan;

    db.setUser(sessData.shooter, shooterData);
    db.setUser(m.sender, targetData);

    delete global.tembakSessions[sessKey];

    await m.react("💔");
    await m.reply(
      `💔 *WADUHH, YANG SABAR YAK* @${sessData.shooter.split("@")[0]}\n\n` +
        `@${m.sender.split("@")[0]} menolak @${sessData.shooter.split("@")[0]} sebagai pacarnya\n\n` +
        `Sabar ya, masih banyak yang lain! 😢`,
      { mentions: [m.sender, sessData.shooter] },
    );
    return true;
  }

  return false;
}

export { pluginConfig as config, handler, answerHandler };
