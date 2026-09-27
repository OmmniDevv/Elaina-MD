/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "merampok",
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

async function handler(m, { sock }) {
    const conn = sock;
    let who = m.mentionedJid?.[0]

    if (!m.isGroup) return m.reply('Command ini hanya untuk grup.')
    if (!who) return m.reply('Tag target yang ingin dirampok.')
    if (who === m.sender) return m.reply('Tidak bisa merampok diri sendiri.')

    let users = global.db.data.users
    let user = users[m.sender]
    let target = users[who]

    if (!target) return m.reply('Target tidak ditemukan di database.')

    let cooldown = 3600000
    let timers = cooldown - (Date.now() - user.lastrampok)

    if (Date.now() - user.lastrampok < cooldown) {
        return m.reply(
            `🦹 Kamu masih bersembunyi.\n\nTunggu ${clockString(timers)} lagi.`
        )
    }

    if (target.money < 10000) {
        return m.reply(
            '💸 Target terlalu miskin untuk dirampok.'
        )
    }

    let dapat = Math.floor(Math.random() * 50000) + 1000

    if (dapat > target.money) {
        dapat = target.money
    }

    target.money -= dapat
    user.money += dapat
    user.lastrampok = Date.now()

    conn.reply(
        m.chat,
        `
🦹 *BERHASIL MERAMPOK*

👤 Target : @${who.split('@')[0]}
💰 Hasil : ${dapat.toLocaleString('id-ID')} Money

🏃 Cepat kabur sebelum ketahuan!
        `.trim(),
        m,
        { mentions: [who] }
    )
}

handler.register = true

function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60

    return [h, m, s]
        .map(v => v.toString().padStart(2, '0'))
        .join(':')
}

export { pluginConfig as config, handler };
