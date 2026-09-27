/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "createakun",
  alias: [],
  category: "rpg",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, command, args, prefix }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
    let user = global.db.data.users[m.sender];

    try {
        if (command === 'createakun') {
            if (args.length === 0) {
                return m.reply("Silakan masukkan nama akun YouTube Anda.\nContoh: .createakun Ponta Yete");
            }

            // Menggabungkan semua argumen menjadi satu string (nama akun YouTube)
            let youtubeAccountName = args.join(' ');

            // Set nama akun YouTube untuk pengguna
            user.youtube_account = youtubeAccountName;
            m.reply(`Akun YouTube Anda telah berhasil dibuat/diedit\nchannel: ${youtubeAccountName}`);
        } else if (/live/i.test(command) && args[0] === 'youtuber') {
            // Periksa apakah pengguna memiliki akun YouTube
            if (!user.youtube_account) {
                return m.reply("Buat akun terlebih dahulu\nKetik: .createakun");
            }

            // Kode eksisting untuk perintah 'live youtuber'
            // ...
        } else {
            return await m.reply("Perintah tidak dikenali.\n*.akunyt*\n> ᴜɴᴛᴜᴋ ᴍᴇɴɢᴇᴄᴇᴋ ᴀᴋᴜɴ ʏᴏᴜᴛᴜʙᴇ ᴀɴᴅᴀ\n*.live [judul live]*\n> ᴜɴᴛᴜᴋ ᴍᴇᴍᴜʟᴀɪ ᴀᴋᴛɪᴠɪᴛᴀs ʟɪᴠᴇ sᴛʀᴇᴀᴍɪɴɢ.");
        }
    } catch (err) {
        m.reply("Error\n\n\n" + err.stack);
    }
};

// Metadata
handler.register = true;

export { pluginConfig as config, handler };
