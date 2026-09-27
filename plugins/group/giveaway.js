/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from "../../config.js";
import * as timeHelper from "../../src/lib/elaina-time.js";
import { CronJob } from "cron";
import { getDatabase } from "../../src/lib/elaina-database.js";
import { fetchGroupsSafe } from "../../src/lib/elaina-jpm-helper.js";

function generateGiveawayId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "GA-";
  for (let i = 0; i < 6; i++)
    id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function parseTime(str) {
  if (!str) return null;
  const match = str.match(/^(\d+)(s|m|h|d)$/i);
  if (!match) return null;
  const num = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return num * (multipliers[unit] || 0);
}

function formatDuration(ms) {
  if (ms < 60000) return `${Math.floor(ms / 1000)} detik`;
  if (ms < 3600000) return `${Math.floor(ms / 60000)} menit`;
  if (ms < 86400000) return `${Math.floor(ms / 3600000)} jam`;
  return `${Math.floor(ms / 86400000)} hari`;
}

function getCtx() {
  const saluranId = config.saluran?.id || "";
  const saluranName = config.saluran?.name || config.bot?.name || "";
  const ctx = { forwardingScore: 1, isForwarded: true };
  if (saluranId && saluranId !== "-@newsletter") {
    ctx.forwardedNewsletterMessageInfo = {
      newsletterJid: saluranId,
      newsletterName: saluranName,
      serverMessageId: Math.floor(Math.random() * 1000) + 1,
    };
  }
  return ctx;
}

if (!global.giveawaySessions) global.giveawaySessions = new Map();
const createSessions = global.giveawaySessions;

function hasActiveSession(senderJid) {
  return createSessions.has(senderJid);
}

async function handleSession(m, sock) {
  const session = createSessions.get(m.sender);
  if (!session) return false;

  const text = (m.body || m.text || "").trim();
  if (!text) return false;

  if (session.step === "q1") {
    const parts = text.split("|").map((s) => s.trim());
    if (parts.length < 3) return true;

    const [title, durationStr, winnersStr] = parts;
    const duration = parseTime(durationStr);
    if (!duration) return true;

    const winners = parseInt(winnersStr);
    if (isNaN(winners) || winners < 1) return true;

    session.title = title;
    session.duration = duration;
    session.winners = winners;
    session.step = "q2";

    await m.reply(
      `✅ Detail tersimpan!\n┃ 🎁 ${title}\n┃ ⏱️ ${formatDuration(duration)}\n┃ 👥 ${winners} pemenang\n\n_Mengambil daftar grup..._`,
    );

    try {
      const rawGroups = await fetchGroupsSafe(sock);
      const groups = Array.isArray(rawGroups)
        ? rawGroups
        : Object.values(rawGroups);
      const currentGroup = session.chatId;
      const otherGroups = groups.filter((g) => g.id !== currentGroup);

      const buttons = [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "📍 Di grup ini",
            id: `.giveaway selectgroup ${currentGroup}`,
          }),
        },
      ];

      if (otherGroups.length > 0) {
        const sections = [
          {
            title: "Pilih Grup",
            rows: otherGroups.slice(0, 10).map((g) => ({
              title: g.subject || g.id,
              id: `.giveaway selectgroup ${g.id}`,
            })),
          },
        ];
        buttons.push({
          name: "single_select",
          buttonParamsJson: JSON.stringify({
            title: "Pilih Grup Lain",
            sections,
          }),
        });
      }

      await sock.sendButton(
        m.chat,
        null,
        "🎁 *GIVEAWAY CREATOR*\n\nPertanyaan 2/3:\nMau jalankan giveaway di grup ini atau grup lain?",
        m,
        { buttons, footer: "Pilih grup untuk giveaway" },
      );
    } catch (e) {
      session.groupId = currentGroup;
      session.step = "q3";
      await m.reply("⚠️ Gagal mengambil daftar grup. Menggunakan grup ini.");
      await askPrizeDetails(m, sock, session);
    }
    return true;
  }

  if (session.step === "q3") {
    const parts = text.split("|").map((s) => s.trim());
    if (parts.length < 2) return true;

    const [prizeName, ...detailParts] = parts;
    session.prizeName = prizeName;
    session.prizeDetails = detailParts.join(" | ");

    await m.reply("✅ Detail hadiah tersimpan! Membuat giveaway...");

    await createGiveaway(session, sock, m);
    createSessions.delete(m.sender);
    return true;
  }

  return false;
}

