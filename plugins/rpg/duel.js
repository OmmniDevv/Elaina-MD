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
  name: "duel",
  alias: ["pvp", "fight"],
  category: "rpg",
  description: "Duel PvP dengan player lain",
  usage: ".duel @user <bet>",
  example: ".duel @user 5000",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 120,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const args = m.args || [];

  const target = m.mentionedJid?.[0] || m.quoted?.sender;
  const bet = parseInt(args[1]) || 1000;

  if (!target) {
    let txt = `⚔️ *DUEL TARUHAN* ⚔️\n\n`;
    txt += `Tantang teman kamu untuk duel dengan uang taruhan kak!\n\n`;
    txt += `*Cara Menantang:*\n`;
    txt += `👉 \`.duel @user 5000\`\n`;
    txt += `_(Artinya kamu ngajak dia duel dengan taruhan Rp 5.000)_`;
    return m.reply(txt);
  }

  if (target === m.sender) {
    return m.reply(`Hihihi kak, masak kamu mau ngajak berantem sama cermin? Tag teman yang lain yuk! 😂`);
  }

  if (bet < 1000) {
    return m.reply(`Wah taruhannya kekecilan kak! Minimal uang taruhan buat duel itu *Rp 1.000* ya! 💸`);
  }

  const player1 = db.getUser(m.sender);
  const player2 = db.getUser(target) || db.setUser(target);

  if ((player1.koin || 0) < bet) {
    return m.reply(`Aduh kak, saldo kamu nggak cukup buat pasang taruhan segitu!\nKoin kamu sekarang: *Rp ${(player1.koin || 0).toLocaleString("id-ID")}*`);
  }

  if ((player2.koin || 0) < bet) {
    return m.reply(`Yah kak, sepertinya saldo lawan kamu nggak cukup buat meladeni taruhan ini. Cari lawan lain atau turunin taruhannya ya!`);
  }

  if (!player1.rpg) player1.rpg = {};
  if (!player2.rpg) player2.rpg = {};

  player1.rpg.health = player1.rpg.health || 100;
  player2.rpg.health = player2.rpg.health || 100;

  if (player1.rpg.health < 30) {
    return m.reply(`Eh tunggu kak! Darah kamu sekarat banget (*${player1.rpg.health} HP*). Minimal harus punya *30 HP* buat ikut duel. Istirahat dulu yuk! 💉`);
  }

  await sendRpgPreview(sock, m.chat, `⚔️ *DUEL DIMULAI!* ⚔️\n\n@${m.sender.split("@")[0]} dengan berani menantang @${target.split("@")[0]}!\n💰 Total Taruhan di Tengah: *Rp ${(bet * 2).toLocaleString("id-ID")}*`, "⚔️ ARENA DUEL", "Bertarung!", { quoted: m });

  await new Promise((r) => setTimeout(r, 2000));

  const p1Power = (player1.rpg.level || 1) * 10 + Math.random() * 50;
  const p2Power = (player2.rpg.level || 1) * 10 + Math.random() * 50;

  const winner = p1Power > p2Power ? m.sender : target;
  const loser = winner === m.sender ? target : m.sender;
  const winnerData = winner === m.sender ? player1 : player2;
  const loserData = winner === m.sender ? player2 : player1;

  winnerData.koin = (winnerData.koin || 0) + bet;
  loserData.koin = (loserData.koin || 0) - bet;
  loserData.rpg.health = Math.max(0, (loserData.rpg.health || 100) - 20);

  const expGain = 500;
  await addExpWithLevelCheck(sock, { ...m, sender: winner }, db, winnerData, expGain);

  db.save();

  let txt = `⚔️ *HASIL DUEL BERDARAH* ⚔️\n\n`;
  txt += `🏆 *Pemenang:* @${winner.split("@")[0]}\n`;
  txt += `💀 *Kalah:* @${loser.split("@")[0]} (Mundur dengan luka parah)\n\n`;
  txt += `🎁 *Pemenang Berhak Membawa Pulang:*\n`;
  txt += `> 💰 Uang Taruhan Lawan: *+Rp ${bet.toLocaleString("id-ID")}*\n`;
  txt += `> ✨ Bonus EXP Pertarungan: *+${expGain} EXP*`;

  await sendRpgPreview(sock, m.chat, txt, "⚔️ ARENA DUEL", "Hasil Duel!", { quoted: m });
}

export { pluginConfig as config, handler };
