/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from "../../src/lib/elaina-error.js";
import rimuruApi from "../../src/lib/elaina-apimanager.js";
import config from "../../config.js";
const pluginConfig = {
  name: "gpt4o",
  alias: ["gpt4"],
  category: "ai",
  description: "Chat dengan GPT-4o",
  usage: ".gpt4o <pertanyaan>",
  example: ".gpt4o Hai apa kabar?",
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
      `🧠 *ɢᴘᴛ-4ᴏ*\n\n> Masukkan pertanyaan\n\n\`Contoh: ${m.prefix}gpt4o Hai apa kabar?\``,
    );
  }

  m.react("🕕");

  try {
    const data = `https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(text)}`
    const res = await fetch(data)
    const json = await res.json()
    if (!json.status || !json.result) throw new Error("Gagal mendapatkan response")
    m.react("✅");
    await m.reply(`${json.result}`);
  } catch (error) {
    console.log(error);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