async function askPrizeDetails(m, sock, session) {
  try {
    const adminJid = session.adminJid;
    await sock.sendMessage(
      adminJid,
      {
        text:
          "🎁 *GIVEAWAY CREATOR*\n\n" +
          "Pertanyaan 3/3:\nBerikan detail hadiah dengan format:\n" +
          "nama hadiah | detail hadiah\n\n" +
          "Contoh: Premium Account | Email: xxx@gmail.com | Password: xxx",
        contextInfo: getCtx(),
      },
      { quoted: m },
    );
  } catch (e) {
    await m.reply("⚠️ Gagal mengirim PM. Silakan chat bot dulu lalu ulangi.");
    createSessions.delete(session.adminJid);
  }
}

async function createGiveaway(session, sock, m) {
  const db = getDatabase();
  const giveaways = db.setting("giveaways") || {};
  const giveawayId = generateGiveawayId();

  const giveaway = {
    giveawayId,
    chatId: session.groupId,
    title: session.title,
    duration: session.duration,
    endTime: Date.now() + session.duration,
    winners: session.winners,
    prizeName: session.prizeName,
    prizeDetails: session.prizeDetails,
    participants: [],
    winnerList: [],
    ended: false,
    giveawayMsgId: null,
    createdBy: session.adminJid,
    createdAt: Date.now(),
  };

  giveaways[giveawayId] = giveaway;
  db.setting("giveaways", giveaways);

  const endTimeFormatted = timeHelper.fromTimestamp(
    giveaway.endTime,
    "DD/MM/YYYY HH:mm",
  );
  const remaining = formatDuration(giveaway.duration);

  const giveawayText =
    "🎉 *G I V E A W A Y*\n\n" +
    `╭┈┈⬡「 📋 *ɪɴꜰᴏ* 」\n` +
    `┃ 🎁 ᴛɪᴛʟᴇ: *${giveaway.title}*\n` +
    `┃ 🏆 ʜᴀᴅɪᴀʜ: *${giveaway.prizeName}*\n` +
    `┃ 👥 ᴘᴇᴍᴇɴᴀɴɢ: ${giveaway.winners}\n` +
    `┃ ⏰ ʙᴇʀᴀᴋʜɪʀ: ${endTimeFormatted}\n` +
    `┃ ⏱️ ᴅᴜʀᴀsɪ: ${remaining}\n` +
    `┃ 🆔 ɪᴅ: \`${giveawayId}\`\n` +
    `╰┈┈⬡\n\n` +
    `> Klik tombol *Join* untuk ikut giveaway!`;

  const joinButton = [
    {
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({
        display_text: "🎉 Join",
        id: `.giveaway join ${giveawayId}`,
      }),
    },
  ];

  try {
    const sentMsg = await sock.sendButton(
      giveaway.chatId,
      null,
      giveawayText,
      null,
      {
        buttons: joinButton,
        footer: "Klik Join untuk berpartisipasi",
        contextInfo: getCtx(),
      },
    );

    giveaway.giveawayMsgId = sentMsg?.key?.id || null;
    giveaways[giveawayId] = giveaway;
    db.setting("giveaways", giveaways);
  } catch (e) {
    giveaway.giveawayMsgId = null;
    giveaways[giveawayId] = giveaway;
    db.setting("giveaways", giveaways);
  }

  await sock.sendMessage(
    session.adminJid,
    {
      text: "✅ Giveaway berhasil dibuat! Cek pesan giveaway di grup yang dipilih.",
      contextInfo: getCtx(),
    },
    { quoted: m },
  );
}

