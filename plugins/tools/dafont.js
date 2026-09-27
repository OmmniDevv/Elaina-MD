/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { DaFont } from "../../src/scraper/dafont.js";

if (!global.dafontSessions) global.dafontSessions = {};

const SESSION_TIMEOUT = 120000;

function getSessionKey(jid) {
  return String(jid || "").replace(/[^0-9]/g, "") || String(jid).toLowerCase();
}

function getSession(jid) {
  const key = getSessionKey(jid);
  return global.dafontSessions[key] || null;
}

function setSession(jid, data) {
  const key = getSessionKey(jid);
  clearSession(jid);
  global.dafontSessions[key] = {
    data,
    chat: null,
    startedAt: Date.now(),
    timeout: setTimeout(() => {
      delete global.dafontSessions[key];
    }, SESSION_TIMEOUT),
  };
  return global.dafontSessions[key];
}

function clearSession(jid) {
  const key = getSessionKey(jid);
  const session = global.dafontSessions[key];
  if (session?.timeout) clearTimeout(session.timeout);
  delete global.dafontSessions[key];
}

const pluginConfig = {
  name: "dafont",
  alias: ["font", "daffont", "carifont"],
  category: "tools",
  description: "Cari dan download font dari DaFont",
  usage: ".dafont <nama font>",
  example: ".dafont arial",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.args.join(" ");
  if (!text) {
    m.react("❌");
    return m.reply(
      `🔤 *DaFont Search*\n\n` +
        `Cari font dari DaFont, lalu reply nomor buat download.\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}dafont <nama font>*\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}dafont arial*\n` +
        `> *${m.prefix}dafont horror*\n\n` +
        `_Setelah daftar muncul, reply pesan bot dengan nomor font buat download_`
    );
  }

  m.react("🕕");

  try {
    const result = await DaFont(text);

    if (!result.status) {
      m.react("☢");
      return m.reply(`❌ *DaFont Gagal*\n\n> ${result.error}`);
    }

    const items = result.results.slice(0, 10);

    let txt = `🔤 *DaFont — ${result.count} Font Ditemukan*\n\n`;
    txt += `> Pencarian: *${text}*\n\n`;

    items.forEach((v, i) => {
      txt += `*${i + 1}.* ${v.name}\n`;
      txt += `   ├ 👤 Author: ${v.author}\n`;
      txt += `   ├ 📥 Downloads: ${v.downloads || "-"}\n`;
      txt += `   └ 📜 License: ${v.license || "-"}\n`;
    });

    txt += `\n_Reply pesan ini dengan nomor font buat download file-nya_`;

    const session = setSession(m.sender, items);
    session.chat = m.chat;

    await m.reply(txt);
    m.react("✅");
  } catch (e) {
    console.error(e);
    m.react("☢");
    m.reply("❌ Gagal mencari font, coba lagi nanti");
  }
}

async function dafontAnswerHandler(m, sock) {
  const session = getSession(m.sender);
  if (!session) return false;
  if (m.chat !== session.chat) return false;

  const text = (m.body || m.text || "").trim();
  const index = parseInt(text) - 1;

  if (isNaN(index) || index < 0 || index >= session.data.length) return false;

  const v = session.data[index];

  let detail = `🔤 *${v.name}*\n\n` +
    `> 👤 Author: ${v.author}\n` +
    `> 📥 Downloads: ${v.downloads || "-"}\n` +
    `> 📜 License: ${v.license || "-"}`;

  if (v.preview) {
    await sock.sendMedia(m.chat, v.preview, detail, m, { type: "image" });
  } else {
    await m.reply(detail);
  }

  if (v.download) {
    await sock.sendMessage(
      m.chat,
      {
        document: { url: v.download },
        fileName: v.name + ".zip",
        mimetype: "application/zip",
      },
      { quoted: m },
    );
  }

  clearSession(m.sender);
  return true;
}

export { pluginConfig as config, handler, dafontAnswerHandler, clearSession };
