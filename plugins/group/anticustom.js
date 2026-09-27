/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "anticustom",
  alias: ["antiaddcustom", "customanti"],
  category: "group",
  description: "Bikin AntiCustom lewat sesi tanya jawab per langkah",
  usage: ".anticustom <on/off/list/add/del/metode/cancel>",
  example: ".anticustom",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  isAdmin: true,
  isBotAdmin: true,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

if (!global.anticustomSessions) global.anticustomSessions = new Map();

const SESSION_TIMEOUT = 10 * 60 * 1000;

function normalizeRules(rules) {
  return Array.isArray(rules)
    ? rules.filter((rule) => rule && rule.pattern)
    : [];
}

function formatRule(rule, index) {
  const type = rule.type === "regex" ? "regex" : "contains";
  const action = rule.action || "remove";
  const title = rule.groupName || rule.name || "-";
  return `${index + 1}. *${title}*\n> pattern: \`${rule.pattern}\`\n> type: *${type}*\n> action: *${action}*`;
}

function getSessionKey(m) {
  return `${m.chat}:${m.sender}`;
}

function clearSession(sessionKey) {
  const session = global.anticustomSessions.get(sessionKey);
  if (session?.timeout) clearTimeout(session.timeout);
  global.anticustomSessions.delete(sessionKey);
}

function refreshSessionTimeout(sessionKey) {
  const session = global.anticustomSessions.get(sessionKey);
  if (!session) return;
  if (session.timeout) clearTimeout(session.timeout);
  session.timeout = setTimeout(() => {
    const current = global.anticustomSessions.get(sessionKey);
    if (current?.startedAt === session.startedAt) {
      global.anticustomSessions.delete(sessionKey);
    }
  }, SESSION_TIMEOUT);
}

function normalizeAction(action, fallback = "remove") {
  const value = String(action || fallback).toLowerCase();
  if (["kick", "remove", "delete", "hapus"].includes(value)) {
    return value === "delete" || value === "hapus" ? "remove" : value;
  }
  return fallback;
}

function formatAction(action) {
  return action === "kick" ? "kick member" : "hapus pesan";
}

function parsePatternAnswer(text) {
  const raw = String(text || "").trim();
  if (!raw) return { error: "Jawabannya masih kosong." };

  if (/^regex\s*:/i.test(raw)) {
    const pattern = raw.replace(/^regex\s*:/i, "").trim();
    if (!pattern) return { error: "Regex kosong. Isi setelah `regex:` ya." };
    try {
      new RegExp(pattern, "i");
    } catch {
      return { error: "Regex tidak valid. Coba cek lagi polanya." };
    }
    return {
      type: "regex",
      patterns: [pattern],
    };
  }

  const cleaned = raw.replace(/^contains\s*:/i, "").trim();
  const patterns = [
    ...new Set(
      cleaned
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];

  if (patterns.length === 0) {
    return { error: "Aku belum dapat kata yang ingin dideteksi." };
  }

  return {
    type: "contains",
    patterns,
  };
}

function buildSummary(session) {
  return (
    `> Judul: *${session.title}*\n` +
    `> Tipe deteksi: *${session.type}*\n` +
    `> Pattern: ${session.patterns.map((item) => `\`${item}\``).join(", ")}\n` +
    `> Action: *${formatAction(session.action)}*`
  );
}

async function sendPrompt(sock, m, text) {
  const sent = await sock.sendMessage(m.chat, { text }, { quoted: m });
  return sent?.key?.id || null;
}

async function startWizard(m, sock, mode, isFirstSetup = false) {
  const sessionKey = getSessionKey(m);
  const existing = global.anticustomSessions.get(sessionKey);

  if (existing) {
    await m.reply(
      `⚠️ Kamu masih punya sesi AntiCustom yang belum selesai.\n\n` +
        `> Balas pertanyaan terakhir bot untuk lanjut\n` +
        `> Atau batalkan dengan \`${m.prefix}anticustom cancel\``,
    );
    return;
  }

  const session = {
    chat: m.chat,
    sender: m.sender,
    step: "title",
    title: "",
    type: "contains",
    patterns: [],
    action: normalizeAction(mode, "remove"),
    promptId: null,
    startedAt: Date.now(),
    timeout: null,
  };

  global.anticustomSessions.set(sessionKey, session);
  refreshSessionTimeout(sessionKey);

  const intro = isFirstSetup
    ? `🛡️ *Selamat datang di setup AntiCustom*\n\n` +
      `Aku akan bantu bikin AntiCustom per sesi, langkah demi langkah.\n\n` +
      `*Alurnya:*\n` +
      `1. Tentukan judul rule\n` +
      `2. Isi kata atau pattern yang ingin dideteksi\n` +
      `3. Pilih action saat terdeteksi\n` +
      `4. Konfirmasi detail akhir\n\n`
    : `🛡️ *Yuk tambah rule AntiCustom baru*\n\n`;

  session.promptId = await sendPrompt(
    sock,
    m,
    intro +
      `*Pertanyaan 1/4*\n` +
      `Judulnya apa?\n\n` +
      `> Reply pesan ini dengan judul rule yang kamu mau\n` +
      `> Contoh: \`Anti Kata Kotor\``,
  );
}

