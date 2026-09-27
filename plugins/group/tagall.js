/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import {
  getParticipantJid,
  getParticipantJids,
} from "../../src/lib/elaina-lid.js";
import te from "../../src/lib/elaina-error.js";
const pluginConfig = {
  name: "tagall",
  alias: ["all", "everyone"],
  category: "group",
  description: "Tag semua member grup",
  usage: ".tagall <pesan>",
  example: ".tagall Halo semua!",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 30,
  energi: 0,
  isEnabled: true,
  isAdmin: true,
  isBotAdmin: false,
};

async function handler(m, { sock }) {
  const text = m.text || "Tag All Members";

  try {
    const groupMeta = m.groupMetadata;
    const participants = groupMeta.participants || [];

    if (participants.length === 0) {
      await m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Tidak ada member di grup ini.`);
      return;
    }

    const targetParticipants = participants.filter((participant) => {
      return getParticipantJid(participant) !== m.sender;
    });

    if (targetParticipants.length === 0) {
      await m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Tidak ada member lain yang bisa di-tag.`);
      return;
    }

    const mentions = getParticipantJids(targetParticipants);
    const memberList = targetParticipants
      .map((participant) => `@${getParticipantJid(participant).split("@")[0]}`)
      .join("\n")
      .trim();

    await m.reply(
      `*Pesan:* ${text}\n\n` +
        `\`\`\`━━━ ${targetParticipants.length} MEMBER TOTAL ━━━\`\`\`\n` +
        memberList,
      { mentions: mentions },
    );
  } catch (error) {
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
