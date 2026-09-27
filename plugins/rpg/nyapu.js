/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import { addExpWithLevelCheck } from "../../src/lib/elaina-level.js";

const pluginConfig = {
  name: "nyapu",
  alias: ["cleaning", "bersih"],
  category: "rpg",
  description: "Nyapu jalan, siapa tau nemu barang jatuh!",
  usage: ".nyapu",
  example: ".nyapu",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 120,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};
  
  const staminaCost = 10;
  user.rpg.stamina = user.rpg.stamina ?? 100;

  if (user.rpg.stamina < staminaCost) {
    return m.reply(`Tangan pegel megang sapu terus! 😖\n\nNyapu butuh *${staminaCost} Stamina*, sisa stamina kamu *${user.rpg.stamina}*. Istirahat di bawah pohon dulu! 🌳`);
  }

  user.rpg.stamina -= staminaCost;
  await m.react("🧹");
  await m.reply(`Srak sruk srak sruk... 🧹\nMembersihkan sampah-sampah masyarakat... 🗑️`);
  await new Promise(r => setTimeout(r, 3000));

  const gacha = Math.random();

  if (gacha < 0.1) {
    const goldFound = Math.floor(Math.random() * 50000) + 15000;
    user.koin = (user.koin || 0) + goldFound;
    await m.react("💍");
    return m.reply(`HOKI PARAH! NEMU CINCIN EMAS JATUH! 💍✨\n\nPas lagi nyapu pinggir trotoar, kamu nemu cincin emas dan langsung dijual!\n💵 Pendapatan Kaget: *+Rp ${goldFound.toLocaleString("id-ID")}*\n⚡ Stamina: -${staminaCost}\n\nRejeki nomplok emang nggak kemana! 🥳`);
  }

  const earning = Math.floor(Math.random() * 8000) + 3000;
  user.koin = (user.koin || 0) + earning;
  const expGain = Math.floor(earning / 20);
  await addExpWithLevelCheck(sock, m, db, user, expGain);

  await m.react("✅");
  m.reply(`ALHAMDULILLAH SELESAI BERES-BERES! 🧹✨\n\n💵 Gaji Harian: *+Rp ${earning.toLocaleString("id-ID")}*\n📈 EXP: *+${expGain}*\n⚡ Stamina: -${staminaCost}\n\nBumi makin bersih dan asri! 🌍`);
}

export { pluginConfig as config, handler };
