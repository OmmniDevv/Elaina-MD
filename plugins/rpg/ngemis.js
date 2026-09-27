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
  name: "ngemis",
  alias: ["minta", "gembel"],
  category: "rpg",
  description: "Ngemis di jalanan dengan peluang dapat Nasi Bungkus (Tambah stamina)",
  usage: ".ngemis",
  example: ".ngemis",
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
  
  const staminaCost = 5;
  user.rpg.stamina = user.rpg.stamina ?? 100;

  if (user.rpg.stamina < staminaCost) {
    return m.reply(`Tenaga habis buat melas! 🥺\n\nNgemis butuh *${staminaCost} Stamina*, sisa stamina kamu *${user.rpg.stamina}*. Nggak kuat mangap lagi... 💔`);
  }

  user.rpg.stamina -= staminaCost;
  await m.react("🤲");
  await m.reply(`Pak, bu, minta sedekahnya sedikit... 🥺\nBerharap ada dermawan lewat di perempatan ini... 🚶‍♂️`);
  await new Promise(r => setTimeout(r, 3000));

  const gacha = Math.random();

  if (gacha < 0.3) {
    const heal = Math.floor(Math.random() * 20) + 10;
    user.rpg.stamina = Math.min(100, user.rpg.stamina + heal);
    await m.react("🍱");
    return m.reply(`ALHAMDULILLAH DIKASIH NASI PADANG! 🍱✨\n\nAda bapak-bapak baik hati yang ngasih kamu bungkus nasi sisa rapet!\n💖 Stamina bertambah: *+${heal}*\n💵 Uang didapat: 0\n\nWah, perut kenyang hati senang! 🥰`);
  }

  if (gacha > 0.9) {
    await m.react("💢");
    return m.reply(`DIUSIR PREMAN PASAR! 💢\n\n"Woi, ini lapak gue! Pergi lo!"\nKamu lari ketakutan tanpa dapet sepeser pun...\n⚡ Stamina: -${staminaCost}\n\nSusah banget nyari lahan ngemis jaman sekarang! 😭`);
  }

  const earning = Math.floor(Math.random() * 3000) + 500;
  user.koin = (user.koin || 0) + earning;
  const expGain = Math.floor(earning / 10);
  await addExpWithLevelCheck(sock, m, db, user, expGain);

  await m.react("✅");
  m.reply(`HASIL NGEMIS HARI INI! 🤲✨\n\n💵 Pendapatan Receh: *+Rp ${earning.toLocaleString("id-ID")}*\n📈 EXP: *+${expGain}*\n⚡ Stamina: -${staminaCost}\n\nBersyukur atas nikmat hari ini, walau receh yang penting halal! 🙏`);
}

export { pluginConfig as config, handler };
