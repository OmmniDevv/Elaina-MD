/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
  name: "akuntiktok",
  alias: ["akuntiktokprofile", "akuntt"],
  category: "rpg",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m) => {
    let who = m.sender;
    const user = global.db.data.users[who];

    if (!user.tiktok || !user.tiktok.username) {
        return m.reply('❌ Anda belum memiliki akun TikTok! Gunakan perintah *.creatett <username>* untuk membuat akun.');
    }

    const { username, followers = 0, likes = 0, views = 0 } = user.tiktok;

    m.reply(`
📱 **Profil TikTok Anda** 📱

🔹 **Username**: ${username}
⭐ **Followers**: ${followers}
❤️ **Likes**: ${likes}
👁️ **Views**: ${views}

Gunakan perintah *.livett <judul>* untuk memulai siaran langsung.
    `.trim());
};

export { pluginConfig as config, handler };
