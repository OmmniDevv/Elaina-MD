/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import { generateWAMessageFromContent } from '@rexxhayanasi/elaina-baileys';
import config from "../../config.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";

const pluginConfig = {
  name: "tam",
  alias: ["topactive", "topmember"],
  category: "group",
  description: "Lihat top member paling aktif di grup",
  usage: ".tam <jumlah>",
  example: ".tam 10",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  isAdmin: false,
  cooldown: 10,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const limit = Math.min(Math.max(parseInt(m.text) || 10, 1), 20);
  const group = db.getGroup(m.chat) || {};
  const chatName = group.name || "Grup";
  const chatStats = group.chatStats || {};

  const sorted = Object.entries(chatStats)
    .map(([jid, d]) => ({ jid, count: d.count || 0, name: d.name || null }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  if (!sorted.length) {
    return m.reply(
      `📊 *ᴛᴏᴘ ᴀᴄᴛɪᴠᴇ ᴍᴇᴍʙᴇʀ*\n\n` + `- Belum ada data aktivitas di grup ini`,
    );
  }

  const pollVotes = sorted.map((u, i) => {
    const rank = i + 1;
    const user = db.getUser(u.jid);
    const name = u.name || user?.name || u.jid.split("@")[0];
    return {
      optionName: `${rank}. ${name}${i === 0 ? " 🏆" : ""}`,
      optionVoteCount: u.count,
    };
  });

  const content = {
    pollResultSnapshotMessage: {
      name: `top ${limit} member active all time!\nat ${chatName}`,
      pollVotes,
      pollType: 0,
      contextInfo: {
        ...saluranCtx(),
      },
    },
  };

  const msg = generateWAMessageFromContent(m.chat, content, {});
  await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}

export { pluginConfig as config, handler };
