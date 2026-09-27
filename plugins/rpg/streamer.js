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
  name: "streamer",
  alias: ["live", "vtuber"],
  category: "rpg",
  description: "Live streaming game dapet donasi besar tapi resiko dibanned platform!",
  usage: ".streamer",
  example: ".streamer",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 180,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock, plugin }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};
  
  const staminaCost = 20;
  user.rpg.stamina = user.rpg.stamina ?? 100;

  if (user.rpg.stamina < staminaCost) {
    return m.reply(`Mata sepet kebanyakan natap layar! 😵\n\nStreaming butuh *${staminaCost} Stamina*, sisa stamina kamu *${user.rpg.stamina}*. Tidur dulu woi! 🛏️`);
  }

  user.rpg.stamina -= staminaCost;
  await m.react("🎥");
  await m.reply(`Halo guys, welcome back to my live stream! 🎮\nMari kita unjuk skill main game cacing... 😎`);
  await new Promise(r => setTimeout(r, 3500));

  const gacha = Math.random();

  if (gacha < 0.15) {
    const extraCooldown = 300;
    db.db.data.users[m.sender.split("@")[0]].lastStreamer = Date.now() + (extraCooldown * 1000);
    
    await m.react("🚫");
    return m.reply(`AKUN STREAMING KAMU DI-BANNED! 🚫😱\n\nAda viewers iseng yang ngereport akun kamu gara-gara afk terlalu lama!\nKamu tidak dapet donasi apa-apa dan **terkena penalti larangan streaming selama 5 menit ekstra**!\n\n⚡ Stamina tetap berkurang: -${staminaCost}\n\nSabar ya bang, coba ajuin banding... 😔`);
  }

  const earning = Math.floor(Math.random() * 30000) + 10000;
  let saweranPaus = 0;

  if (gacha > 0.85) {
    saweranPaus = Math.floor(Math.random() * 100000) + 50000;
  }

  const totalEarning = earning + saweranPaus;
  user.koin = (user.koin || 0) + totalEarning;
  const expGain = Math.floor(totalEarning / 30);
  await addExpWithLevelCheck(sock, m, db, user, expGain);

  await m.react("✅");
  let txt = `LIVE STREAMING SELESAI! 🎥✨\n\n💵 Pendapatan Iklan: *+Rp ${earning.toLocaleString("id-ID")}*\n`;
  if (saweranPaus > 0) txt += `🐳 SAWERAN SULTAN: *+Rp ${saweranPaus.toLocaleString("id-ID")}*\nWah, ada penonton sultan nyawer paus! 🐋🔥\n`;
  txt += `📈 EXP: *+${expGain}*\n⚡ Stamina: -${staminaCost}\n\nMakasih yang udah nyawer! Lopyu pull! 💖`;
  
  m.reply(txt);
}

export { pluginConfig as config, handler };
