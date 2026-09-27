/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from "../../src/lib/elaina-error.js";
import { tiktokSearchVideo } from "../../src/scraper/tiktoksearch.js";

const pluginConfig = {
  name: "ptvsearch",
  alias: ["ptvs"],
  category: "search",
  description: "Cari video TikTok",
  usage: ".ptvsearch <query>",
  example: ".ptvsearch jj epep",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const query = m.args.join(" ")?.trim();

  if (!query) {
    return m.reply(
      `╭┈┈⬡「 🎵 *ᴛɪᴋᴛᴏᴋ sᴇᴀʀᴄʜ* 」
┃
┃ ㊗ ᴜsᴀɢᴇ: \`${m.prefix}ptvsearch <query>\`
┃
╰┈┈⬡

> \`Contoh: ${m.prefix}ptvsearch anime\``,
    );
  }

  m.react("🔍");

  try {
    const videos = await tiktokSearchVideo(query);

    if (!videos || videos.length === 0) {
      m.react("❌");
      return m.reply(`❌ Tidak ditemukan video untuk: ${query}`);
    }

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];

    await sock.sendMessage(m.chat, {
      video: { url: randomVideo.link },
      mimetype: "video/mp4",
      ptv: true,
    });

    m.react("✅");
  } catch (error) {
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler, tiktokSearchVideo };