function buildGuideMessage(m, status, mode, rules) {
  return (
    `🛡️ *ᴀɴᴛɪᴄᴜsᴛᴏᴍ*\n\n` +
    `> Status: *${status.toUpperCase()}*\n` +
    `> Mode default: *${normalizeAction(mode).toUpperCase()}*\n` +
    `> Total rule: *${rules.length}*\n\n` +
    `Kalau mau nambah AntiCustom lagi:\n` +
    `> \`${m.prefix}anticustom add\`\n\n` +
    `Kalau mau atur status:\n` +
    `> \`${m.prefix}anticustom on\`\n` +
    `> \`${m.prefix}anticustom off\`\n\n` +
    `Kalau mau lihat atau hapus rule:\n` +
    `> \`${m.prefix}anticustom list\`\n` +
    `> \`${m.prefix}anticustom del <judul>\`\n\n` +
    `Kalau mau ubah mode default:\n` +
    `> \`${m.prefix}anticustom metode kick\`\n` +
    `> \`${m.prefix}anticustom metode remove\``
  );
}

async function handler(m, { sock }) {
  const db = getDatabase();
  const args = m.args || [];
  const sub = args[0]?.toLowerCase();
  const groupData = db.getGroup(m.chat) || {};
  const rules = normalizeRules(groupData.anticustomRules);
  const mode = groupData.anticustomMode || "remove";
  const status = groupData.anticustom || "off";
  const sessionKey = getSessionKey(m);

  if (!sub) {
    if (rules.length === 0) {
      await startWizard(m, sock, mode, true);
      return;
    }

    await m.reply(buildGuideMessage(m, status, mode, rules));
    return;
  }

  if (sub === "add" || sub === "baru" || sub === "new" || sub === "buat") {
    await startWizard(m, sock, mode);
    return;
  }

  if (sub === "cancel" || sub === "batal") {
    if (!global.anticustomSessions.has(sessionKey)) {
      await m.reply("⚠️ Tidak ada sesi AntiCustom yang sedang berjalan.");
      return;
    }
    clearSession(sessionKey);
    await m.reply("✅ Sesi AntiCustom dibatalkan.");
    return;
  }

  if (sub === "on") {
    db.setGroup(m.chat, { anticustom: "on" });
    await m.reply("✅ *AntiCustom diaktifkan*");
    return;
  }

  if (sub === "off") {
    db.setGroup(m.chat, { anticustom: "off" });
    await m.reply("❌ *AntiCustom dinonaktifkan*");
    return;
  }

  if (sub === "metode") {
    const action = normalizeAction(args[1], "");
    if (!action) {
      await m.reply(
        "❌ Gunakan: `.anticustom metode kick` atau `.anticustom metode remove`",
      );
      return;
    }
    db.setGroup(m.chat, { anticustom: "on", anticustomMode: action });
    await m.reply(
      `✅ *Mode default AntiCustom sekarang ${action.toUpperCase()}*`,
    );
    return;
  }

  if (sub === "list") {
    if (rules.length === 0) {
      await m.reply("📋 Belum ada rule AntiCustom di grup ini.");
      return;
    }
    await m.reply(
      `📋 *ʟɪsᴛ ᴀɴᴛɪᴄᴜsᴛᴏᴍ*\n\n${rules.map(formatRule).join("\n\n")}`,
    );
    return;
  }

  if (sub === "del" || sub === "delete" || sub === "remove") {
    const name = args.slice(1).join(" ").trim().toLowerCase();
    if (!name) {
      await m.reply("❌ Format: `.anticustom del <judul>`");
      return;
    }

    const nextRules = rules.filter((rule) => {
      const ruleName = String(rule.name || "").toLowerCase();
      const groupName = String(rule.groupName || "").toLowerCase();
      return !(
        ruleName === name ||
        groupName === name ||
        ruleName.startsWith(`${name} #`)
      );
    });

    if (nextRules.length === rules.length) {
      await m.reply(`❌ Rule dengan judul \`${name}\` tidak ditemukan.`);
      return;
    }

    db.setGroup(m.chat, { anticustomRules: nextRules });
    await m.reply(`✅ Rule dengan judul \`${name}\` berhasil dihapus.`);
    return;
  }

  await m.reply(
    "❌ Subcommand tidak valid. Gunakan: on, off, list, add, del, metode, cancel",
  );
}

