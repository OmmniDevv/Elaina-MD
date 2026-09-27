/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from "../../src/lib/elaina-error.js";
import mediafire from "../../src/scraper/mediafire.js";

const pluginConfig = {
  name: "mediafiredl",
  alias: ["mfdl", "mediafire", "mf"],
  category: "download",
  description: "Download file dari MediaFire",
  usage: ".mfdl <url>",
  example: ".mfdl https://www.mediafire.com/file/xxx",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 1,
  isEnabled: true,
};

function getFileName(result) {
  const directName = result?.meta?.title?.trim();
  const urlName = decodeURIComponent(
    result?.download?.link_download?.split("/").pop()?.split("?")[0] || "",
  );
  const extension = urlName.includes(".") ? `.${urlName.split(".").pop()}` : "";
  if (directName && extension && !directName.includes("."))
    return `${directName}${extension}`;
  return directName || urlName || `mediafire_${Date.now()}${extension}`;
}

async function handler(m, { sock }) {
  const url = m.text?.trim();

  if (!url) {
    return m.reply(
      `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
        `> \`${m.prefix}mfdl <url>\`\n\n` +
        `> Contoh:\n` +
        `> \`${m.prefix}mfdl https://www.mediafire.com/file/xxx\``,
    );
  }

  if (!url.match(/mediafire\.com/i)) {
    return m.reply(`❌ *URL tidak valid. Gunakan link MediaFire.*`);
  }
  await m.react("🕕");

  try {
    const result = await mediafire(url);
    await sock.sendMessage(
      m.chat,
      {
        document: { url: result.download.link_download },
        fileName: getFileName(result),
        mimetype: result.download.mimetype,
        contextInfo: {
          forwardingScore: 99,
          isForwarded: true,
        },
      },
      { quoted: m },
    );
  } catch (err) {
    return m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
