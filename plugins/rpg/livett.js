/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "livett",
  alias: [],
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

async function handler(m, { text }) {
    let who = m.sender;
    const user = global.db.data.users[who];

    if (!user.tiktok || !user.tiktok.username) {
        return m.reply('❌ Anda belum memiliki akun TikTok. Buat akun terlebih dahulu dengan perintah *.creatett <username>*');
    }

    const cooldown = 2 * 60 * 1000; 
    if (user.tiktok.cooldown && Date.now() - user.tiktok.cooldown < cooldown) {
        const remaining = Math.ceil((cooldown - (Date.now() - user.tiktok.cooldown)) / 1000);
        return m.reply(`⏳ Anda baru saja melakukan live. Tunggu ${remaining} detik lagi untuk live berikutnya.`);
    }

    const liveTitle = text || 'Live TikTok Seru!';
    const randomViews = Math.floor(Math.random() * 500) + 100; 
    const randomLikes = Math.floor(Math.random() * 300) + 50;  
    const randomFollowers = Math.floor(Math.random() * 50) + 10; 

    user.tiktok.views += randomViews;
    user.tiktok.likes += randomLikes;
    user.tiktok.followers += randomFollowers;
    user.tiktok.cooldown = Date.now(); 

    m.reply(`
🎥 **Live TikTok Selesai!**
📢 **Judul Live**: ${liveTitle}
👁️ **Views**: ${randomViews}
❤️ **Likes**: ${randomLikes}
⭐ **Followers Baru**: ${randomFollowers}

📌 Gunakan perintah *.akuntt* untuk melihat profil Anda. Live berikutnya bisa dilakukan dalam 2 menit.
    `.trim());

    setTimeout(() => {
        m.reply(`✅ Anda sudah bisa melakukan live TikTok lagi! Gunakan perintah *.livett <judul>* untuk memulai.`);
    }, cooldown);
};

export { pluginConfig as config, handler };
