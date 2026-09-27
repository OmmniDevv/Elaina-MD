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
  name: "maling",
  alias: ["copet", "pickpocket"],
  category: "rpg",
  description: "Mencopet orang di pasar (lebih berisiko dari crime)",
  usage: ".maling",
  example: ".maling",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 180,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};
  user.rpg.health = user.rpg.health || 100;

  if (user.rpg.health < 40) {
    return m.reply(`Napas lu aja udah ngos-ngosan nyuruh nyopet! 🤒\nMinimal *40 HP* ya bos, darah lu sekarang *${user.rpg.health} HP*. Tidur dulu gih!`);
  }

  await sendRpgPreview(sock, m.chat, "Nyempil di keramaian pasar... Mengincar tas emak-emak... 🦹‍♂️🤏", "🦹 COPET", "Beraksi!", { quoted: m });
  await new Promise((r) => setTimeout(r, 2500));

  const outcomes = [
    { success: true, type: "big", money: 20000, exp: 500, msg: "GILA! Lu dapet dompet isinya *ATM Black Card* sama duit gepokan! 🤑" },
    { success: true, type: "medium", money: 8000, exp: 200, msg: "Lumayan lah, dapet dompet kulit asli isi cepek puluhan ribu. 😏" },
    { success: true, type: "small", money: 2000, exp: 50, msg: "Apes lu, dapet dompet bapak-bapak isinya KTP sama struk Indomaret doang! 😑 Tapi ada nyelip dikit duit." },
    { success: false, type: "caught", fine: 15000, health: 30, msg: "WOY MALING!!! 😱 Emak-emak teriak dan lu *dihakimi massa* ampe gigi copot!" },
    { success: false, type: "police", fine: 25000, health: 10, msg: "Lagi asik nyeloteh dompet, eh tangan lu *digenggam intel* nyamar! 👮‍♂️ Busted!" },
    { success: false, type: "fail", fine: 0, health: 0, msg: "Sialan! Target ngerasa ada yang raba-raba tasnya, langsung kabur di kerumunan! 😤 Gagal bro." },
  ];

  const weights = [5, 20, 30, 15, 10, 20];
  const rand = Math.random() * 100;
  let cumulative = 0;
  let outcome = outcomes[5];

  for (let i = 0; i < outcomes.length; i++) {
    cumulative += weights[i];
    if (rand <= cumulative) {
      outcome = outcomes[i];
      break;
    }
  }

  let txt = "";

  if (outcome.success) {
    user.koin = (user.koin || 0) + outcome.money;
    await addExpWithLevelCheck(sock, m, db, user, outcome.exp);

    txt = `OPERASI BERSIH! 🦹‍♂️✨\n\n`;
    txt += `${outcome.msg}\n\n`;
    txt += `💰 Koin Haram: *+Rp ${outcome.money.toLocaleString("id-ID")}*\n`;
    txt += `📈 EXP Copet: *+${outcome.exp}*`;
  } else {
    const actualFine = Math.min(outcome.fine, user.koin || 0);
    user.koin = Math.max(0, (user.koin || 0) - actualFine);
    user.rpg.health = Math.max(0, user.rpg.health - outcome.health);

    txt = `KACAU BALAU!! 🚨🤬\n\n`;
    txt += `${outcome.msg}\n\n`;
    if (outcome.fine > 0) txt += `💸 Duit Damai/Rampasan: *-Rp ${actualFine.toLocaleString("id-ID")}*\n`;
    if (outcome.health > 0) txt += `🤕 Darah Bercucuran: *-${outcome.health} HP*`;

    if (user.rpg.health <= 0) {
      user.rpg.health = 0;
      user.exp = Math.floor((user.exp || 0) / 2);
      txt += `\n\n💀 *INNALILLAHI... KAMU MATI GEGARA DIGEBUKIN MASSA!*\nExp-mu hangus 50%! 😭`;
    }
  }

  db.save();
  await sendRpgPreview(sock, m.chat, txt, "🦹 HASIL NYOPET", "Result!", { quoted: m });
}

export { pluginConfig as config, handler };
