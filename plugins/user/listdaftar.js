/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import config from "../../config.js";

const PAGE_SIZE = 20;

function getRegistrationContextInfo() {
  const saluranId = config.saluran?.id || "120363412350560864@newsletter";
  const saluranName = config.saluran?.name || config.bot?.name || "Rimuru-AI";

  return {
    forwardingScore: 9999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: saluranId,
      newsletterName: saluranName,
      serverMessageId: 127,
    },
  };
}

function getRegistrationTime(user) {
  const value = user?.lastRegisteredAt || user?.registeredAt || null;
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseListOptions(input) {
  const tokens = String(input || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  let page = 1;
  let search = "";
  let sort = "default";

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i].toLowerCase();

    if (token === "page" || token === "hal" || token === "halaman") {
      const next = parseInt(tokens[i + 1], 10);
      if (!Number.isNaN(next) && next > 0) {
        page = next;
        i += 1;
      }
      continue;
    }

    if (token === "search" || token === "cari" || token === "nama") {
      const searchTokens = [];
      for (let j = i + 1; j < tokens.length; j += 1) {
        const nextToken = tokens[j].toLowerCase();
        if (
          [
            "page",
            "hal",
            "halaman",
            "search",
            "cari",
            "nama",
            "sort",
            "urut",
          ].includes(nextToken)
        )
          break;
        searchTokens.push(tokens[j]);
        i = j;
      }
      if (searchTokens.length) {
        search = searchTokens.join(" ").trim();
      }
      continue;
    }

    if (token === "sort" || token === "urut") {
      const nextToken = tokens[i + 1]?.toLowerCase();
      if (nextToken === "terbaru" || nextToken === "newest") {
        sort = "terbaru";
        i += 1;
      }
      continue;
    }

    if (token === "terbaru" || token === "newest") {
      sort = "terbaru";
      continue;
    }

    if (/^\d+$/.test(token) && page === 1) {
      page = parseInt(token, 10);
    }
  }

  return { page, search, sort };
}

const pluginConfig = {
  name: "listdaftar",
  alias: ["listuser", "registeredusers", "daftarlist"],
  category: "user",
  description:
    "Lihat daftar user yang sudah terdaftar dengan filter dan pagination",
  usage: ".listdaftar [page <nomor>] [search <nama>] [sort terbaru]",
  example: ".listdaftar search zann sort terbaru page 2",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const allUsers = db.getAllUsers();
  const options = parseListOptions(m.text);
  let registeredUsers = Object.values(allUsers).filter((u) => u.isRegistered);

  if (registeredUsers.length === 0) {
    return m.reply(`❌ Belum ada user yang terdaftar!`);
  }

  if (options.search) {
    const keyword = options.search.toLowerCase();
    registeredUsers = registeredUsers.filter((user) =>
      String(user.regName || "")
        .toLowerCase()
        .includes(keyword),
    );
  }

  if (options.sort === "terbaru") {
    registeredUsers.sort(
      (a, b) => getRegistrationTime(b) - getRegistrationTime(a),
    );
  }

  if (registeredUsers.length === 0) {
    return m.reply(
      `❌ Tidak ada user yang cocok dengan pencarian: *${options.search}*`,
    );
  }

  const totalPages = Math.max(1, Math.ceil(registeredUsers.length / PAGE_SIZE));
  const page = Math.min(Math.max(options.page, 1), totalPages);
  const startIndex = (page - 1) * PAGE_SIZE;
  const displayUsers = registeredUsers.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  let text = `📋 *ᴅᴀꜰᴛᴀʀ ᴜsᴇʀ ᴛᴇʀᴅᴀꜰᴛᴀʀ*\n\n`;
  text += `> Total hasil: *${registeredUsers.length}* user\n`;
  text += `> Halaman: *${page}/${totalPages}*\n`;
  text += `> Urut: *${options.sort === "terbaru" ? "Terbaru" : "Default"}*\n`;
  if (options.search) {
    text += `> Search: *${options.search}*\n`;
  }
  text += `\n`;

  displayUsers.forEach((user, i) => {
    const genderEmoji =
      user.regGender === "Laki-laki"
        ? "👨"
        : user.regGender === "Perempuan"
          ? "👩"
          : "👤";
    const listNumber = startIndex + i + 1;
    const registeredAt = formatDateTime(
      user.lastRegisteredAt || user.registeredAt,
    );
    text += `${listNumber}. ${genderEmoji} *${user.regName || "Unknown"}*\n`;
    text += `   > @${user.jid} | ${user.regAge || "?"} tahun | ${registeredAt}\n`;
  });

  if (totalPages > 1) {
    text += `\n> Gunakan \`${m.prefix}listdaftar page ${page + 1 > totalPages ? totalPages : page + 1}\` untuk halaman lain`;
  }

  const mentions = displayUsers.map((u) => u.jid + "@s.whatsapp.net");

  await sock.sendMessage(
    m.chat,
    {
      text,
      mentions,
      contextInfo: {
        mentionedJid: mentions,
        ...getRegistrationContextInfo(),
      },
    },
    { quoted: m },
  );
}

export { pluginConfig as config, handler };
