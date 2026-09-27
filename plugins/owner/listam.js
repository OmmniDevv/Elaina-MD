/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { listRole, ROLES, isRealOwner } from "../../src/lib/am-roles.js";

const pluginConfig = {
  name: "listam",
  alias: ["amlist", "listroleam"],
  category: "owner",
  description: "List user role Alight Motion",
  usage: ".listam [role]",
  example: ".listam partner",
  isOwner: false,
  isPremium: false,
  cooldown: 5,
  isEnabled: true,
};

async function handler(m, { text, isOwner }) {
  const { getRole } = await import("../../src/lib/am-roles.js");
  const ownerFlag = Boolean(isOwner || m.isOwner || isRealOwner(m.sender));
  const actor = ownerFlag ? "owner" : getRole(m.sender, false);
  if (actor === "free" || actor === "member") {
    return m.reply("❌ Hanya reseller+ / owner.");
  }

  const want = String(text || "").trim().toLowerCase();
  const roles = want && ROLES.includes(want) && want !== "free" ? [want] : ["member", "reseller", "premium", "partner", "owner"];

  let out = `*📋 LIST AM ROLE*\n\n`;
  for (const r of roles) {
    const db = listRole(r);
    const keys = Object.keys(db);
    out += `*${r.toUpperCase()}* (${keys.length})\n`;
    if (!keys.length) out += `└ (kosong)\n\n`;
    else {
      keys.slice(0, 50).forEach((k, i) => {
        out += `${i + 1}. ${k.replace(/\D/g, "")}\n`;
      });
      if (keys.length > 50) out += `... +${keys.length - 50} lagi\n`;
      out += `\n`;
    }
  }
  return m.reply(out.trim());
}

export const config = pluginConfig;
export { handler };
export default { config: pluginConfig, handler };