async function endGiveaway(giveawayId, sock, db) {
  const giveaways = db.setting("giveaways") || {};
  const giveaway = giveaways[giveawayId];
  if (!giveaway || giveaway.ended) return;

  giveaway.ended = true;

  if (giveaway.participants.length === 0) {
    giveaway.winnerList = [];
    db.setting("giveaways", giveaways);

    await sock.sendMessage(giveaway.chatId, {
      text:
        `😔 *GIVEAWAY BERAKHIR*\n\n` +
        `Giveaway *${giveaway.title}* berakhir tanpa peserta.\n\n` +
        `╭┈┈⬡「 📋 *ɪɴꜰᴏ* 」\n` +
        `┃ 🆔 ɪᴅ: \`${giveawayId}\`\n` +
        `┃ 👥 ᴘᴇsᴇʀᴛᴀ: 0\n` +
        `╰┈┈⬡`,
      contextInfo: getCtx(),
    });
    return;
  }

  const winnerCount = Math.min(giveaway.winners, giveaway.participants.length);
  const shuffled = [...giveaway.participants].sort(() => Math.random() - 0.5);
  giveaway.winnerList = shuffled.slice(0, winnerCount);
  db.setting("giveaways", giveaways);

  const winnerText = giveaway.winnerList
    .map((w, i) => `${i + 1}. @${w.split("@")[0]}`)
    .join("\n");

  const firstWinner = giveaway.winnerList[0];
  const fakeQuoted = {
    key: {
      id: `${Date.now()}@bot`,
      remoteJid: giveaway.chatId,
      participant: firstWinner,
      fromMe: false,
    },
    message: {
      conversation: "Yeyy aku menang",
    },
  };

  await sock.sendMessage(
    giveaway.chatId,
    {
      text:
        `🎊 *GIVEAWAY BERAKHIR!*\n\n` +
        `╭┈┈⬡「 🏆 *ᴘᴇᴍᴇɴᴀɴɢ* 」\n` +
        `${winnerText}\n` +
        `╰┈┈⬡\n\n` +
        `╭┈┈⬡「 📋 *ɪɴꜰᴏ* 」\n` +
        `┃ 🎁 ᴛɪᴛʟᴇ: *${giveaway.title}*\n` +
        `┃ 🏆 ʜᴀᴅɪᴀʜ: *${giveaway.prizeName}*\n` +
        `┃ 🆔 ɪᴅ: \`${giveawayId}\`\n` +
        `┃ 👥 ᴘᴇsᴇʀᴛᴀ: ${giveaway.participants.length}\n` +
        `╰┈┈⬡\n\n` +
        `> Hadiah dikirim ke private chat pemenang!`,
      contextInfo: { ...getCtx(), mentionedJid: giveaway.winnerList },
    },
    { quoted: fakeQuoted },
  );

  for (const winnerJid of giveaway.winnerList) {
    try {
      const winnerFakeQuoted = {
        key: {
          id: `${Date.now()}@bot`,
          remoteJid: giveaway.chatId,
          participant: winnerJid,
          fromMe: false,
        },
        message: {
          conversation: "Yeyy aku menang",
        },
      };
      const ctx = getCtx();
      ctx.mentionedJid = [winnerJid];
      await sock.sendMessage(
        winnerJid,
        {
          text:
            `🎉 *sᴇʟᴀᴍᴀᴛ!*\n\n` +
            `> Kamu memenangkan giveaway!\n\n` +
            `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
            `┃ 🎁 ᴛɪᴛʟᴇ: \`${giveaway.title}\`\n` +
            `┃ 🏆 ʜᴀᴅɪᴀʜ: *${giveaway.prizeName}*\n` +
            `┃ 🆔 ɪᴅ: \`${giveawayId}\`\n` +
            `╰┈┈⬡\n\n` +
            `╭┈┈⬡「 🎁 *ᴅᴇᴛᴀɪʟ ʜᴀᴅɪᴀʜ* 」\n` +
            `${giveaway.prizeDetails || "Hubungi admin untuk detail"}\n` +
            `╰┈┈⬡\n\n` +
            `> _Ini informasi resmi dari bot._`,
          contextInfo: ctx,
        },
        { quoted: winnerFakeQuoted },
      );
    } catch (e) {}
  }
}

function startGiveawayChecker(sock, db) {
  new CronJob(
    "* * * * *",
    async () => {
      try {
        const { getDatabase } = await import("../../src/lib/elaina-database.js");
        const currentDb = getDatabase();
        const { getSocket } = await import("../../src/connection.js");
        const currentSock = getSocket();
        if (!currentSock) return;

        const giveaways = currentDb.setting("giveaways") || {};
        const now = Date.now();
        for (const [id, ga] of Object.entries(giveaways)) {
          if (!ga.ended && ga.endTime && now >= ga.endTime) {
            await endGiveaway(id, currentSock, currentDb);
          }
        }
      } catch (e) {}
    },
    null,
    true,
    "Asia/Jakarta",
  );
}

