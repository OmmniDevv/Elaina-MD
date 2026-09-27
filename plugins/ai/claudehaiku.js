/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { ClaudeHaiku } from "../../src/scraper/claudehaiku.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "claudehaiku",
  alias: ["claude", "haiku", "chiku"],
  category: "ai",
  description: "Chat dengan Claude Haiku 4.5 via OverChat",
  usage: ".claudehaiku <pertanyaan>",
  example: ".claudehaiku Jelaskan teori relativitas",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.args.join(" ");
  if (!text) {
    return m.reply(
      `🤍 *Claude Haiku 4.5*\n\n` +
        `Tanya apa aja ke AI Claude Haiku — cepat dan ringan, cocok buat pertanyaan sehari-hari.\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}claudehaiku <pertanyaan>*\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}claudehaiku Jelaskan teori relativitas*\n` +
        `> *${m.prefix}claudehaiku Tips biar produktif*\n\n` +
        `_Respons cepat, tapi tetap cerdas_`
    );
  }

  await m.react("🕕");

  try {
    const result = await ClaudeHaiku(text);

    if (!result.status) {
      await m.react("☢");
      return m.reply(
        `❌ *Claude Haiku Gagal*\n\n> ${result.error || "Gagal mendapatkan respons"}`
      );
    }

    await m.react("✅");

    const reply = `${result.answer}`;
    await m.reply(reply.length > 4096 ? reply.slice(0, 4096) + "..." : reply, {
      contextInfo: saluranCtx(),
    });
  } catch (e) {
    console.error(e);
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
