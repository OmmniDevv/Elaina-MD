/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const rewards = {
    exp: 50000,
    money: 49999,
    potion: 10,
    mythic: 3,
    legendary: 1
}

const cooldown = 2592000000 // 30 hari

const pluginConfig = {
  name: "monthly",
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

async function handler(m, { prefix }) {
    const usedPrefix = prefix || m.prefix || ".";
    let user = global.db.data.users[m.sender] = global.db.data.users[m.sender] || {
        money: 0,
        exp: 0,
        potion: 0,
        mythic: 0,
        legendary: 0,
        lastmonthly: 0
    }

    if (new Date - user.lastmonthly < cooldown) {
        let remaining = clockString((user.lastmonthly + cooldown) - new Date())
        return m.reply(`ʏᴏᴜ'ᴠᴇ ᴀʟʀᴇᴀᴅʏ ᴄʟᴀɪᴍᴇᴅ *ᴍᴏɴᴛʜʟʏ ʀᴇᴡᴀʀᴅs*, ᴩʟᴇᴀsᴇ ᴡᴀɪᴛ ᴛɪʟʟ ᴄᴏᴏʟᴅᴏᴡɴ ғɪɴɪsʜ.\n\n⏱️ ${remaining}`)
    }

    let text = ''
    for (let reward of Object.keys(rewards)) {
        user[reward] = (user[reward] || 0) + rewards[reward]
        text += `➠ ${global.rpg.emoticon(reward)} ${reward}: ${rewards[reward]}\n`
    }

    m.reply(`🔖 ᴍᴏɴᴛʜʟʏ ʀᴇᴡᴀʀᴅ ʀᴇᴄᴇɪᴠᴇᴅ:\n${text}`.trim())
    user.lastmonthly = new Date * 1
}

handler.register = true
handler.cooldown = cooldown

function clockString(ms) {
    let d = Math.floor(ms / 86400000)
    let h = Math.floor(ms / 3600000) % 24
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return `${d} hari ${h} jam ${m} menit ${s} detik`
}

export { pluginConfig as config, handler };
