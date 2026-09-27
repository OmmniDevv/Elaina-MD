/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { load } from 'cheerio'
import config from "../../config.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "murrotal",
  alias: ["murottal", "audioquran", "quraudio"],
  category: "islamic",
  description: "Dengarkan audio murottal Al-Quran berdasarkan surah",
  usage: ".murrotal <nama surah>",
  example: ".murrotal al fatihah",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const query = m.args?.join(" ")?.trim();

  if (!query) {
    return m.reply(
      `🎧 *MURROTTAL*\n\n` +
        `> Masukkan nama surah\n\n` +
        `\`Contoh: ${m.prefix}murrotal al fatihah\`\n` +
        `\`Contoh: ${m.prefix}murrotal ar rahman\``,
    );
  }

  m.react("🔍");

  try {

    const res = await fetch("https://islamipedia.id/murottal/");
    const html = await res.text();
    const $ = load(html);

    const data = $(".surah-item")
      .map((i, el) => ({
        no: parseInt($(el).find("h5").text().split(".")[0]),
        surah: ($(el).attr("data-title") || "").toLowerCase(),
        arti: $(el).find("p").text().trim(),
        audio: $(el).attr("data-audio") || "",
      }))
      .get();

    const q = query.toLowerCase();
    const find = data.find((v) =>
      v.surah.replace(/[^a-z0-9]/g, "").includes(q.replace(/[^a-z0-9]/g, "")),
    );

    if (!find || !find.audio) {
      m.react("❌");
      return m.reply(`❌ Surah *${query}* tidak ditemukan`);
    }

    m.react("✅");

    await sock.sendMedia(m.chat, find.audio, null, m, {
      type: "audio",
    });
  } catch (e) {
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
