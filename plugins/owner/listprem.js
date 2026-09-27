/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m, { conn }) => {

  let users = global.db.data.users
  let prem = Object.entries(users).filter(([jid, u]) => u.premium)

  if (!prem.length) {
    return m.reply('✨ Tidak ada user premium saat ini')
  }

  let teks = `✨ *LIST USER PREMIUM*\n\n`

  for (let i of prem) {
    let jid = i[0]
    let user = i[1]

    let name = await conn.getName(jid)
    let tag = '@' + jid.split('@')[0]

    let sisa = user.premiumTime - Date.now()

    let waktu = user.premiumTime === Infinity
      ? 'Permanen'
      : sisa > 0
        ? msToDate(sisa)
        : 'Expired'

    teks += `👤 ${name}
🔗 ${tag}
🌙 ${waktu}\n\n`
  }

  await conn.sendMessage(m.chat, {
    text: teks.trim(),
    mentions: prem.map(v => v[0])
  }, { quoted: m })
}

handler.help = ['listprem']
handler.tags = ['owner']
handler.command = /^list(prem|premium)$/i
handler.owner = true

export default handler

function msToDate(ms) {
  let d = Math.floor(ms / 86400000)
  let h = Math.floor(ms % 86400000 / 3600000)
  let m = Math.floor(ms % 3600000 / 60000)
  return `${d} Hari ${h} Jam ${m} Menit`
}
