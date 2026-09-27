/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "seberapagila",
  alias: [],
  category: "fun",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { text }) {
  const nama = text || m.pushName || 'Kamu'
  const persen = Math.floor(Math.random() * 101)

  const komentar = [
    'Normal... kayak batu bata.',
    'Agak nyeleneh, tapi masih bisa diajak diskusi.',
    'Udah mulai ngaco, tolong dijaga.',
    'Wah ini sih gila bener, cocok masuk rumah tertawa.',
    'Level dewa... gila tapi keren.',
    'Gila banget, sampe bot aja pusing baca chat kamu.',
    'Kayaknya udah enggak bisa diselamatkan 😭',
    'Kamu waras, tapi cuma kalau tidur.',
    'Gila dalam diam... serem banget kamu.',
    'Gila bergaya profesional. Respect.'
  ]

  const kata = komentar[Math.floor(Math.random() * komentar.length)]

  m.reply(`🧠 *Tes Kegilaan Hari Ini*\n\n👤 Nama: *${nama}*\n📊 Tingkat Gila: *${persen}%*\n🗯️ Komentar: *${kata}*`)
}

export { pluginConfig as config, handler };
