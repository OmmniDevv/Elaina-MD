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
  name: "kurir",
  alias: ["antar", "paket"],
  category: "rpg",
  description: "Nganter paket orang, awas anjing galak!",
  usage: ".kurir",
  example: ".kurir",
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
  
  const staminaCost = 15;
  user.rpg.stamina = user.rpg.stamina ?? 100;

  if (user.rpg.stamina < staminaCost) {
    return m.reply(`Pinggang encok kebanyakan bawa kardus! 😩\n\nKurir butuh *${staminaCost} Stamina*, sisa stamina kamu *${user.rpg.stamina}*. Ngurut dulu gih! 💆‍♂️`);
  }

  user.rpg.stamina -= staminaCost;
  await m.react("📦");
  await m.reply(`Pakettt!!! 📦\nMencari alamat yang sesuai di maps... 🗺️`);
  await new Promise(r => setTimeout(r, 3000));

  const gacha = Math.random();

  if (gacha < 0.2) {
    const extraStamina = 10;
    user.rpg.stamina = Math.max(0, user.rpg.stamina - extraStamina);
    
    const expGain = 500;
    await addExpWithLevelCheck(sock, m, db, user, expGain);
    
    await m.react("🐕");
    return m.reply(`GUK GUK GUK! DIKEJAR ANJING GALAK! 🐕💨\n\nKamu lari keliling komplek demi nyelametin paket orang!\n⚡ Stamina Tambahan: -${extraStamina}\n📈 EXP Kompensasi Lari: *+${expGain}*\n💵 Pendapatan: 0 (Paketnya dilempar ke pagar)\n\nNafas ngos-ngosan banget asli! 🥵`);
  }

  const items = ["Dokumen Rahasia", "Baju Online", "Skincare Bini Orang", "Panci Emak-emak"];
  const item = items[Math.floor(Math.random() * items.length)];
  const earning = Math.floor(Math.random() * 15000) + 5000;
  let tips = 0;

  if (gacha > 0.8) {
    tips = Math.floor(Math.random() * 10000) + 2000;
  }

  const totalEarning = earning + tips;
  user.koin = (user.koin || 0) + totalEarning;
  const expGain = Math.floor(totalEarning / 20);
  await addExpWithLevelCheck(sock, m, db, user, expGain);

  await m.react("✅");
  let txt = `ALHAMDULILLAH PAKET SAMPAI! 📦✨\n\nBarang: *${item}*\n💵 Ongkir: *+Rp ${earning.toLocaleString("id-ID")}*\n`;
  if (tips > 0) txt += `🎁 Tips Tambahan: *+Rp ${tips.toLocaleString("id-ID")}*\n`;
  txt += `📈 EXP: *+${expGain}*\n⚡ Stamina: -${staminaCost}\n\nBerhasil nganter tepat waktu! 🚚💨`;
  m.reply(txt);
}

export { pluginConfig as config, handler };
