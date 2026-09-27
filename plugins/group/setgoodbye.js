/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
const pluginConfig = {
  name: "setgoodbye",
  alias: ["customgoodbye"],
  category: "group",
  description: "Set custom goodbye message",
  usage: ".setgoodbye <pesan>",
  example: ".setgoodbye Bye {user}, sampai jumpa lagi!",
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
  const text = m.text || m.args.join(" ");

  if (!text) {
    return m.reply(
      `📝 *sᴇᴛ ɢᴏᴏᴅʙʏᴇ*\n\n` +
        `╭┈┈⬡「 📋 *ᴘʟᴀᴄᴇʜᴏʟᴅᴇʀ* 」\n` +
        `┃ ◦ \`{user}\` - Nama member\n` +
        `┃ ◦ \`{number}\` - Nomor member\n` +
        `┃ ◦ \`{group}\` - Nama grup\n` +
        `┃ ◦ \`{desc}\` - Deskripsi grup\n` +
        `┃ ◦ \`{count}\` - Sisa member\n` +
        `┃ ◦ \`{owner}\` - Nama owner grup\n` +
        `┃ ◦ \`{date}\` - Tanggal (DD/MM/YYYY)\n` +
        `┃ ◦ \`{time}\` - Waktu (HH:mm WIB)\n` +
        `┃ ◦ \`{day}\` - Hari (Senin, Selasa, dll)\n` +
        `┃ ◦ \`{bot}\` - Nama bot\n` +
        `┃ ◦ \`{prefix}\` - Prefix bot\n` +
        `╰┈┈⬡\n\n` +
        `\`Contoh:\`\n` +
        `\`${m.prefix}setgoodbye Bye {user}! 👋\`\n` +
        `\`Sampai jumpa lagi pada {day}, {date}\``,
    );
  }

  db.setGroup(m.chat, { goodbyeMsg: text, goodbye: true, leave: true });
  db.save();

  m.react("✅");

  await m.reply(
    `✅ Goodbye berhasil di set menjadi *${text}*\nMau reset? ketik ${m.prefix}resetgoodbye`,
  );
}

export { pluginConfig as config, handler };
