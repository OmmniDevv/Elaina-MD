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
  name: "carigrup",
  alias: ["searchgrup", "findgrup", "grupwa"],
  category: "search",
  description: "Cari grup WhatsApp berdasarkan keyword",
  usage: ".carigrup <keyword>",
  example: ".carigrup gb isian",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.args.join(" ");

  if (!text) {
    return m.reply(
      `🔍 *ᴄᴀʀɪ ɢʀᴜᴘ ᴡᴀ*\n\n> Masukkan keyword pencarian\n\n\`Contoh: ${m.prefix}carigrup gb isian\``,
    );
  }

  m.react("🕕");

  try {
    const url = `https://api.cuki.biz.id/api/search/whatsapp-group?apikey=${config.APIkey.cuki}&query=${encodeURIComponent(text)}`;
    const { data } = await axios.get(url, { timeout: 30000 });

    if (!data.status || !data.data?.groups?.length) {
      m.react("❌");
      return m.reply(`❌ Tidak ditemukan grup untuk keyword *${text}*`);
    }

    const groups = data.data.groups;
    let result =
      `🔍 *ᴄᴀʀɪ ɢʀᴜᴘ ᴡᴀ*\n\n` +
      `📌 Keyword: *${data.data.query}*\n` +
      `📊 Total: *${data.data.total}* grup ditemukan\n`;

    groups.forEach((g, i) => {
      result +=
        `\n━━━━━━━━━━━━━━━\n` +
        `*${i + 1}. ${g.title}*\n` +
        `📅 ${g.date}\n` +
        `🏷️ ${g.category}\n` +
        `📝 ${g.description ? g.description.slice(0, 150) + (g.description.length > 150 ? "..." : "") : "-"}\n` +
        `🔗 ${g.group_link}`;
    });

    m.react("✅");
    await m.reply(result);
  } catch (error) {
    console.log(error);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
