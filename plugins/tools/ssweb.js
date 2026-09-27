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

const pluginConfig = {
  name: "ssweb",
  alias: ["screenshot", "ss", "webss"],
  category: "tools",
  description: "Screenshot website",
  usage: ".ssweb <url>",
  example: ".ssweb https://google.com",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 1,
  isEnabled: true,
};

async function ssweb(url, mode = "desktop") {
  const width = mode === "mobile" ? 720 : 1920;
  const apiUrl = `https://image.thum.io/get/width/${width}/crop/1080/noanimate/${url}`;
  const res = await axios.get(apiUrl, {
    responseType: "arraybuffer",
    timeout: 30000,
  });
  return Buffer.from(res.data);
}

async function handler(m, { sock }) {
  let text = m.text?.trim();

  if (!text) {
    return m.reply(
      `📸 *sᴄʀᴇᴇɴsʜᴏᴛ ᴡᴇʙ*\n\n` +
        `> Screenshot halaman website\n\n` +
        `> *Contoh:*\n` +
        `> ${m.prefix}ssweb https://google.com\n` +
        `> ${m.prefix}ss https://github.com --mobile`,
    );
  }

  let mode = "desktop";
  if (text.includes("--mobile") || text.includes("--hp")) {
    mode = "mobile";
    text = text.replace(/--mobile|--hp/g, "").trim();
  }

  if (!text.startsWith("http")) {
    text = "https://" + text;
  }

  await m.react("🕕");

  try {
    const imageBuffer = await ssweb(text, mode);

    const saluranId = config.saluran?.id || "120363412350560864@newsletter";
    const saluranName = config.saluran?.name || config.bot?.name || "Rimuru-AI";

    await sock.sendMedia(m.chat, imageBuffer, null, m, {
      type: "image",
    });

    await m.react("✅");
  } catch (error) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler, ssweb };
