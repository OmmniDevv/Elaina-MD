/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createMoviePoster, GENRES } from '../../src/lib/elaina/moviePoster.js';
import te from "../../src/lib/elaina-error.js";
const pluginConfig = {
  name: "movieposter",
  alias: ["posterfilm", "movieposterelaina"],
  category: "canvas",
  description: "Buat poster film bergaya sinematik dari nama, genre, dan judul",
  usage: ".movieposter nama|genre|judul|tagline",
  example: ".movieposter Anita Putri Azzahra|scifi|Rimuru: The Movie|The last slime standing",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  try {
    const raw = String(m.text || "").trim();
    if (!raw) {
      return m.reply(`🎬 *MOVIE POSTER*\n\nFormat: \`.movieposter nama|genre|judul|tagline\`\n\nGenre: ${Object.keys(GENRES).join(", ")}\n\nContoh: \`.movieposter Anita Putri Azzahra|scifi|Rimuru: The Movie|The last slime standing\``);
    }

    await m.react("🎬");
    const parts = raw.split("|").map((s) => s.trim());
    const name = parts[0] || m.pushName || String(m.sender || "").split("@")[0];
    const genre = (parts[1] || "action").toLowerCase();
    const title = parts[2] || null;
    const tagline = parts[3] || null;

    let photo = null;
    try { photo = await sock.profilePictureUrl(m.sender, "image"); } catch {}
    if (m.quoted?.mimetype?.startsWith("image/")) {
      try { photo = await m.quoted.download(); } catch {}
    } else if (m.mimetype?.startsWith("image/")) {
      try { photo = await m.download(); } catch {}
    }

    const result = await createMoviePoster({
      name, genre, title, tagline, photo,
      year: new Date().getFullYear(),
      director: `A ${name.toUpperCase()} FILM`,
    });

    await sock.sendMessage(m.chat, {
      image: result,
      caption: `🎬 *Movie Poster*\n> ${title || name}\n> Genre: ${genre.toUpperCase()}`
    }, { quoted: m });
    await m.react("✅");
  } catch (error) {
    console.error("[MoviePoster]", error);
    await m.react("❌");
    await m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
