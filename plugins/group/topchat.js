/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
const pluginConfig = {
  name: "topchat",
  alias: ["chatstat", "chatstats", "totalchat", "leaderboard"],
  category: "group",
  description: "Lihat statistik chat member di grup",
  usage: ".topchat",
  example: ".topchat",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 10,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const group = db.getGroup(m.chat) || {};
  const chatStats = group.chatStats || {};
  const sorted = Object.entries(chatStats)
    .map(([jid, data]) => ({
      jid,
      count: data.count || 0,
      lastChat: data.lastChat || 0,
    }))
    .sort((a, b) => b.count - a.count);
  if (sorted.length === 0) {
    return m.reply(
      `📊 *ᴄʜᴀᴛ sᴛᴀᴛɪsᴛɪᴄs*\n\n` +
      `> Belum ada data chat di grup ini.\n` +
      `> Data akan tercatat otomatis setelah member aktif chat.`,
    );
  }
  let txt = `📊 *TOTAL CHAT*\nBerikut ini adalah jumlah pesan yang dikirim oleh member di grup ini:\n\n`;
  for (let i = 0; i < sorted.length; i++) {
    const { jid, count } = sorted[i];
    const name = group.chatStats[jid]?.name || jid.split("@")[0];
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "▸";
    txt += `${medal} @${jid.split("@")[0]} — *${count.toLocaleString("id-ID")}* pesan\n`;
  }
  txt += `\n*Total Pesan: ${sorted.reduce((a, b) => a + b.count, 0).toLocaleString("id-ID")}*`;
  const mentions = sorted.map((u) => u.jid);
  await m.reply(txt, { mentions });
}
function incrementChatCount(chatId, senderJid, db, pushName) {
  if (!chatId || !senderJid) return;
  const group = db.getGroup(chatId) || {};
  if (!group.chatStats) group.chatStats = {};
  if (!group.chatStats[senderJid]) {
    group.chatStats[senderJid] = {
      count: 0,
      lastChat: 0,
      name: pushName || null,
    };
  }

  group.chatStats[senderJid].count++;
  group.chatStats[senderJid].lastChat = Date.now();
  if (pushName) group.chatStats[senderJid].name = pushName;

  db.setGroup(chatId, group);
}

export { pluginConfig as config, handler, incrementChatCount };
