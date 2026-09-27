/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { aiodl } from "../../src/scraper/aio.js";
import te from "../../src/lib/elaina-error.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";

const pluginConfig = {
  name: "aio",
  alias: ["allinone", "download", "dl"],
  category: "downloader",
  description:
    "All in one downloader (IG, TikTok, FB, Twitter, YouTube, Pinterest, CapCut, dll)",
  usage: ".aio <url>",
  example: ".aio https://instagram.com/p/xxx",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const url = m.text?.trim();

  if (!url) {
    return m.reply(
      `📥 *ᴀʟʟ ɪɴ ᴏɴᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*\n\n` +
        `> Download dari berbagai platform!\n\n` +
        `╭┈┈⬡「 🌐 *ᴘʟᴀᴛꜰᴏʀᴍ* 」\n` +
        `┃ • Instagram\n` +
        `┃ • TikTok\n` +
        `┃ • Facebook\n` +
        `┃ • Twitter/X\n` +
        `┃ • YouTube\n` +
        `┃ • Pinterest\n` +
        `┃ • CapCut\n` +
        `┃ • Threads / Reddit\n` +
        `╰┈┈┈┈┈┈┈┈⬡\n\n` +
        `> *Contoh:* ${m.prefix}aio https://instagram.com/p/xxx`,
    );
  }

  if (!url.startsWith("http")) {
    return m.reply(`❌ URL tidak valid! Harus dimulai dengan http/https`);
  }

  await m.react("🕕");

  try {
    const result = await aiodl(url);

    if (!result?.media?.length) {
      await m.react("❌");
      return m.reply(`❌ Gagal mengambil media. Pastikan URL valid.`);
    }

    const ctxInfo = saluranCtx();

    for (const item of result.media) {
      if (item.type === "video") {
        await sock.sendMedia(m.chat, item.url, result.title || null, m, {
          type: "video",
          contextInfo: ctxInfo,
        });
      } else if (item.type === "audio") {
        await sock.sendMessage(
          m.chat,
          {
            audio: { url: item.url },
            mimetype: "audio/mpeg",
            contextInfo: ctxInfo,
          },
          { quoted: m },
        );
      } else {
        await sock.sendMedia(m.chat, item.url, result.title || null, m, {
          type: "image",
          contextInfo: ctxInfo,
        });
      }
      break;
    }

    await m.react("✅");
  } catch (error) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
