/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "membunuh",
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

async function handler(m, { sock, text, prefix, command }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
    let dapat = (Math.floor(Math.random() * 100000))
    let healtu = (Math.floor(Math.random() * 100))
    let nomors = m.sender
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) return m.reply('Tag salah satu lah')

    // Inisialisasi user DB kalau belum ada
    global.db.data.users[m.sender] = global.db.data.users[m.sender] || {
        money: 0,
        health: 100,
        lastkerja: 0,
        lastsda: 0,
        exp: 0
    }
    global.db.data.users[who] = global.db.data.users[who] || {
        money: 0,
        health: 100,
        lastkerja: 0,
        lastsda: 0,
        exp: 0
    }

    if (typeof global.db.data.users[who] == 'undefined') return m.reply('Pengguna tidak ada didalam data base')

    let __timers = (new Date - global.db.data.users[m.sender].lastsda)
    let _timers = (3600000 - __timers)
    let timers = clockString(_timers)
    let users = global.db.data.users

    if (new Date - users[m.sender].lastsda > 3600000) {
        if (10 > users[who].health) return m.reply('ᴛᴀʀɢᴇᴛ ꜱᴜᴅᴀʜ ᴛɪᴅᴀᴋ ᴍᴇᴍɪʟɪᴋɪ ʜᴇᴀʟᴛʜ💉')
        if (100 > users[who].money) return m.reply('💠ᴛᴀʀɢᴇᴛ ᴛɪᴅᴀᴋ ᴍᴇᴍɪʟɪᴋɪ ᴀᴘᴀᴘᴜɴ :(💠')
        users[who].health -= healtu * 1
        users[who].money -= dapat * 1
        users[m.sender].money += dapat * 1
        users[m.sender].lastsda = new Date * 1
        conn.reply(m.chat, `ᴛᴀʀɢᴇᴛ ʙᴇʀʜᴀꜱɪʟ ᴅɪ ʙᴜɴᴜʜ ᴅᴀɴ ᴋᴀᴍᴜ ᴍᴇɴɢᴀᴍʙɪʟ ᴍᴏɴᴇʏ ᴛᴀʀɢᴇᴛ ꜱᴇʙᴇꜱᴀʀ\n💰${dapat} ᴍᴏɴᴇʏ\nᴅᴀʀᴀʜ ᴛᴀʀɢᴇᴛ ʙᴇʀᴋᴜʀᴀɴɢ -${healtu} ʜᴇᴀʟᴛʜ❤`, m)
    } else conn.reply(m.chat, `Anda Sudah Membunuh Dan Berhasil Sembunyi, tunggu ${timers} untuk membunuh lagi`, m)
}
handler.register = true
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

export { pluginConfig as config, handler };