const createCmds = ["giveawaycreate", "gacreate", "buatgiveaway"];
const listCmds = ["giveawaylist", "galist", "listgiveaway"];
const deleteCmds = ["giveawaydelete", "gadelete", "hapusgiveaway"];
const rerollCmds = ["giveawayreroll", "gareroll", "ulangigiveaway"];

const plugin = {
  name: ["giveaway", ...createCmds, ...listCmds, ...deleteCmds, ...rerollCmds],
  alias: "ga",
  category: "group",
  description: "Sistem giveaway dengan interactive buttons",
  admin: false,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const cmd = m.command?.toLowerCase() || "";
  const prefix = m.prefix || ".";
  const args = m.args || [];

  if (createCmds.includes(cmd)) {
    if (!m.isAdmin && !m.isOwner)
      return m.reply("⚠️ Hanya admin yang bisa membuat giveaway!");
    if (!m.isGroup) return m.reply("⚠️ Gunakan di grup!");
    if (createSessions.has(m.sender))
      return m.reply("⚠️ Kamu masih punya sesi pembuatan aktif!");

    createSessions.set(m.sender, {
      step: "q1",
      chatId: m.chat,
      adminJid: m.sender,
      title: null,
      duration: null,
      winners: null,
      groupId: null,
      prizeName: null,
      prizeDetails: null,
    });

    await m.reply(
      "🎁 *GIVEAWAY CREATOR*\n\n" +
        "Pertanyaan 1/3:\nBerikan detail giveaway dengan format:\n" +
        "nama | durasi | jumlah pemenang\n\n" +
        "Contoh: Premium Account | 5m | 1\n" +
        "Durasi: 30s, 5m, 1h, 1d\n\n" +
        "> Bot akan diam jika format salah",
    );
    return;
  }

  if (cmd === "giveaway" && args[0]?.toLowerCase() === "selectgroup") {
    const session = createSessions.get(m.sender);
    if (!session || session.step !== "q2") return;

    const groupId = args[1];
    if (!groupId) return;

    session.groupId = groupId;
    session.step = "q3";

    await m.reply(
      "✅ Grup dipilih! Cek private chat untuk pertanyaan selanjutnya.",
    );
    await askPrizeDetails(m, sock, session);
    return;
  }

  if (cmd === "giveaway" && args[0]?.toLowerCase() === "join") {
    const giveawayId = args[1];
    if (!giveawayId) return;

    const giveaways = db.setting("giveaways") || {};
    const giveaway = giveaways[giveawayId];
    if (!giveaway) return m.reply("⚠️ Giveaway tidak ditemukan!");
    if (giveaway.ended) return m.reply("⚠️ Giveaway sudah berakhir!");
    if (giveaway.participants.includes(m.sender))
      return m.reply("⚠️ Kamu sudah join!");

    giveaway.participants.push(m.sender);
    db.setting("giveaways", giveaways);

    await m.react("✅");
    await m.reply(
      `✅ @${m.sender.split("@")[0]} berhasil join giveaway! (${giveaway.participants.length} peserta)`,
    );
    return;
  }

  if (listCmds.includes(cmd)) {
    if (!m.isAdmin && !m.isOwner) return m.reply("⚠️ Hanya admin!");
    const giveaways = db.setting("giveaways") || {};
    const entries = Object.values(giveaways);
    if (entries.length === 0) return m.reply("📋 Tidak ada giveaway.");

    const active = entries.filter((g) => !g.ended);
    const ended = entries.filter((g) => g.ended);

    let text = "📋 *DAFTAR GIVEAWAY*\n\n";
    if (active.length > 0) {
      text += "🟢 *Aktif:*\n";
      for (const g of active) {
        const endFmt = timeHelper.fromTimestamp(g.endTime, "DD/MM/YYYY HH:mm");
        text += `┃ 🆔 \`${g.giveawayId}\` — ${g.title} (${g.participants.length} peserta, berakhir ${endFmt})\n`;
      }
      text += "\n";
    }
    if (ended.length > 0) {
      text += "🔴 *Berakhir:*\n";
      for (const g of ended.slice(-5)) {
        text += `┃ 🆔 \`${g.giveawayId}\` — ${g.title} (${g.winnerList?.length || 0} pemenang)\n`;
      }
    }

    await m.reply(text);
    return;
  }

  if (deleteCmds.includes(cmd)) {
    if (!m.isAdmin && !m.isOwner) return m.reply("⚠️ Hanya admin!");
    const giveawayId = args[0];
    if (!giveawayId) return m.reply(`⚠️ Format: ${prefix}${cmd} GA-XXXXXX`);

    const giveaways = db.setting("giveaways") || {};
    if (!giveaways[giveawayId]) return m.reply("⚠️ Giveaway tidak ditemukan!");

    delete giveaways[giveawayId];
    db.setting("giveaways", giveaways);
    await m.reply(`✅ Giveaway \`${giveawayId}\` berhasil dihapus!`);
    return;
  }

  if (rerollCmds.includes(cmd)) {
    if (!m.isAdmin && !m.isOwner) return m.reply("⚠️ Hanya admin!");
    const giveawayId = args[0];
    if (!giveawayId) return m.reply(`⚠️ Format: ${prefix}${cmd} GA-XXXXXX`);

    const giveaways = db.setting("giveaways") || {};
    const giveaway = giveaways[giveawayId];
    if (!giveaway) return m.reply("⚠️ Giveaway tidak ditemukan!");
    if (!giveaway.ended) return m.reply("⚠️ Giveaway belum berakhir!");
    if (giveaway.participants.length === 0)
      return m.reply("⚠️ Tidak ada peserta!");

    const winnerCount = Math.min(
      giveaway.winners,
      giveaway.participants.length,
    );
    const shuffled = [...giveaway.participants].sort(() => Math.random() - 0.5);
    giveaway.winnerList = shuffled.slice(0, winnerCount);
    db.setting("giveaways", giveaways);

    const winnerText = giveaway.winnerList
      .map((w, i) => `${i + 1}. @${w.split("@")[0]}`)
      .join("\n");

    await sock.sendMessage(giveaway.chatId, {
      text:
        `🔄 *GIVEAWAY REROLL!*\n\n` +
        `╭┈┈⬡「 🏆 *ᴘᴇᴍᴇɴᴀɴɢ ʙᴀʀᴜ* 」\n` +
        `${winnerText}\n` +
        `╰┈┈⬡\n\n` +
        `╭┈┈⬡「 📋 *ɪɴꜰᴏ* 」\n` +
        `┃ 🎁 ᴛɪᴛʟᴇ: *${giveaway.title}*\n` +
        `┃ 🏆 ʜᴀᴅɪᴀʜ: *${giveaway.prizeName}*\n` +
        `┃ 🆔 ɪᴅ: \`${giveawayId}\`\n` +
        `╰┈┈⬡`,
      contextInfo: { ...getCtx(), mentionedJid: giveaway.winnerList },
    });

    for (const winnerJid of giveaway.winnerList) {
      try {
        const ctx = getCtx();
        ctx.mentionedJid = [winnerJid];
        await sock.sendMessage(winnerJid, {
          text:
            `🎉 *sᴇʟᴀᴍᴀᴛ!*\n\n` +
            `> Kamu memenangkan giveaway (reroll)!\n\n` +
            `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
            `┃ 🎁 ᴛɪᴛʟᴇ: \`${giveaway.title}\`\n` +
            `┃ 🏆 ʜᴀᴅɪᴀʜ: *${giveaway.prizeName}*\n` +
            `┃ 🆔 ɪᴅ: \`${giveawayId}\`\n` +
            `╰┈┈⬡\n\n` +
            `╭┈┈⬡「 🎁 *ᴅᴇᴛᴀɪʟ ʜᴀᴅɪᴀʜ* 」\n` +
            `${giveaway.prizeDetails || "Hubungi admin untuk detail"}\n` +
            `╰┈┈⬡\n\n` +
            `> _Ini informasi resmi dari bot._`,
          contextInfo: ctx,
        });
      } catch (e) {}
    }
    return;
  }

  if (cmd === "giveaway") {
    await m.reply(
      "🎁 *GIVEAWAY MENU*\n\n" +
        `┃ ${prefix}giveawaycreate — Buat giveaway\n` +
        `┃ ${prefix}giveawaylist — Lihat daftar\n` +
        `┃ ${prefix}giveawaydelete — Hapus giveaway\n` +
        `┃ ${prefix}giveawayreroll — Reroll pemenang\n\n` +
        `> Alias: ga, gacreate, galist, gadelete, gareroll`,
    );
    return;
  }
}

export {
  plugin as config,
  handler,
  startGiveawayChecker,
  hasActiveSession,
  handleSession,
};
