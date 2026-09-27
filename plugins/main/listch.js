/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m, { conn }) => {
  try {
    let res = await conn.newsletterSubscribed()

    if (!res || !res.length) {
      return m.reply('…kayaknya kamu belum ngikutin channel apapun.')
    }

    let teks = `🎸 *Channel List (${res.length})*\n\n`

    for (let ch of res) {
      let id = ch.id

      let name =
        ch.name?.text ||
        ch.thread_metadata?.name?.text ||
        ch.name ||
        ch.thread_metadata?.name ||
        'Unknown Channel'

      if (typeof name === 'object') name = 'Unknown Channel'

      teks += `▸ ${name}\n`
      teks += `   ⤷ ${id}\n\n`
    }

    m.reply(teks)
  } catch (e) {
    m.reply('…error.')
  }
}

handler.help = ['listch']
handler.tags = ['owner']
handler.command = /^listch$/i
handler.owner = true

export default handler
