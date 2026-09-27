/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { Qwen3 } from "../../src/scraper/qwen3.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "qwen3",
  alias: ["qwen", "qw3"],
  category: "ai",
  description: "Chat dengan Qwen3 80B via OverChat",
  usage: ".qwen3 <pertanyaan>",
  example: ".qwen3 Apa itu machine learning?",
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
      `🔵 *Qwen3 80B*\n\n` +
        `Tanya apa aja ke AI Qwen3 — model besar dari Alibaba yang jago bahasa apa aja.\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}qwen3 <pertanyaan>*\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}qwen3 Apa itu machine learning?*\n` +
        `> *${m.prefix}qwen3 Buat resep masakan Indonesia*\n\n` +
        `_Model 80B, jadi agak lama tapi jawabannya mantap_`
    );
  }

  await m.react("🕕");

  try {
    const result = await Qwen3(text);

    if (!result.status) {
      await m.react("☢");
      return m.reply(
        `❌ *Qwen3 Gagal*\n\n> ${result.error || "Gagal mendapatkan respons"}`
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
