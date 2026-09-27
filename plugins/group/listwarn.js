/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import * as timeHelper from '../../src/lib/elaina-time.js'
const pluginConfig = {
  name: "listwarn",
  alias: ["warnings", "cekwarn", "warnlist"],
  category: "group",
  description: "Melihat daftar warning member",
  usage: ".listwarn atau .listwarn @user",
  example: ".listwarn @user",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  isAdmin: true,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  let groupData = db.getGroup(m.chat) || {};
  let warnings = groupData.warnings || {};
  const maxWarns = groupData.maxWarnings || 3;

  let targetUser = null;
  if (m.quoted) {
    targetUser = m.quoted.sender;
  } else if (m.mentionedJid && m.mentionedJid.length > 0) {
    targetUser = m.mentionedJid[0];
  }
  if (targetUser) {
    const userWarnings = warnings[targetUser] || [];
    const targetName = targetUser.split("@")[0];

    if (userWarnings.length === 0) {
      await m.reply(`✅ @${targetName} tidak memiliki warning.`, {
        mentions: [targetUser],
      });
      return;
    }

    let txt = `⚠️ *ᴡᴀʀɴɪɴɢ @${targetName}*\n\n`;
    txt += `> Total: *${userWarnings.length}/${maxWarns}*\n\n`;

    userWarnings.forEach((w, i) => {
      const date = timeHelper.fromTimestamp(w.time, "DD/MM/YYYY");
      txt += `*${i + 1}.* ${w.reason}\n`;
      txt += `   └ _${date}_\n`;
    });

    await m.reply(txt, { mentions: [targetUser] });
  } else {
    // Show all users with warnings
    const usersWithWarnings = Object.keys(warnings).filter(
      (u) => warnings[u].length > 0,
    );

    if (usersWithWarnings.length === 0) {
      await m.reply(`✅ Tidak ada member dengan warning di grup ini.`);
      return;
    }

    let txt = `⚠️ *ᴅᴀꜰᴛᴀʀ ᴡᴀʀɴɪɴɢ*\n\n`;

    usersWithWarnings.forEach((user, i) => {
      const count = warnings[user].length;
      const name = user.split("@")[0];
      txt += `*${i + 1}.* @${name} - *${count}/${maxWarns}* warning\n`;
    });

    txt += `\n> Ketik \`${m.prefix}listwarn @user\` untuk detail`;

    await m.reply(txt, { mentions: usersWithWarnings });
  }
}

export { pluginConfig as config, handler }