/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { UnlimitedAI } from '../../src/scraper/unlimitedai.js';
import te from '../../src/lib/elaina-error.js';

const pluginConfig = {
  name: "luffyai",
  alias: ["luffy", "monkeydluffy", "mugiwara"],
  category: "ai",
  description: "Chat dengan Monkey D. Luffy — Calon Raja Bajak Laut dari Topi Jerami! 🏴‍☠️",
  usage: ".luffyai <pertanyaan>",
  example: ".luffyai Halo Luffy!",
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
      `🏴‍☠️ *ᴍᴏɴᴋᴇʏ ᴅ. ʟᴜꜰꜰʏ* 🏴‍☠️\n\n` +
      `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
      `┃ 👒 *Monkey D. Luffy*\n` +
      `┃\n` +
      `┃ > Kapten Bajak Laut Topi Jerami\n` +
      `┃ > Manusia Karet pemakan buah Gomu Gomu\n` +
      `┃ > Suka bilang "Shishishi!" kalau tertawa\n` +
      `┃ > Suka banget makan daging! 🍖\n` +
      `┃ > Impian: jadi Raja Bajak Laut 👑\n` +
      `┃\n` +
      `┃ ✦ *Cara Pakai*\n` +
      `┃\n` +
      `┃   ${m.prefix}luffyai <pertanyaan>\n` +
      `┃\n` +
      `┃ ✦ *Contoh*\n` +
      `┃\n` +
      `┃   ${m.prefix}luffyai Halo Luffy!\n` +
      `┃   ${m.prefix}luffyai Mau makan daging?\n` +
      `┃\n` +
      `┃ 💗 *Rimuru:* Mau ngobrol sama Luffy darling~?\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━⬣`
    );
  }

  await m.react("🍖");

  try {
    const result = await UnlimitedAI(text, "luffy-ai");

    if (!result.status) {
      await m.react("💔");
      return m.reply(
        `💔 *ʟᴜꜰꜰʏ ᴀɪ ᴇʀʀᴏʀ*\n\n` +
        `> ${result.error || "Gagal mendapatkan respons darling~"}\n\n` +
        `> Coba lagi ya 🥺`
      );
    }

    await m.react("✅");
    const reply = result.answer;
    await m.reply(reply.length > 4096 ? reply.slice(0, 4096) + "..." : reply);
  } catch (e) {
    console.error(e);
    await m.react("💔");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}
export { pluginConfig as config, handler };