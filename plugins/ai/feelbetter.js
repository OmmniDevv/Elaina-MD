/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { FeelBetter } from "../../src/scraper/feeb.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "feelbetter",
  alias: ["fb", "feelbetterbot", "healing"],
  category: "ai",
  description: "Chat dengan FeelBetterBot — AI yang siap mendengarkan tanpa menghakimi",
  usage: ".feelbetter <curhat/pertanyaan>",
  example: ".feelbetter lagi sedih nih",
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
      `💚 *FeelBetterBot*\n\n` +
        `AI yang siap mendengarkan curhatan kamu — tanpa menghakimi, dengan hangat dan empatik.\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}feelbetter <curhatan>*\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}feelbetter lagi sedih nih*\n` +
        `> *${m.prefix}feelbetter aku capek banget belakangan*\n\n` +
        `_Bot ini bukan pengganti profesional, tapi bisa jadi tempat curhat yang aman_`
    );
  }

  await m.react("🕕");

  try {
    const result = await FeelBetter(text);

    if (!result.status) {
      await m.react("☢");
      return m.reply(
        `❌ *FeelBetter Gagal*\n\n> ${result.error || "Gagal mendapatkan respons"}`
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
