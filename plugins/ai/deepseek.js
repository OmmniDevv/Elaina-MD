/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { DeepSeekThinking } from "../../src/scraper/deepseek.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "deepseek",
  alias: ["ds", "dsv4", "deepthink"],
  category: "ai",
  description: "Chat dengan DeepSeek V4 (thinking/reasoning)",
  usage: ".deepseek <pertanyaan>",
  example: ".deepseek Jelaskan black hole",
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
      `🧠 *DeepSeek V4*\n\n` +
        `AI yang bisa mikir dulu sebelum jawab — cocok buat pertanyaan yang butuh penalaran.\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}deepseek <pertanyaan>*\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}deepseek Jelaskan black hole*\n` +
        `> *${m.prefix}deepseek Buat kode sorting algorithm*\n\n` +
        `_Bot akan mikir dulu, baru jawab — jadi agak lama sedikit_`,
    );
  }

  await m.react("🕕");

  try {
    const result = await DeepSeekThinking(text);

    if (!result.success) {
      await m.react("☢");
      return m.reply(`❌ *DeepSeek Gagal*\n\n> Gagal mendapatkan respons`);
    }

    await m.react("✅");

    let reply = ``;

    if (result.reasoning) {
      const reasoningPreview =
        result.reasoning.length > 800
          ? result.reasoning.slice(0, 800) + "..."
          : result.reasoning;
      reply += `💭 *Proses Berpikir:*\n${reasoningPreview.replace(/\n/g, "\n> ")}\n\n`;
    }

    if (result.answer) {
      reply += `${result.answer}`;
    }

    if (reply.length > 4096) {
      reply = reply.slice(0, 4096) + "\n\n... (dipotong)";
    }

    await m.reply(reply);
  } catch (e) {
    console.error(e);
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
