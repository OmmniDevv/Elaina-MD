/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import config from "../../config.js";
import te from "../../src/lib/elaina-error.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";
const NEOXR_APIKEY = config.APIkey?.neoxr || "Milik-Bot-RimuruMD";

const pluginConfig = {
  name: "emojitoanimasi",
  alias: ["emoji2sticker", "emojisticker", "e2s"],
  category: "tools",
  description: "Konversi emoji ke sticker animasi",
  usage: ".emojitoanimasi <emoji>",
  example: ".emojitoanimasi 😳",
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const emoji = m.text?.trim();

  if (!emoji) {
    return m.reply(
      `🎭 *ᴇᴍᴏᴊɪ ᴛᴏ ᴀɴɪᴍᴀsɪ*\n\n` +
        `> Konversi emoji ke sticker animasi\n\n` +
        `*Contoh:*\n` +
        `> \`${m.prefix}emojitoanimasi 😳\``,
    );
  }

  m.react("🎭");

  try {
    const apiUrl = `https://api.neoxr.eu/api/emojito?q=${encodeURIComponent(emoji)}&apikey=${NEOXR_APIKEY}`;
    const { data } = await axios.get(apiUrl, { timeout: 15000 });

    if (!data?.status || !data?.data?.url) {
      m.react("❌");
      return m.reply("❌ *ɢᴀɢᴀʟ*\n\n> Emoji tidak ditemukan atau API error");
    }

    const webpUrl = data.data.url;

    const webpRes = await axios.get(webpUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
    });
    const webpBuffer = Buffer.from(webpRes.data);

    await sock.sendMessage(
      m.chat,
      {
        sticker: webpBuffer,
        contextInfo: saluranCtx(),
      },
      { quoted: m },
    );

    m.react("✅");
  } catch (error) {
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
