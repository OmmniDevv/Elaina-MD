/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/**
 * .addam <role> <@tag|reply|628xxx>
 * role: member | reseller | premium | partner | owner
 */
import {
  ROLES,
  getRole,
  setRole,
  canAddRole,
  canManageTarget,
  extractTarget,
  rankOf,
  isRealOwner,
} from "../../src/lib/am-roles.js";

const ADDABLE_ROLES = ["member", "reseller", "premium", "partner", "owner"];

const pluginConfig = {
  name: "addam",
  alias: ["addamrole", "setam"],
  category: "owner",
  description: "Tambah role Alight Motion (member/reseller/premium/partner/owner)",
  usage: ".addam <role> <@tag|reply|628xxx>",
  example: ".addam partner 6283xxx",
  isOwner: false,
  isPremium: false,
  cooldown: 3,
  isEnabled: true,
};

async function handler(m, { text, prefix, command, isOwner }) {
  const pfx = prefix || ".";
  // fallback ke m.isOwner kalau context.isOwner nggak ke-pass (jaga-jaga)
  const ownerFlag = Boolean(isOwner || m.isOwner || isRealOwner(m.sender));
  const args = String(text || "").trim().split(/\s+/).filter(Boolean);
  const role = (args[0] || "").toLowerCase();

  if (!role || !ADDABLE_ROLES.includes(role)) {
    return m.reply(
      `*ADD AM ROLE*\n\n` +
        `Format:\n*${pfx}${command}* <role> <@tag|reply|nomer>\n\n` +
        `Role: member · reseller · premium · partner · owner\n\n` +
        `Contoh:\n*${pfx}${command}* partner @user\n` +
        `*${pfx}${command}* member 6283xxxx\n` +
        `(atau reply pesan target)`
    );
  }

  const actorRole = ownerFlag ? "owner" : getRole(m.sender, false);

  // Owner asli & bot bisa nambah role apapun (termasuk owner), bebas hierarki
  if (!ownerFlag && !canAddRole(actorRole, role)) {
    return m.reply(
      `❌ Role *${actorRole}* tidak bisa menambah *${role}*.\n` +
        `Hierarki: free < member < reseller < premium < partner < owner`
    );
  }

  const target = extractTarget(m, args.slice(1).join(" "));
  if (!target) {
    return m.reply(`❌ Target tidak ditemukan. Tag, reply, atau isi nomor (628…).`);
  }

  const targetRole = getRole(target, false);
  if (!ownerFlag && !canManageTarget(actorRole, targetRole) && targetRole !== "free") {
    return m.reply(
      `❌ Tidak bisa mengubah *${targetRole}* (setara/lebih tinggi dari kamu).`
    );
  }

  setRole(target, role, { by: m.sender, at: Date.now() });
  const num = target.replace(/\D/g, "");
  return m.reply(
    `✅ *AM Role di-set*\n\n` +
      `👤 ${num}\n` +
      `🎖️ Role: *${role}*\n` +
      `👮 Oleh: *${actorRole}*`
  );
}

export const config = pluginConfig;
export { handler };
export default { config: pluginConfig, handler };
