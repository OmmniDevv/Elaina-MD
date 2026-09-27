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
import rimuruApi from "../../src/lib/elaina-apimanager.js";
const pluginConfig = {
  name: "bingimage",
  alias: ["imagesearch", "carigambar", "bingimg"],
  category: "search",
  description: "Cari artwork di Pixiv",
  usage: ".carigambar <query>",
  example: ".carigambar rem",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  try {
    const query = m.text;

    if (!query) {
      return m.reply(
        `❌ *Masukkan kata kunci pencarian!*\n\n> Contoh: ${m.prefix}carigambar rem`,
      );
    }

    await m.react("🔍");

    const apikey = config.APIkey?.neoxr || "Milik-Bot-RimuruMD";
    const data = await rimuruApi.apiFaa.get(
      "/faa/google-image",
      {
        query,
        apikey,
      },
      { timeout: 30000 },
    );

    if (!data.status) {
      await m.react("❌");
      return m.reply(`❌ *Tidak ditemukan hasil untuk:* ${query}`);
    }
    const results = data.result;
    const album = await Promise.all(
      results.map(async (url) => {
        const res = await axios.get(url, { responseType: "arraybuffer" });
        return {
          image: Buffer.from(res.data),
        };
      }),
    );
    await sock.sendMessage(
      m.chat,
      {
        albumMessage: album,
      },
      { quoted: m },
    );
  } catch (error) {
    console.log(error);
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
