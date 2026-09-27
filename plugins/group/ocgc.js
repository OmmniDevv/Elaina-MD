/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from "fs";
import path from "path";

const pluginConfig = {
  name: "ocgc",
  alias: ["autoclosegc", "autogc"],
  category: "group",
  description: "Otomatis tutup dan buka grup sesuai jadwal harian.",
  usage: ".ocgc <jam tutup> | <jam buka> on atau .ocgc off",
  example: ".ocgc 22:00 | 07:00 on",
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

const TIME_ZONE = "Asia/Jakarta";
const DATA_DIR = path.join(process.cwd(), "database");
const DATA_FILE = path.join(DATA_DIR, "ocgc.json");
const CHECK_INTERVAL = 15_000;

let runtimeSocket = null;
let schedulerStarted = false;
let configs = Object.create(null);
let lastAppliedState = new Map();
let schedulerBusy = false;

function ensureDataFile() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
    }
  } catch (error) {
    console.error("[OCGC] Gagal menyiapkan database:", error.message);
  }
}

function loadConfigs() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8").trim();
    const parsed = raw ? JSON.parse(raw) : {};
    configs = parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : Object.create(null);
  } catch (error) {
    console.error("[OCGC] Database rusak/tidak terbaca:", error.message);
    configs = Object.create(null);
  }
  return configs;
}

function saveConfigs() {
  ensureDataFile();
  const tempFile = `${DATA_FILE}.tmp`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(configs, null, 2), "utf8");
    fs.renameSync(tempFile, DATA_FILE);
    return true;
  } catch (error) {
    try {
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    } catch {}
    console.error("[OCGC] Gagal menyimpan database:", error.message);
    return false;
  }
}

function cleanGroupJid(jid) {
  if (typeof jid !== "string") return null;
  const value = jid.trim();
  if (!value || !value.endsWith("@g.us")) return null;
  return value;
}

function parseTime(value) {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^(?:[01]\d|2[0-3]):[0-5]\d$/);
  if (!match) return null;
  const [hour, minute] = value.trim().split(":").map(Number);
  return hour * 60 + minute;
}

function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function getJakartaNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

function isClosedNow(closeTime, openTime, now) {
  // Support jadwal normal maupun melewati tengah malam.
  if (closeTime > openTime) {
    return now >= closeTime || now < openTime;
  }
  return now >= closeTime && now < openTime;
}

function getDesiredState(setting, now = getJakartaNow()) {
  return isClosedNow(setting.closeTime, setting.openTime, now) ? "closed" : "open";
}

function getArgs(m) {
  if (typeof m?.text === "string" && m.text.trim()) return m.text.trim();
  if (Array.isArray(m?.args)) return m.args.join(" ").trim();
  return "";
}

async function reply(m, text) {
  if (typeof m?.reply === "function") return m.reply(text);
  return null;
}

function getRuntimeSocket() {
  return runtimeSocket || globalThis.sock || globalThis.conn || globalThis.rimuruSock || globalThis.__RIMURU_SOCKET__ || null;
}

async function getGroupAdminStatus(sock, groupJid, senderJid) {
  try {
    const metadata = await sock.groupMetadata(groupJid);
    const participants = Array.isArray(metadata?.participants) ? metadata.participants : [];

    const normalize = (jid) => {
      if (!jid || typeof jid !== "string") return "";
      return jid.split(":")[0].split("@")[0].replace(/\D/g, "");
    };

    const sender = normalize(senderJid);
    const bot = normalize(sock?.user?.id);
    const senderParticipant = participants.find((p) => normalize(p?.id || p?.jid) === sender);
    const botParticipant = participants.find((p) => normalize(p?.id || p?.jid) === bot);

    const role = (participant) => participant?.admin === "admin" || participant?.admin === "superadmin";
    return {
      isAdmin: role(senderParticipant),
      isBotAdmin: role(botParticipant),
    };
  } catch {
    return { isAdmin: false, isBotAdmin: false };
  }
}

async function setGroupMode(sock, groupJid, mode) {
  if (!sock || typeof sock.groupSettingUpdate !== "function") {
    throw new Error("API groupSettingUpdate tidak tersedia pada socket Rimuru.");
  }

  const setting = mode === "closed" ? "announcement" : "not_announcement";
  await sock.groupSettingUpdate(groupJid, setting);
}

async function applySetting(sock, groupJid, setting, state, force = false) {
  if (!setting?.enabled) return false;
  if (!groupJid || !sock) return false;
  if (!force && lastAppliedState.get(groupJid) === state) return false;

  try {
    await setGroupMode(sock, groupJid, state);
    lastAppliedState.set(groupJid, state);
    return true;
  } catch (error) {
    // Jangan menghapus jadwal kalau sekali gagal, misalnya bot kehilangan admin.
    console.error(`[OCGC] Gagal mengubah mode ${groupJid} ke ${state}:`, error.message);
    return false;
  }
}

async function syncAll(sock, force = false) {
  if (!sock || schedulerBusy) return;
  schedulerBusy = true;
  try {
    const now = getJakartaNow();
    for (const [groupJid, setting] of Object.entries(configs)) {
      if (!setting?.enabled) continue;
      const clean = cleanGroupJid(groupJid);
      if (!clean) continue;
      const state = getDesiredState(setting, now);
      await applySetting(sock, clean, setting, state, force);
    }
  } finally {
    schedulerBusy = false;
  }
}

