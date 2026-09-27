/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
  name: "listmember",
  alias: ["memberlist", "daftarmember", "listanggota"],
  category: "group",
  description: "Menampilkan daftar anggota grup",
  usage: ".listmember",
  example: ".listmember",
  isOwner: false, isPremium: false, isGroup: true, isPrivate: false,
  cooldown: 5, energi: 0, isEnabled: true,
};

async function handler(m, { sock }) {
  if (!m.isGroup) return m.reply("❌ Perintah ini hanya bisa digunakan di grup.");
  const meta = await sock.groupMetadata(m.chat);
  const participants = meta.participants || [];
  if (!participants.length) return m.reply("❌ Data anggota grup tidak tersedia.");

  const lines = participants.map((p, i) => {
    const jid = p.id || p.jid || "";
    const role = p.admin === "superadmin" ? "👑 Owner" : p.admin === "admin" ? "⭐ Admin" : "👤 Member";
    return `${i + 1}. ${role} @${jid.split("@")[0]}`;
  });
  const mentions = participants.map(p => p.id || p.jid).filter(Boolean);
  return m.reply(`👥 *DAFTAR MEMBER*\n\nGrup: *${meta.subject || "-"}*\nTotal: *${participants.length}*\n\n${lines.join("\n")}`, { mentions });
}

export { pluginConfig as config, handler };
