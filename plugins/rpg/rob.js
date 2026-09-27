/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import { addExpWithLevelCheck } from "../../src/lib/elaina-level.js";
import { sendRpgPreview } from "../../src/lib/elaina-context.js";

const pluginConfig = {
  name: "rob",
  alias: ["rampok", "mug"],
  category: "rpg",
  description: "Rampok uang player lain (berisiko)",
  usage: ".rob @user",
  example: ".rob @user",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 600,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();

  const target = m.mentionedJid?.[0] || m.quoted?.sender;

  if (!target) {
    return m.reply(`Hayo, mau malak siapa nih? 🦹‍♂️🔪\nTag target yang mau dirampok hartanya!\nContoh: \`.rob @user\``);
  }

  if (target === m.sender) {
    return m.reply(`Sakit jiwa lu? Masa ngerampok dompet sendiri! 😂❌`);
  }

  const robber = db.getUser(m.sender);
  const victim = db.getUser(target);

  if (!victim) {
    return m.reply(`Target buronanmu nggak ketemu di database! Kayaknya dia udah kabur duluan. 🏃💨`);
  }

  if ((victim.koin || 0) < 1000) {
    return m.reply(`Yaelah, target lu miskin parah! Duitnya di bawah Rp 1.000, masa tega dirampok? Cari mangsa yang tajir dong! 😤`);
  }

  if (!robber.rpg) robber.rpg = {};
  robber.rpg.health = robber.rpg.health || 100;

  if (robber.rpg.health < 30) {
    return m.reply(`Woy bos, badan lu tinggal tulang gitu masih nekat ngerampok?! 🤒\nMinimal *30 HP*, darah lu cuma *${robber.rpg.health} HP*. Berobat sana!`);
  }

  await sendRpgPreview(sock, m.chat, `*Sssstttt...* Bersembunyi di gang gelap nunggu target lewat... 🦹‍♂️🔪`, "🦹 BEGAL", "Beraksi!", { quoted: m });
  await new Promise((r) => setTimeout(r, 2500));

  const successRate = 0.4;
  const isSuccess = Math.random() < successRate;

  if (isSuccess) {
    const maxSteal = Math.floor((victim.koin || 0) * 0.3);
    const stolen = Math.floor(Math.random() * maxSteal) + 1000;

    victim.koin = (victim.koin || 0) - stolen;
    robber.koin = (robber.koin || 0) + stolen;

    const expGain = 300;
    await addExpWithLevelCheck(sock, m, db, robber, expGain);

    db.save();

    let txt = `MANTAP! TARGET BERHASIL DIPALAK! 🦹‍♂️💰\n\n`;
    txt += `Lu berhasil nakutin si @${target.split("@")[0]} sampai ngencing di celana!\n`;
    txt += `Uang hasil palakan: *+Rp ${stolen.toLocaleString("id-ID")}*\n`;
    txt += `Bonus EXP Begal: *+${expGain}*\n\n`;
    txt += `*Buru kabur sebelum polis dateng!!!* 🚓💨`;

    await m.reply(txt, { mentions: [target] });
  } else {
    const fine = Math.floor(Math.random() * 10000) + 5000;
    const actualFine = Math.min(fine, robber.koin || 0);
    const healthLoss = 25;

    robber.koin = Math.max(0, (robber.koin || 0) - actualFine);
    robber.rpg.health = Math.max(0, robber.rpg.health - healthLoss);

    db.save();

    let txt = `GOBLOK! KETAHUAN WARGA!! 🚨🤬\n\n`;
    txt += `Bukannya dapet duit, lu malah ketangkep basah terus *digebukin warga 1 RT*!\n`;
    txt += `💸 Duit lu disita RT: *-Rp ${actualFine.toLocaleString("id-ID")}*\n`;
    txt += `🤕 Badan Babak Belur: *-${healthLoss} HP*\n\n`;
    txt += `*MAMPUS LU, makanya jangan main-main di mari!* 🤣`;

    await m.reply(txt);
  }
}

export { pluginConfig as config, handler };
