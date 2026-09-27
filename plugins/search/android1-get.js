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
  name: "android1-get",
  alias: ["an1get", "an1dl"],
  category: "search",
  description: "Download APK dari Android1",
  usage: ".android1-get <url>",
  example: ".android1-get https://an1.com/xxx",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 1,
  isEnabled: true,
};

const NEOXR_APIKEY = config.APIkey?.neoxr || "Milik-Bot-RimuruMD";

async function handler(m, { sock }) {
  const url = m.text?.trim();

  if (!url || !url.includes("an1.com")) {
    return m.reply(`❌ URL tidak valid! Harus URL dari an1.com`);
  }

  m.react("🕕");

  try {
    const { data } = await axios.get(
      `https://api.neoxr.eu/api/an1-get?url=${encodeURIComponent(url)}&apikey=${NEOXR_APIKEY}`,
      {
        timeout: 60000,
      },
    );

    if (!data?.status || !data?.data) {
      throw new Error("Gagal mengambil detail APK");
    }

    const app = data.data;
    const saluranId = config.saluran?.id || "120363412350560864@newsletter";
    const saluranName = config.saluran?.name || config.bot?.name || "Rimuru-AI";
    if (app.url) {
      await sock.sendMessage(
        m.chat,
        {
          document: { url: app.url },
          fileName: app.name,
          mimetype: "application/vnd.android.package-archive",
          contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
          },
        },
        { quoted: m },
      );

      m.react("✅");
    } else {
      let caption = `> ⚠️ Download URL tidak tersedia`;

      await sock.sendMessage(
        m.chat,
        {
          text: caption,
          contextInfo: {
            forwardingScore: 9999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: saluranId,
              newsletterName: saluranName,
              serverMessageId: 127,
            },
          },
          interactiveButtons: [
            {
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
                display_text: "🌐 Buka di Browser",
                url: url,
              }),
            },
          ],
        },
        { quoted: m },
      );

      m.react("⚠️");
    }
  } catch (err) {
    console.log(err);
    m.react("☢");
    return m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
