/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { UnlimitedAI } from "../../src/scraper/unlimitedai.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "prabowo-ai",
  alias: ["prabowoi", "prabowo", "pakprabowo"],
  category: "ai",
  description: "Chat dengan Pak Prabowo — Pria Sawit",
  usage: ".prabowo-ai <pertanyaan>",
  example: ".prabowo-ai Saudara, kita harus berdaulat!",
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
      `🇮🇩 *Pak Prabowo*\n\n` +
        `> Pria Sawit — Presiden RI\n> Tegas, patriotik, dan karismatik\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}prabowo-ai <pertanyaan>*\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}prabowo-ai Saudara, kita harus berdaulat!*`
    );
  }

  await m.react("🕕");

  try {
    const result = await UnlimitedAI(text, "prabowo-ai");

    if (!result.status) {
      await m.react("☢");
      return m.reply(`❌ *Prabowo AI Error*\n\n> ${result.error || "Gagal mendapatkan respons"}`);
    }

    await m.react("✅");
    const reply = result.answer;
    await m.reply(reply.length > 4096 ? reply.slice(0, 4096) + "..." : reply);
  } catch (e) {
    console.error(e);
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
