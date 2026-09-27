/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "bansos",
  alias: ["korupsi"],
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

async function handler(m, { sock, command }) {
    const conn = sock;
    let user = global.db.data.users[m.sender]
    let randomaku = Math.floor(Math.random() * 101)
    let randomkamu = Math.floor(Math.random() * 101)
    let __timers = (new Date - user.lastbansos)
    let _timers = (3600000 - __timers)
    let timers = clockString(_timers)
    if (user.money < 3000000) return m.reply(`Kamu harus mempunyai *${toRupiah(3000000)} Money* ${global.rpg.emoticon("money")} untuk menggunakan fitur ini!`)
    if (new Date - user.lastbansos > 3600000) {
        if (randomaku > randomkamu) {
            conn.sendFile(m.chat, 'https://telegra.ph/file/afcf9a7f4e713591080b5.jpg', 'korupsi.jpg', `Kamu Tertangkap Setelah Kamu korupsi dana bansos🕴️💰,  Dan Kamu harus membayar denda *${toRupiah(3000000)} Money* ${global.rpg.emoticon("money")}`, m)
            user.money -= 3000000
            user.lastbansos = new Date * 1
        } else if (randomaku < randomkamu) {
            user.money += 3000000
            conn.sendFile(m.chat, 'https://telegra.ph/file/d31fcc46b09ce7bf236a7.jpg', 'korupsi.jpg', `Kamu berhasil  korupsi dana bansos🕴️💰,  Dan Kamu mendapatkan *${toRupiah(3000000)} Money* ${global.rpg.emoticon("money")}`, m)
            user.lastbansos = new Date * 1
        } else {
            m.reply(`Sorry Gan Lu g Berhasil Korupsi bansos Dan Tidak masuk penjara karna Kamu *melarikan diri🏃*`)
            user.lastbansos = new Date * 1
        }
    } else m.reply(`Silahkan Menunggu ${timers} Untuk ${command} Lagi`)
}

handler.register = true
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.substr(1)
}

const toRupiah = number => parseInt(number).toLocaleString().replace(/,/gi, ".")

export { pluginConfig as config, handler };
