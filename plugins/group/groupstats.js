/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
  name: "groupstats",
  alias: ["statsgrup", "statsgroup"],
  category: "group",
  description: "Menampilkan statistik dasar grup saat ini",
  usage: ".groupstats",
  example: ".groupstats",
  isOwner: false, isPremium: false, isGroup: true, isPrivate: false,
  cooldown: 5, energi: 0, isEnabled: true,
};

async function handler(m, { sock }) {
  if (!m.isGroup) return m.reply("❌ Perintah ini hanya bisa digunakan di grup.");
  const meta = await sock.groupMetadata(m.chat);
  const participants = meta.participants || [];
  const admins = participants.filter(p => p.admin === "admin" || p.admin === "superadmin");
  const owner = participants.find(p => p.admin === "superadmin");
  const members = participants.length - admins.length;

  return m.reply(
    `📊 *STATISTIK GRUP*\n\n` +
    `👥 Total anggota: *${participants.length}*\n` +
    `⭐ Admin: *${admins.length}*\n` +
    `👤 Member: *${members}*\n` +
    `👑 Owner grup: *${owner ? "@" + (owner.id || owner.jid).split("@")[0] : "-"}*\n` +
    `🔗 ID: \`${m.chat}\``,
    { mentions: owner ? [owner.id || owner.jid] : [] }
  );
}

export { pluginConfig as config, handler };
