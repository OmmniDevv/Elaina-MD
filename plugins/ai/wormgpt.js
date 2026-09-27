/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from "../../src/lib/elaina-error.js";
import config from "../../config.js";
import axios from "axios";

const pluginConfig = {
  name: "wormgpt",
  alias: ["worm"],
  category: "ai",
  description: "Chat dengan WormGPT (uncensored AI)",
  usage: ".wormgpt <pertanyaan>",
  example: ".wormgpt perkenalkan dirimu",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.args.join(" ");

  if (!text) {
    return m.reply(
      `🐛 *ᴡᴏʀᴍ ɢᴘᴛ*\n\n> Masukkan pertanyaan\n\n\`Contoh: ${m.prefix}wormgpt perkenalkan dirimu\``,
    );
  }

  m.react("🕕");

  try {
    const url = `https://api.cuki.biz.id/api/ai/wormgpt?apikey=${config.APIkey.cuki}&question=${encodeURIComponent(text)}`;
    const { data } = await axios.get(url, { timeout: 30000 });

    if (!data.status || !data.data?.response) {
      throw new Error("Gagal mendapatkan response");
    }

    m.react("✅");
    await m.reply(`${data.data.response}`);
  } catch (error) {
    console.log(error);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