function startScheduler() {
  if (schedulerStarted) return;
  schedulerStarted = true;

  ensureDataFile();
  loadConfigs();

  const timer = setInterval(async () => {
    const sock = getRuntimeSocket();
    if (!sock) return;
    await syncAll(sock, false);
  }, CHECK_INTERVAL);

  // Scheduler tidak menahan process Node agar proses shutdown tetap normal.
  if (typeof timer.unref === "function") timer.unref();

  // Coba langsung sinkron saat socket sudah tersedia.
  queueMicrotask(async () => {
    const sock = getRuntimeSocket();
    if (sock) await syncAll(sock, false);
  });
}

async function handleOcgc(m, { sock }) {
  runtimeSocket = sock || runtimeSocket;
  startScheduler();

  const groupJid = cleanGroupJid(m?.chat || m?.key?.remoteJid);
  if (!groupJid) return reply(m, "❌ Fitur `.ocgc` hanya bisa digunakan di dalam grup.");

  const adminFromFramework = m?.isAdmin === true || m?.isOwner === true;
  const botAdminFromFramework = m?.isBotAdmin === true;

  let isAdmin = adminFromFramework;
  let isBotAdmin = botAdminFromFramework;

  if (m?.isAdmin === undefined || m?.isBotAdmin === undefined) {
    const detected = await getGroupAdminStatus(sock, groupJid, m?.sender || m?.participant);
    if (m?.isAdmin === undefined) isAdmin = detected.isAdmin || m?.isOwner === true;
    if (m?.isBotAdmin === undefined) isBotAdmin = detected.isBotAdmin;
  }

  if (!isAdmin) return reply(m, "❌ Fitur ini hanya bisa digunakan oleh admin grup.");
  if (!isBotAdmin) return reply(m, "❌ Bot harus menjadi admin grup agar bisa otomatis menutup/membuka grup.");

  const args = getArgs(m);
  const normalized = args.trim();

  if (!normalized) {
    const current = configs[groupJid];
    if (current?.enabled) {
      const status = getDesiredState(current);
      return reply(
        m,
        `⚙️ *OCGC Aktif*\n\n` +
          `🔒 Tutup: *${formatTime(current.closeTime)}*\n` +
          `🔓 Buka: *${formatTime(current.openTime)}*\n` +
          `📌 Status sekarang: *${status === "closed" ? "Tertutup" : "Terbuka"}*\n\n` +
          `Gunakan *.ocgc off* untuk menonaktifkan.`
      );
    }
    return reply(m, "⚙️ OCGC belum aktif.\n\nContoh: `.ocgc 22:00 | 07:00 on`");
  }

  if (/^off$/i.test(normalized)) {
    if (!configs[groupJid]?.enabled) {
      return reply(m, "ℹ️ OCGC memang sudah nonaktif di grup ini.");
    }

    delete configs[groupJid];
    lastAppliedState.delete(groupJid);

    if (!saveConfigs()) return reply(m, "❌ Gagal menyimpan perubahan OCGC.");
    return reply(m, `✅ *OCGC dinonaktifkan.*\n\nBot tidak akan lagi otomatis menutup atau membuka grup ini.`);
  }

  const match = normalized.match(/^(.+?)\s*\|\s*(.+?)\s+on$/i);
  if (!match) {
    return reply(
      m,
      "❌ Format salah.\n\nGunakan:\n`.ocgc 22:00 | 07:00 on`\natau\n`.ocgc off`"
    );
  }

  const closeTime = parseTime(match[1]);
  const openTime = parseTime(match[2]);
  if (closeTime === null || openTime === null) {
    return reply(m, "❌ Jam tidak valid. Gunakan format `HH:MM`, misalnya `22:00` dan `07:00`.");
  }

  if (closeTime === openTime) {
    return reply(m, "❌ Jam tutup dan jam buka tidak boleh sama.");
  }

  configs[groupJid] = {
    enabled: true,
    closeTime,
    openTime,
    timezone: TIME_ZONE,
    updatedAt: Date.now(),
  };

  if (!saveConfigs()) return reply(m, "❌ Gagal menyimpan jadwal OCGC.");

  // Reset state supaya sinkron pertama selalu dilakukan untuk konfigurasi baru.
  lastAppliedState.delete(groupJid);
  await applySetting(sock, groupJid, configs[groupJid], getDesiredState(configs[groupJid]), true);

  const status = getDesiredState(configs[groupJid]);
  return reply(
    m,
    `✅ *OCGC berhasil diaktifkan*\n\n` +
      `🔒 Grup ditutup: *${formatTime(closeTime)}*\n` +
      `🔓 Grup dibuka: *${formatTime(openTime)}*\n` +
      `🌏 Zona waktu: *Asia/Jakarta*\n` +
      `📌 Status sekarang: *${status === "closed" ? "Tertutup" : "Terbuka"}*\n\n` +
      `Jadwal akan berjalan otomatis setiap hari sampai kamu memakai *.ocgc off*.`
  );
}

loadConfigs();
startScheduler();

export const config = pluginConfig;
export const handler = handleOcgc;
export const plugins = [
  { config: pluginConfig, handler: handleOcgc, fileRole: "ocgc" },
];

export default {
  config: pluginConfig,
  handler: handleOcgc,
  plugins,
};
