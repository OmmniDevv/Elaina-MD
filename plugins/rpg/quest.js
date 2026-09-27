/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "quest",
  alias: ["misi", "mission", "bounty"],
  category: "rpg",
  description: "Ambil quest harian untuk reward bonus",
  usage: ".quest",
  example: ".quest",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 0,
  energi: 0,
  isEnabled: true,
};

const QUESTS = [
  {
    id: "mining5",
    name: "Penambang Pemula",
    desc: "Mining 5 kali",
    target: 5,
    reward: { money: 10000, exp: 1000 },
  },
  {
    id: "fishing5",
    name: "Pemancing Handal",
    desc: "Fishing 5 kali",
    target: 5,
    reward: { money: 8000, exp: 800 },
  },
  {
    id: "adventure3",
    name: "Petualang Sejati",
    desc: "Adventure 3 kali",
    target: 3,
    reward: { money: 15000, exp: 1500 },
  },
  {
    id: "work10",
    name: "Pekerja Keras",
    desc: "Work 10 kali",
    target: 10,
    reward: { money: 20000, exp: 2000 },
  },
  {
    id: "hunt5",
    name: "Pemburu Ulung",
    desc: "Hunt 5 kali",
    target: 5,
    reward: { money: 12000, exp: 1200 },
  },
];

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);

  if (!user.rpg) user.rpg = {};
  if (!user.quest) user.quest = {};

  const args = m.args || [];
  const sub = args[0]?.toLowerCase();

  if (sub === "claim") {
    const questId = args[1];
    if (!questId || !user.quest[questId]) {
      return m.reply(`Hmm.. Misi itu nggak ada di daftar kamu kak! 📜❌`);
    }

    const quest = QUESTS.find((q) => q.id === questId);
    if (!quest) {
      return m.reply(`ID misinya salah kak! Cek lagi papan bounty ya! 🔍`);
    }

    if (user.quest[questId].progress < quest.target) {
      return m.reply(`Misi ini belum selesai kak!\nProgress kamu: *${user.quest[questId].progress}/${quest.target}* 🏃‍♂️💦`);
    }

    if (user.quest[questId].claimed) {
      return m.reply(`Hadiah misi ini udah kamu ambil kak! 😒`);
    }

    user.koin = (user.koin || 0) + quest.reward.money;
    db.updateExp(m.sender, quest.reward.exp);
    user.quest[questId].claimed = true;

    db.save();
    let txt = `💰 *MISI SELESAI!!* 💰\n\n`;
    txt += `Kamu berhasil nyelesaiin misi *${quest.name}*!\n`;
    txt += `Ini hadiah buat kamu kak:\n`;
    txt += `💵 Uang Misi: *+Rp ${quest.reward.money.toLocaleString("id-ID")}*\n`;
    txt += `📈 EXP Bonus: *+${quest.reward.exp}*\n\n`;
    txt += `> _"Kerja bagus kak!" - Resepsionis Guild_ 👩‍💼`;
    return m.reply(txt);
  }

  if (sub === "take") {
    const questId = args[1];
    const quest = QUESTS.find((q) => q.id === questId);
    if (!quest) {
      return m.reply(`Misi nggak ketemu! Liat daftar lengkapnya di \`.quest\``);
    }

    if (user.quest[questId]) {
      return m.reply(`Kamu udah ngambil misi ini kak! Kerjain dulu yuk! ⚔️`);
    }

    user.quest[questId] = { progress: 0, claimed: false, takenAt: Date.now() };
    db.save();

    let txt = `📜 *MISI DIAMBIL!* 📜\n\n`;
    txt += `Kamu mengambil satu kertas misi dari Papan Bounty! 📜✨\n`;
    txt += `🎯 Target: *${quest.name}* (${quest.desc})\n`;
    txt += `🎁 Hadiah: *Rp ${quest.reward.money.toLocaleString("id-ID")}* & *${quest.reward.exp} EXP*\n\n`;
    txt += `> _"Semoga berhasil di perjalanan ya kak!"_ 💖`;
    return m.reply(txt);
  }

  let txt = `📌 *PAPAN BOUNTY (MISI HARIAN)* 📌\n\n`;
  txt += `Selesaikan tugas harian ini buat dapat hadiah bonus yuk kak!\n\n`;

  for (const quest of QUESTS) {
    const userQuest = user.quest[quest.id];
    let status = "📜 Tersedia";
    if (userQuest) {
      if (userQuest.claimed) {
        status = "✅ Selesai";
      } else if (userQuest.progress >= quest.target) {
        status = "🎁 Siap Claim";
      } else {
        status = `🏃 Sedang Dikerjakan (${userQuest.progress}/${quest.target})`;
      }
    }

    txt += `🎯 *${quest.name}*\n`;
    txt += `   ├ Tugas: ${quest.desc}\n`;
    txt += `   ├ Reward: Rp ${quest.reward.money.toLocaleString("id-ID")} & ${quest.reward.exp} EXP\n`;
    txt += `   ├ Status: *${status}*\n`;
    txt += `   └ Ambil: \`${m.prefix}quest take ${quest.id}\`\n\n`;
  }

  txt += `> 💡 Kalau misi udah selesai, ketik: \`.quest claim <id_misi>\``;

  await m.reply(txt);
}

export { pluginConfig as config, handler };
