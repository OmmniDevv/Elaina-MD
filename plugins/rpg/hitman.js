/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "bunuh",
  alias: ["hitman"],
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

async function handler(m, { sock }) {
    const conn = sock;
    let user = global.db.data.users[m.sender]

    if (!user.lastmisi) user.lastmisi = 0
    if (!user.bunuh) user.bunuh = 0
    if (!user.warn) user.warn = 0
    if (!user.exp) user.exp = 0
    if (!user.money) user.money = 0

    const cooldown = 3600000
    const now = Date.now()
    const sisa = cooldown - (now - user.lastmisi)

    conn.misi = conn.misi || {}

    if (m.sender in conn.misi)
        return m.reply('Masih ada misi yang belum selesai.')

    if (sisa > 0)
        return m.reply(`Tunggu ${clockString(sisa)} lagi.`)

    conn.misi[m.sender] = true
    m.reply('🔍 Mencari target...')

    setTimeout(() => {
        let uang = Math.floor(Math.random() * 10) * 100000
        let exp = Math.floor(Math.random() * 10) * 1000

        user.money += uang
        user.exp += exp
        user.bunuh += 1
        user.warn += 1
        user.lastmisi = Date.now()

        delete conn.misi[m.sender]

        m.reply(`Berhasil!\nUang: Rp${toRupiah(uang)}\nExp: ${toRupiah(exp)}`)
    }, 27000)
}

handler.register = true

function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

const toRupiah = n => parseInt(n).toLocaleString().replace(/,/g, ".")

export { pluginConfig as config, handler };
