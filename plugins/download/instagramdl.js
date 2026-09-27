/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import instagramDownloader from "../../src/scraper/ig.js";
const pluginConfig = {
  name: "instagramdl",
  alias: ["igdl", "ig", "instagram"],
  category: "download",
  description: "Download video/foto Instagram",
  usage: ".instagramdl <url>",
  example: ".instagramdl https://www.instagram.com/reel/xxx",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

const IG_REGEX = /instagram\.com\/(p|reel|reels|stories|tv)\//i;

async function handler(m, { sock }) {
  const url = m.text?.trim();

  if (!url) {
    return m.reply(
      `📸 *ɪɴsᴛᴀɢʀᴀᴍ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*\n\n` +
        `> \`${m.prefix}igdl <url>\`\n\n` +
        `*ᴄᴏɴᴛᴏʜ:*\n` +
        `> \`${m.prefix}igdl https://www.instagram.com/reel/xxx\`\n` +
        `> \`${m.prefix}igdl https://www.instagram.com/p/xxx\``,
    );
  }

  if (!IG_REGEX.test(url)) {
    return m.reply(
      `❌ URL tidak valid. Gunakan link Instagram (reel/post/story).`,
    );
  }

  await m.react("🕕");

  try {
    const result = await instagramDownloader(url);

    if (!result?.media?.length) {
      await m.react("❌");
      return m.reply(`❌ Gagal mengambil media. Coba link lain.`);
    }

    const isStory = url.includes("/stories/");
    let caption = `📸 *Instagram ${isStory ? "Story" : "Downloader"}*\n\n`;
    if (result.username && result.username !== "-") {
      caption += `👤 *Author*: @${result.username}\n`;
    }
    if (result.caption) {
      caption += `📝 *Caption*:\n${result.caption}\n`;
    }
    caption = caption.trim();

    for (const item of result.media) {
      if (item.type === "video" || item.type === "mp4") {
        await sock.sendMessage(
          m.chat,
          { video: { url: item.url }, caption },
          { quoted: m },
        );
      } else {
        await sock.sendMessage(
          m.chat,
          { image: { url: item.url }, caption },
          { quoted: m },
        );
      }
      caption = "";
    }

    await m.react("✅");
  } catch (err) {
    await m.react("❌");
    return m.reply(`❌ *ɢᴀɢᴀʟ ᴍᴇɴɢᴜɴᴅᴜʜ*\n\n> ${err.message}`);
  }
}

export { pluginConfig as config, handler };
