/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import { sendRpgPreview } from "../../src/lib/elaina-context.js";
const pluginConfig = {
  name: "stamina",
  alias: ["energy", "cekstamina"],
  category: "rpg",
  description: "Cek dan pulihkan stamina",
  usage: ".stamina / .stamina isi",
  example: ".stamina",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

function createStaminaBar(current, max) {
  const filled = Math.round((current / max) * 10);
  const empty = 10 - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);
  const args = m.args || [];

  if (!user.rpg) user.rpg = {};
  user.rpg.stamina = user.rpg.stamina ?? 100;
  user.rpg.maxStamina = user.rpg.maxStamina || 100;

  const subCmd = args[0]?.toLowerCase();

  if (subCmd === "isi" || subCmd === "restore" || subCmd === "heal") {
    const potionCost = 5000;

    if (user.rpg.stamina >= user.rpg.maxStamina) {
      return m.reply(`⚡ *sᴛᴀᴍɪɴᴀ ᴘᴇɴᴜʜ*\n\n> Stamina kamu sudah penuh!`);
    }

    if ((user.koin || 0) < potionCost) {
      return m.reply(`❌ *sᴀʟᴅᴏ ᴛɪᴅᴀᴋ ᴄᴜᴋᴜᴘ*\n\n` + `> Biaya: Rp ${potionCost.toLocaleString("id-ID")}\n` + `> Saldo: Rp ${(user.koin || 0).toLocaleString("id-ID")}`);
    }

    user.koin -= potionCost;
    const restored = user.rpg.maxStamina - user.rpg.stamina;
    user.rpg.stamina = user.rpg.maxStamina;

    db.save();

    await m.react("⚡");
    return sendRpgPreview(
      sock,
      m.chat,
      `⚡ *sᴛᴀᴍɪɴᴀ ᴅɪɪsɪ*\n\n` +
        `*💊 *ʀᴇsᴛᴏʀᴇ:*
\n` +
        `> ⚡ Stamina: *+${restored}*\n` +
        `> 💵 Biaya: *-Rp ${potionCost.toLocaleString("id-ID")}*\n` +
        `> 📊 Sekarang: *${user.rpg.stamina}/${user.rpg.maxStamina}*\n` +
        ``,
      "⚡ STAMINA",
      "Restore",
      { quoted: m },
    );
  }

  const staminaBar = createStaminaBar(user.rpg.stamina, user.rpg.maxStamina);

  let txt = `⚡ *sᴛᴀᴍɪɴᴀ sᴛᴀᴛᴜs*\n\n`;
  txt += `*📊 *ɪɴꜰᴏ:*
\n`;
  txt += `> ⚡ Stamina: *${user.rpg.stamina}/${user.rpg.maxStamina}*\n`;
  txt += `> 📊 [${staminaBar}]\n`;
  txt += `\n\n`;
  txt += `> Isi stamina: \`${m.prefix}stamina isi\` (Rp 5.000)\n`;
  txt += `> Stamina pulih otomatis setiap jam`;

  await sendRpgPreview(sock, m.chat, txt, "⚡ STAMINA", "Status", {
    quoted: m,
  });
}

export { pluginConfig as config, handler };
