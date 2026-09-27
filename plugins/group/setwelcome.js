/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
const pluginConfig = {
  name: "setwelcome",
  alias: ["customwelcome"],
  category: "group",
  description: "Set custom welcome message",
  usage: ".setwelcome <pesan>",
  example: ".setwelcome Halo {user}, selamat datang di {group}!",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  isAdmin: true,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const db = getDatabase();
  const text = m.fullArgs?.trim() || m.args.join(" ");

  if (!text) {
    return m.reply(
      `📝 *sᴇᴛ ᴡᴇʟᴄᴏᴍᴇ*\n\n` +
        `╭┈┈⬡「 📋 *ᴘʟᴀᴄᴇʜᴏʟᴅᴇʀ* 」\n` +
        `┃ ◦ \`{user}\` - Nama member\n` +
        `┃ ◦ \`{number}\` - Nomor member\n` +
        `┃ ◦ \`{group}\` - Nama grup\n` +
        `┃ ◦ \`{desc}\` - Deskripsi grup\n` +
        `┃ ◦ \`{count}\` - Jumlah member\n` +
        `┃ ◦ \`{owner}\` - Nama owner grup\n` +
        `┃ ◦ \`{date}\` - Tanggal (DD/MM/YYYY)\n` +
        `┃ ◦ \`{time}\` - Waktu (HH:mm WIB)\n` +
        `┃ ◦ \`{day}\` - Hari (Senin, Selasa, dll)\n` +
        `┃ ◦ \`{bot}\` - Nama bot\n` +
        `┃ ◦ \`{prefix}\` - Prefix bot\n` +
        `╰┈┈⬡\n\n` +
        `\`Contoh:\`\n` +
        `\`${m.prefix}setwelcome Halo {user}! 👋\`\n` +
        `\`Selamat datang di {group} pada {day}, {date}\``,
    );
  }

  db.setGroup(m.chat, { welcomeMsg: text, welcome: true });
  db.save();

  m.react("✅");

  await m.reply(
    `✅ Welcome berhasil di set menjadi *${text}*\nMau reset? ketik ${m.prefix}resetwelcome`,
  );
}

export { pluginConfig as config, handler };
