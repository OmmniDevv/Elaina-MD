/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createTarotCard, getTarotCard } from '../../src/lib/elaina/tarotCard.js';
import te from "../../src/lib/elaina-error.js";
const pluginConfig = {
  name: "tarot",
  alias: ["karturama", "tarotcard"],
  category: "fun",
  description: "Generate kartu tarot harian lengkap dengan visual card",
  usage: ".tarot [nomor/nama] [terbalik|upright]",
  example: ".tarot 10 terbalik",
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
    await m.react("🔮");
    const parts = String(m.text || "").split("|").map((s) => s.trim());
    const cardArg = parts[0] || "";
    const reversed = parts[1]?.toLowerCase() === "terbalik" ? true : parts[1]?.toLowerCase() === "upright" ? false : null;

    let cardIndex = null;
    if (cardArg) {
      const n = Number(cardArg);
      if (Number.isInteger(n) && n >= 0 && n <= 21) cardIndex = n;
    }

    let avatar = null;
    try { avatar = await sock.profilePictureUrl(m.sender, "image"); } catch {}
    if (m.quoted?.mimetype?.startsWith("image/")) {
      try { avatar = await m.quoted.download(); } catch {}
    }

    const username = m.pushName || String(m.sender || "").split("@")[0] || "Rimuru User";
    const card = getTarotCard(username);
    const result = await createTarotCard({ username, avatar, cardIndex, reversed });

    await sock.sendMessage(m.chat, {
      image: result,
      caption: `🃏 *${card.name}*${reversed ? " _(Terbalik)_" : ""}\n\n✨ ${card.keywords.join(" · ")}\n\n_Ramalan tarot harianmu sudah terungkap._`,
    }, { quoted: m });
    await m.react("✅");
  } catch (error) {
    console.error("[Tarot]", error);
    await m.react("❌");
    await m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
