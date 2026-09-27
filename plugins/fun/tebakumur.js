/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "tebakumur",
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
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, text }) {
    const conn = sock;
    if (!text) return conn.reply(m.chat, 'Masukan Namamu', m)
    let age = umur.getRandom()
    m.reply(`Nama Kamu: ${text}\nUmur ${age}`)
}
const umur = [
'12 Tahun, Masih Bocil',
'11 Tahun, Bocilll',
'10 Tahun, Aduh Masih Gaboleh Main Hp Dek',
'16 Tahun, Remaja Lah Ya',
'19 Tahun, Remajaa',
'20 Tahun, Udah Nikah?',
'21 Tahun, Udah Ketemu Calon Nih?',
'14 Tahun',
'15 Tahun',
'17 Tahun',
'18 Tahun, Udah Balig Nih'
]

export { pluginConfig as config, handler };
