/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from "fs";
import path from "path";
import { getDatabase } from "../../src/lib/elaina-database.js";
import { getOwnerName } from "../../config.js";
import te from "../../src/lib/elaina-error.js";
const pluginConfig = {
  name: "ganti-namaowner",
  alias: ["setnamaowner", "setnameowner", "setownername"],
  category: "owner",
  description: "Ganti nama owner (utama atau tambahan)",
  usage: ".ganti-namaowner <nomor> <nama baru>",
  example: ".ganti-namaowner 628xxx Fauzan",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock, config }) {
  const db = getDatabase();
  const input = m.args;

  if (!input[0]) {
    const nameMap = db.setting("ownerNames") || {};
    const mainOwnerNum = config.owner?.number?.[0] || "";
    const mainName = config.owner?.name || "Owner";
    let list = `👤 *ᴏᴡɴᴇʀ ɴᴀᴍᴇ ʟɪsᴛ*\n\n`;
    list += `👑 Main: *${mainName}* (${mainOwnerNum})\n`;
    const entries = Object.entries(nameMap);
    if (entries.length > 0) {
      entries.forEach(([num, name]) => {
        list += `👤 ${num}: *${name}*\n`;
      });
    } else {
      list += `\n> Belum ada nama custom untuk owner tambahan`;
    }
    list += `\n\n*Penggunaan:*\n`;
    list += `\`${m.prefix}ganti-namaowner <nomor> <nama>\`\n`;
    list += `\`${m.prefix}ganti-namaowner main <nama>\` — ganti nama owner utama`;
    return m.reply(list);
  }

  if (input[0].toLowerCase() === "main") {
    const newName = input.slice(1).join(" ").trim();
    if (!newName) {
      return m.reply(
        `👤 *ɢᴀɴᴛɪ ɴᴀᴍᴀ ᴏᴡɴᴇʀ ᴜᴛᴀᴍᴀ*\n\n> Nama saat ini: *${config.owner?.name || "-"}*\n\n\`${m.prefix}ganti-namaowner main <nama baru>\``,
      );
    }
    try {
      const configPath = path.join(process.cwd(), "config.js");
      let configContent = fs.readFileSync(configPath, "utf8");
      configContent = configContent.replace(
        /owner:\s*\{[\s\S]*?name:\s*['"]([^'"]*)['"]/,
        (match, oldName) =>
          match
            .replace(`'${oldName}'`, `'${newName}'`)
            .replace(`"${oldName}"`, `'${newName}'`),
      );
      fs.writeFileSync(configPath, configContent);
      config.owner.name = newName;
      return m.reply(
        `✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Nama owner utama diganti ke: *${newName}*`,
      );
    } catch (error) {
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
  }

  const targetNumber = input[0].replace(/[^0-9]/g, "");
  const newName = input.slice(1).join(" ").trim();

  if (!targetNumber || targetNumber.length < 10) {
    return m.reply(
      `❌ *ɢᴀɢᴀʟ*\n\n> Nomor tidak valid\n\n\`${m.prefix}ganti-namaowner 628xxx NamaOwner\``,
    );
  }

  if (!newName) {
    const currentName = getOwnerName(targetNumber);
    return m.reply(
      `👤 *ɴᴀᴍᴀ ᴏᴡɴᴇʀ*\n\n> ${targetNumber}: *${currentName}*\n\n\`${m.prefix}ganti-namaowner ${targetNumber} <nama baru>\``,
    );
  }

  const nameMap = db.setting("ownerNames") || {};
  nameMap[targetNumber] = newName;
  db.setting("ownerNames", nameMap);

  return m.reply(
    `✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Nama owner *${targetNumber}* diganti ke: *${newName}*`,
  );
}

export { pluginConfig as config, handler };
