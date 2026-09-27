/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


function getRandomDate() {
  const now = new Date()
  const future = new Date(now.getFullYear() + 70, 0, 1)
  const deathTime = new Date(now.getTime() + Math.random() * (future.getTime() - now.getTime()))
  return deathTime.toDateString()
}

const pluginConfig = {
  name: "kematian",
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

  const sebab = [
    'keracunan cilok expired 😵',
    'ditabrak mobil odading 😩',
    'terpeleset di kamar mandi pas nyanyi dangdut 🚿🎤',
    'kecanduan scrolling TikTok 48 jam nonstop 📱💀',
    'ngambek sama bot sendiri terus putus asa 😭',
    'kelamaan jomblo sampe badan menghilang 🫥',
    'makan mie pakai kopi dan susu 🤢',
    'diculik alien terus dikira bahan eksperimen 👽🔬',
    'dipukul karma karena suka nyolong meme 🙃',
    'ketawa ngakak sampai lupa napas 😂'
  ]

  let tanggal = getRandomDate()
  let penyebab = sebab[Math.floor(Math.random() * sebab.length)]

  m.reply(`💀 *Ramalan Kematian*\n\n📛 Nama: *${nama}*\n🗓️ Tanggal: *${tanggal}*\n⚰️ Penyebab: *${penyebab}*`)
}

export { pluginConfig as config, handler };
