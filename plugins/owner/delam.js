/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/**
 * .delam <@tag|reply|628xxx>  → role jadi free
 */
import {
  getRole,
  setRole,
  canManageTarget,
  extractTarget,
  isRealOwner,
} from "../../src/lib/am-roles.js";

const pluginConfig = {
  name: "delam",
  alias: ["delamrole", "unam", "removeam"],
  category: "owner",
  description: "Hapus role AM (jadi free)",
  usage: ".delam <@tag|reply|628xxx>",
  example: ".delam 6283xxx",
  isOwner: false,
  isPremium: false,
  cooldown: 3,
  isEnabled: true,
};

async function handler(m, { text, prefix, command, isOwner }) {
  const pfx = prefix || ".";
  const target = extractTarget(m, text || "");
  if (!target) {
    return m.reply(
      `*DEL AM ROLE*\n\nFormat: *${pfx}${command}* <@tag|reply|nomer>\nTarget akan jadi *free*.`
    );
  }

  // fallback ke m.isOwner kalau context.isOwner nggak ke-pass (jaga-jaga)
  const ownerFlag = Boolean(isOwner || m.isOwner || isRealOwner(m.sender));
  const actorRole = ownerFlag ? "owner" : getRole(m.sender, false);
  const targetRole = getRole(target, false);

  if (targetRole === "free") {
    return m.reply(`ℹ️ Target sudah *free*.`);
  }

  if (!ownerFlag && actorRole === "free") {
    return m.reply(`❌ Kamu tidak punya izin.`);
  }

  // reseller+ can only remove lower ranks; owner asli/bot bisa hapus role apapun
  if (!ownerFlag) {
    if (!canManageTarget(actorRole, targetRole)) {
      return m.reply(
        `❌ Role *${actorRole}* tidak bisa menghapus *${targetRole}*.`
      );
    }
    // reseller only removes member, etc. — canManageTarget already rank-based
  }

  setRole(target, "free", { by: m.sender });
  return m.reply(
    `✅ Role AM dihapus\n👤 ${target.replace(/\D/g, "")}\n🎖️ Sekarang: *free*`
  );
}

export const config = pluginConfig;
export { handler };
export default { config: pluginConfig, handler };
