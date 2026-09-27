/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/**
 * Alight Motion role hierarchy
 * free < member < reseller < premium < partner < owner
 */
import fs from "fs";
import path from "path";
import config, { isOwner as isConfigOwner } from "../../config.js";

export const ROLES = ["free", "member", "reseller", "premium", "partner", "owner"];
export const RANK = {
  free: 0,
  member: 1,
  reseller: 2,
  premium: 3,
  partner: 4,
  owner: 99,
};

/** Siapa boleh add role apa — owner & bot (isOwner true) bisa nambah semua role */
export const CAN_ADD = {
  owner: ["member", "reseller", "premium", "partner", "owner"],
  partner: ["member", "reseller", "premium"],
  premium: ["member", "reseller"],
  reseller: ["member"],
  member: [],
  free: [],
};

const DB_DIR = path.join(process.cwd(), "database");
const FILES = {
  member: path.join(DB_DIR, "am-member.json"),
  reseller: path.join(DB_DIR, "am-reseller.json"),
  premium: path.join(DB_DIR, "am-premium.json"),
  partner: path.join(DB_DIR, "am-partner.json"),
  owner: path.join(DB_DIR, "am-owner.json"),
  usage: path.join(DB_DIR, "am-usage.json"),
};

/** Cek owner asli langsung dari config.js (config.owner.number + nomor bot) */
export function isRealOwner(jid) {
  try {
    return Boolean(isConfigOwner(String(jid || "").replace(/\D/g, "")));
  } catch {
    return false;
  }
}

function ensure() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  for (const f of Object.values(FILES)) {
    if (!fs.existsSync(f)) {
      fs.writeFileSync(f, JSON.stringify({}, null, 2));
    }
  }
}

function read(file) {
  ensure();
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8") || "{}") || {};
  } catch {
    return {};
  }
}

function write(file, data) {
  ensure();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export function normalizeJid(input) {
  if (!input) return null;
  let s = String(input).trim();
  // @tag already jid
  if (s.includes("@")) {
    s = s.split(":")[0].replace(/[^0-9@.\-a-z]/gi, "");
    if (!s.includes("@")) s = s + "@s.whatsapp.net";
    // lid form keep as is if @lid
    return s;
  }
  // digits only phone
  let num = s.replace(/\D/g, "");
  if (num.startsWith("0")) num = "62" + num.slice(1);
  if (!num) return null;
  return num + "@s.whatsapp.net";
}

export function extractTarget(m, text = "") {
  // 1) mention
  const mentions =
    m.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
    m.mentionedJid ||
    m.mentions ||
    [];
  if (Array.isArray(mentions) && mentions[0]) {
    return normalizeJid(mentions[0]);
  }
  // 2) reply
  const q =
    m.quoted?.sender ||
    m.quoted?.participant ||
    m.message?.extendedTextMessage?.contextInfo?.participant;
  if (q) return normalizeJid(q);
  // 3) number / jid in text
  const raw = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  // skip role token if first
  for (const part of raw) {
    if (ROLES.includes(part.toLowerCase())) continue;
    const j = normalizeJid(part);
    if (j) return j;
  }
  return null;
}

function listHas(file, jid) {
  const db = read(file);
  const id = normalizeJid(jid);
  if (!id) return false;
  const num = id.replace(/\D/g, "");
  return Boolean(db[id] || db[num] || Object.keys(db).some((k) => k.replace(/\D/g, "") === num));
}

function listAdd(file, jid, meta = {}) {
  const db = read(file);
  const id = normalizeJid(jid);
  if (!id) return false;
  db[id] = {
    since: Date.now(),
    by: meta.by || null,
    ...meta,
  };
  write(file, db);
  return true;
}

function listDel(file, jid) {
  const db = read(file);
  const id = normalizeJid(jid);
  if (!id) return false;
  const num = id.replace(/\D/g, "");
  let removed = false;
  for (const k of Object.keys(db)) {
    if (k === id || k.replace(/\D/g, "") === num) {
      delete db[k];
      removed = true;
    }
  }
  if (removed) write(file, db);
  return removed;
}

/** Hapus dari semua role list */
export function clearAllRoles(jid) {
  for (const role of ["member", "reseller", "premium", "partner", "owner"]) {
    listDel(FILES[role], jid);
  }
}

export function setRole(jid, role, meta = {}) {
  role = String(role || "").toLowerCase();
  if (role === "free") {
    clearAllRoles(jid);
    return true;
  }
  if (!ROLES.includes(role) || role === "free") return false;
  clearAllRoles(jid);
  return listAdd(FILES[role], jid, meta);
}

export function getRole(jid, isOwner = false) {
  // owner asli (config.owner.number / nomor bot) selalu menang
  if (isOwner || isRealOwner(jid)) return "owner";
  if (listHas(FILES.owner, jid)) return "owner";
  if (listHas(FILES.partner, jid)) return "partner";
  if (listHas(FILES.premium, jid)) return "premium";
  if (listHas(FILES.reseller, jid)) return "reseller";
  if (listHas(FILES.member, jid)) return "member";
  return "free";
}

export function rankOf(role) {
  return RANK[role] ?? 0;
}

export function canAddRole(actorRole, targetRole) {
  const allowed = CAN_ADD[actorRole] || [];
  return allowed.includes(String(targetRole || "").toLowerCase());
}

export function canManageTarget(actorRole, targetCurrentRole) {
  // harus lebih tinggi dari target
  return rankOf(actorRole) > rankOf(targetCurrentRole);
}

/** daily success quota for free */
export function getUsage(jid) {
  const db = read(FILES.usage);
  const id = normalizeJid(jid);
  const num = id?.replace(/\D/g, "") || "";
  return db[id] || db[num] || null;
}

export function canUseAm(jid, isOwner = false) {
  const role = getRole(jid, isOwner);
  if (role === "owner" || role === "partner" || role === "premium" || role === "reseller" || role === "member") {
    return { ok: true, role, remain: Infinity };
  }
  // free: 1 sukses / hari
  const usage = getUsage(jid);
  const today = new Date().toISOString().slice(0, 10);
  if (!usage || usage.date !== today) {
    return { ok: true, role: "free", remain: 1 };
  }
  if ((usage.success || 0) < 1) {
    return { ok: true, role: "free", remain: 1 - (usage.success || 0) };
  }
  return { ok: false, role: "free", remain: 0, message: "Limit free 1x/hari sudah dipakai. Upgrade member/reseller/premium/partner." };
}

/** hanya dipanggil jika SUKSES premiumin */
export function markSuccess(jid) {
  const id = normalizeJid(jid);
  if (!id) return;
  const db = read(FILES.usage);
  const today = new Date().toISOString().slice(0, 10);
  const num = id.replace(/\D/g, "");
  const prev = db[id] || db[num];
  if (!prev || prev.date !== today) {
    db[id] = { date: today, success: 1 };
  } else {
    db[id] = { date: today, success: (prev.success || 0) + 1 };
  }
  // cleanup alt key
  if (db[num] && num !== id) delete db[num];
  write(FILES.usage, db);
}

export function listRole(role) {
  role = String(role || "").toLowerCase();
  if (!FILES[role]) return {};
  return read(FILES[role]);
}

export { FILES };
export default {
  ROLES,
  RANK,
  getRole,
  setRole,
  clearAllRoles,
  canAddRole,
  canManageTarget,
  canUseAm,
  markSuccess,
  extractTarget,
  normalizeJid,
  listRole,
};
