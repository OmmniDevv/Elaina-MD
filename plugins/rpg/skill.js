/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
  name: "skill",
  alias: [],
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

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m) => {
  let user = global.db.data.users[m.sender]
  if (!user?.rpg) return m.reply('⚠️ Belum mulai RPG.')

  const cooldown = 1000 * 60 * 5 // 5 menit
  user.rpg.skillCooldown = user.rpg.skillCooldown || 0

  if (Date.now() < user.rpg.skillCooldown)
    return m.reply(`⏳ Skill cooldown! Tunggu ${Math.ceil((user.rpg.skillCooldown - Date.now()) / 60000)} menit lagi.`)

  // Efek skill random
  const efek = Math.random() < 0.5 ? 'heal' : 'gold'
  let hasil = ''

  if (efek === 'heal') {
    user.rpg.hp += 100
    hasil = '❤️ Kamu menggunakan skill *Regen* dan memulihkan 100 HP!'
  } else {
    let g = Math.floor(Math.random() * 100 + 50)
    user.rpg.gold += g
    hasil = `💰 Kamu menggunakan skill *Harta Karun* dan mendapatkan ${g} gold!`
  }

  user.rpg.skillCooldown = Date.now() + cooldown

  m.reply(`🔥 SKILL AKTIF!\n${hasil}`)
}

export { pluginConfig as config, handler };
