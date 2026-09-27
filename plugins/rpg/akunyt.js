/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "akunyt",
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
    const tag = '@' + m.sender.split`@`[0]
    let playButton = global.db.data.users[m.sender].playButton;
    const formattedSubscribers = new Intl.NumberFormat().format(user.subscribers)
    const formattedViewers = new Intl.NumberFormat().format(user.viewers)
    const formattedLike = new Intl.NumberFormat().format(user.like)

    try {
        if (command === 'akunyt') {
            if (!user.youtube_account) {
                return conn.reply(m.chat, `Hey Kamu Iya Kamu ${tag} Buat akun terlebih dahulu\nKetik: .createakun`, m);
            } else {
                return conn.reply(m.chat, `📈 Akun YouTube Anda 📉\n
🧑🏻‍💻 *Streamer:* ${user.registered ? tag : conn.getName(m.sender)}
🌐 *Channel:*   ${user.youtube_account}
👥 *Subscribers:*   ${formattedSubscribers}
🪬 *Viewers:*   ${formattedViewers}
👍🏻 *Like:*   ${formattedLike}

⬜ *Silver PlayButton:*   ${playButton < 1 ? '❎' : '' || playButton >= 1 ? '✅' : ''}
🟧 *Gold PlayButton:*   ${playButton < 2 ? '❎' : '' || playButton >= 2 ? '✅' : ''}
💎 *Diamond PlayButton:*   ${playButton < 3 ? '❎' : '' || playButton >= 3 ? '✅' : ''}`, m)
            }
        } else if (/live/i.test(command) && args[0] === 'youtuber') {
            // Check if user has a YouTube account
            if (!user.youtube_account) {
                return conn.reply(m.chat, `Hey Kamu Iya Kamu ${tag} Buat akun terlebih dahulu\nKetik: .createakun`, m);
            }

            // Existing code for the 'live youtuber' command
            // ...
        } else {
            return await m.reply("Perintah tidak dikenali.\n*.akunyt*\n> ᴜɴᴛᴜᴋ ᴍᴇɴɢᴇᴄᴇᴋ ᴀᴋᴜɴ ʏᴏᴜᴛᴜʙᴇ ᴀɴᴅᴀ\n*.live [judul live]*\n> ᴜɴᴛᴜᴋ ᴍᴇᴍᴜʟᴀɪ ᴀᴋᴛɪᴠɪᴛᴀs ʟɪᴠᴇ sᴛʀᴇᴀᴍɪɴɢ.");
        }
    } catch (err) {
        m.reply("Error\n\n\n" + err.stack);
    }
};

handler.register = true;

export { pluginConfig as config, handler };
