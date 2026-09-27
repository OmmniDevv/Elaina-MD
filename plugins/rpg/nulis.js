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
  name: "nulis",
  alias: ["author", "wattpad"],
  category: "rpg",
  description: "Nulis cerpen atau artikel untuk dapet royalti",
  usage: ".nulis",
  example: ".nulis",
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
    return m.reply(`Ide buntu, writer block menyerang! 😵‍💫\n\nNulis butuh *${staminaCost} Stamina*, sisa stamina kamu *${user.rpg.stamina}*. Cari inspirasi dulu! 💡`);
  }

  user.rpg.stamina -= staminaCost;
  await m.react("📝");
  await m.reply(`Merangkai kata demi kata penuh makna... ✍️\nSemoga ada penerbit yang ngelirik! 📚`);
  await new Promise(r => setTimeout(r, 3000));

  const gacha = Math.random();

  if (gacha < 0.15) {
    await m.react("🚮");
    return m.reply(`NASKAH DITOLAK PENERBIT! 🚮🥺\n\nAlasannya: "Ceritanya terlalu klise dan pasaran."\n💵 Royalti: 0\n⚡ Stamina: -${staminaCost}\n\nJangan menyerah, besok nulis lagi! 💪`);
  } else if (gacha > 0.9) {
    const viralRoyalti = Math.floor(Math.random() * 60000) + 30000;
    user.koin = (user.koin || 0) + viralRoyalti;
    const expGain = Math.floor(viralRoyalti / 20);
    await addExpWithLevelCheck(sock, m, db, user, expGain);
    
    await m.react("🌟");
    return m.reply(`CERITAMU VIRAL DAN JADI BEST SELLER! 🌟📘\n\nBanyak yang nangis bombay baca karya kamu, royalti ngalir deres!\n💵 Royalti: *+Rp ${viralRoyalti.toLocaleString("id-ID")}*\n📈 EXP: *+${expGain}*\n⚡ Stamina: -${staminaCost}\n\nOtw dilirik sutradara buat difilmin! 🎬`);
  }

  const earning = Math.floor(Math.random() * 15000) + 5000;
  user.koin = (user.koin || 0) + earning;
  const expGain = Math.floor(earning / 20);
  await addExpWithLevelCheck(sock, m, db, user, expGain);

  await m.react("✅");
  m.reply(`ROYALTI HASIL NULIS CAIR! 📝✨\n\n💵 Pendapatan: *+Rp ${earning.toLocaleString("id-ID")}*\n📈 EXP: *+${expGain}*\n⚡ Stamina: -${staminaCost}\n\nSemangat berkarya para pujangga! 🎓`);
}

export { pluginConfig as config, handler };
