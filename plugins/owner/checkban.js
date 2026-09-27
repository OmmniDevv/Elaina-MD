/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from "../../config.js";
import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "checkban",
  alias: [],
  category: "owner",
  description: "Check actual ban state",
  usage: ".checkban",
  isOwner: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const target = "628979985621@s.whatsapp.net";

  // Test logic from config.js directly
  const cleanNumber = target
    .split(":")[0]
    .split("@")[0]
    .replace(/[^0-9]/g, "");
  let bannedList = config.bannedUsers || [];
  const savedBanned = db.setting("bannedUsers") || [];

  const combined = [...new Set([...bannedList, ...savedBanned])];

  const isBannedDirect = combined.some((banned) => {
    const cleanBanned = banned
      .split(":")[0]
      .split("@")[0]
      .replace(/[^0-9]/g, "");
    return (
      cleanNumber === cleanBanned ||
      cleanNumber.endsWith(cleanBanned) ||
      cleanBanned.endsWith(cleanNumber)
    );
  });

  // Evaluate fully:
  const finalResult = config.isBanned(target);

  let dbStatus = db.setting("bannedUsers");

  await m.reply(`DEBUG BAN (${target})
cleanNumber: ${cleanNumber}
bannedList (config): ${JSON.stringify(bannedList)}
savedBanned (db): ${JSON.stringify(savedBanned)}
isBannedDirect: ${isBannedDirect}
config.isBanned(): ${finalResult}
isOwner(): ${config.isOwner(target)}`);
}

export { pluginConfig as config, handler };