async function replyHandler(m, { sock }) {
  if (!m.quoted) return false;
  if (m.isCommand) return false;

  const sessionKey = getSessionKey(m);
  const session = global.anticustomSessions.get(sessionKey);
  if (!session) return false;
  if (session.chat !== m.chat || session.sender !== m.sender) return false;

  const quotedId = m.quoted?.id || m.quoted?.key?.id;
  if (!quotedId || quotedId !== session.promptId) return false;

  const text = String(m.body || "").trim();
  if (!text) return false;

  refreshSessionTimeout(sessionKey);

  if (session.step === "title") {
    if (text.length < 2 || text.length > 40) {
      await m.reply("❌ Judul harus 2-40 karakter ya.");
      return true;
    }

    session.title = text;
    session.step = "patterns";
    session.promptId = await sendPrompt(
      sock,
      m,
      `🛡️ *Pertanyaan 2/4*\n\n` +
        `Oke, judulnya *${session.title}*.\n\n` +
        `Sekarang, berikan kata-kata yang ingin dideteksi oleh aku.\n\n` +
        `Kamu bisa pilih salah satu format:\n` +
        `> *Contains*: kirim kata dipisah koma atau baris baru\n` +
        `> *Regex*: awali jawaban dengan \`regex:\`\n\n` +
        `Contoh contains:\n` +
        `> \`anjing, goblok, tolol\`\n\n` +
        `Contoh regex:\n` +
        `> \`regex: (anj|anjing|a+n+j+)\`\n\n` +
        `*Reply pesan ini dengan jawabanmu*`,
    );
    return true;
  }

  if (session.step === "patterns") {
    const parsed = parsePatternAnswer(text);
    if (parsed.error) {
      await m.reply(`❌ ${parsed.error}`);
      return true;
    }

    session.type = parsed.type;
    session.patterns = parsed.patterns;
    session.step = "action";
    session.promptId = await sendPrompt(
      sock,
      m,
      `🛡️ *Pertanyaan 3/4*\n\n` +
        `Berarti kamu mau ini ya:\n` +
        `${session.patterns.map((item, index) => `${index + 1}. \`${item}\``).join("\n")}\n\n` +
        `> Tipe deteksi: *${session.type}*\n\n` +
        `Oke siap, kalau pesan member mengandung kata-kata itu, kamu ingin aku *hapus pesan* atau langsung *kick*?\n\n` +
        `*Reply pesan ini dengan:* \`hapus\` atau \`kick\``,
    );
    return true;
  }

  if (session.step === "action") {
    const action = normalizeAction(text, "");
    if (!action) {
      await m.reply("❌ Balas dengan `hapus` atau `kick` ya.");
      return true;
    }

    session.action = action;
    session.step = "confirm";
    session.promptId = await sendPrompt(
      sock,
      m,
      `🛡️ *Pertanyaan 4/4*\n\n` +
        `Oke siap, berikut detail yang kamu mau:\n\n` +
        `${buildSummary(session)}\n\n` +
        `Apakah sudah sesuai?\n\n` +
        `*Reply pesan ini dengan:* \`ya\` untuk simpan atau \`batal\` untuk membatalkan`,
    );
    return true;
  }

  if (session.step === "confirm") {
    if (/^(batal|cancel|tidak|nggak|ga|gak|no)$/i.test(text)) {
      clearSession(sessionKey);
      await m.reply(
        "✅ Oke, sesi AntiCustom dibatalkan. Kalau mau mulai lagi, ketik `.anticustom add`.",
      );
      return true;
    }

    if (!/^(ya|iya|y|yes|oke|ok|setuju|gas|lanjut|sip|siap)$/i.test(text)) {
      await m.reply(
        "❌ Balas dengan `ya` untuk simpan atau `batal` untuk membatalkan.",
      );
      return true;
    }

    const db = getDatabase();
    const groupData = db.getGroup(m.chat) || {};
    const currentRules = normalizeRules(groupData.anticustomRules);
    const titleKey = session.title.toLowerCase();
    const filteredRules = currentRules.filter((rule) => {
      const ruleName = String(rule.name || "").toLowerCase();
      const groupName = String(rule.groupName || "").toLowerCase();
      return !(
        ruleName === titleKey ||
        groupName === titleKey ||
        ruleName.startsWith(`${titleKey} #`)
      );
    });

    const createdAt = new Date().toISOString();
    const generatedRules = session.patterns.map((pattern, index) => ({
      name:
        session.patterns.length === 1
          ? session.title
          : `${session.title} #${index + 1}`,
      groupName: session.title,
      pattern,
      type: session.type,
      action: session.action,
      flags: "i",
      createdAt,
    }));

    db.setGroup(m.chat, {
      anticustom: "on",
      anticustomMode: session.action,
      anticustomRules: [...filteredRules, ...generatedRules],
    });

    clearSession(sessionKey);

    await sock.sendMessage(
      m.chat,
      {
        text:
          `✅ *AntiCustom berhasil dibuat*\n\n` +
          `${buildSummary(session)}\n\n` +
          `> Status otomatis: *ON*\n` +
          `> Total rule baru: *${generatedRules.length}*\n\n` +
          `Kalau mau lihat panduan lagi, ketik \`${m.prefix}anticustom\``,
      },
      { quoted: m },
    );
    return true;
  }

  return false;
}

export { pluginConfig as config, handler, replyHandler };
