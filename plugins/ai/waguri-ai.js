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
  name: "waguri-ai",
  alias: ["waguriai", "waguri"],
  category: "ai",
  description: "Chat dengan Waguri-san — Gadis pemalu yang lupa kacamata",
  usage: ".waguri-ai <pertanyaan>",
  example: ".waguri-ai Waguri-san, halo!",
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
      `👓 *Waguri-san*\n\n` +
        `> Gadis pemalu dari "The Girl I Like Forgot Her Glasses"\n> Manis, perhatian, dan sering salah tingkah~\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}waguri-ai <pertanyaan>*\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}waguri-ai Waguri-san, halo!*`
    );
  }

  await m.react("🕕");

  try {
    const result = await UnlimitedAI(text, "waguri-ai");

    if (!result.status) {
      await m.react("☢");
      return m.reply(`❌ *Waguri AI Error*\n\n> ${result.error || "Gagal mendapatkan respons"}`);
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
