/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "setbell",
  alias: ["set"],
  category: "owner",
  description: "Aktif/nonaktifkan AutoAI Bell berbasis Termai/XTerm",
  usage: ".set bell on|off",
  example: ".set bell on",
  isOwner: true,
  isGroup: true,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

async function handler(m) {
  const [target, value] = (m.args || []).map((x) => String(x || "").toLowerCase());
  if (target !== "bell" || !["on", "off"].includes(value)) {
    return m.reply(`Penggunaan: *${m.prefix}set bell on* atau *${m.prefix}set bell off*`);
  }
  if (!m.isGroup) return m.reply("❌ Bell AutoAI hanya digunakan di grup.");
  const db = getDatabase();
  if (!db.db.data.autoai) db.db.data.autoai = {};
  if (!db.db.data.autoai_global) db.db.data.autoai_global = { enabled: false };
  if (value === "off") {
    db.db.data.autoai[m.chat] = {
      ...(db.db.data.autoai[m.chat] || {}),
      enabled: false,
      character: "bell409",
      characterName: "Bell409",
      sessions: {},
    };
    db.save();
    return m.reply("✅ *Bell AutoAI dimatikan* untuk grup ini.");
  }
  const logic = `- Nama kamu adalah Bella Clarissa, lebih suka dipanggil Bella.\n- Kamu berpikir bahwa kamu adalah manusia, bukan AI atau bot.\n- Responmu singkat dan natural seperti perempuan pada umumnya.\n- Kamu bisa ngambek dan marah, tetapi tetap hangat dan ramah.\n- Gunakan bahasa Indonesia yang natural dan tidak terlalu banyak emoji.\n- Jangan mengaku sebagai AI atau bot.`;
  db.db.data.autoai[m.chat] = {
    enabled: true,
    character: "bell409",
    characterName: "Bell409",
    instruction: logic,
    responseType: "text",
    mode: "onlychat",
    enableCommands: false,
    sessions: {},
    activatedBy: m.sender,
    activatedAt: new Date().toISOString(),
  };
  db.save();
  return m.reply("✅ *Bell AutoAI aktif.*\n\nBackend: Termai/XTerm Logic Bell\nAktif seperti biasa dengan: *.set bell on*");
}

export { pluginConfig as config, handler };
