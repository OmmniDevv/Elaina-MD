/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from "../../config.js";
import { generateWAMessageFromContent } from '@rexxhayanasi/elaina-baileys';

const pluginConfig = {
  name: "test",
  alias: ["poll"],
  category: "test",
  description: "Test Poll Menu Interaktif",
  usage: ".poll",
  example: ".poll",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  try {
    await m.reply("test")
    const msg = generateWAMessageFromContent(m.chat, {
      pollCreationMessageV6: {
        name: "🔥 PILIH MENU INTERAKTIF 🔥",
        options: [
          { optionName: "Anime" },
          { optionName: "Game" },
          { optionName: "Profile" }
        ],
        selectableOptionsCount: 1
      }
    }, { quoted: m });

    await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  } catch (error) {
    console.error("[TestPoll] Gagal:", error);
    m.reply("Gagal membuat poll menu.");
  }
}

export { pluginConfig as config, handler };
