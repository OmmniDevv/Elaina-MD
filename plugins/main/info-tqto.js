/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

let handler = async (m, { conn }) => {
  let pp = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
  try { pp = await conn.profilePictureUrl(m.sender, 'image') } catch {}

  const tqto = `
╭──────────────────────────
│  ✨ *B I G  T H A N K S  T O* ✨
╰──────────────────────────

*❉ Allah SWT*
  └ Tuhan Yang Maha Esa
*❉ Adiwajshing*
  └ https://github.com/adiwajshing
*❉ Nurutomo*
  └ https://github.com/Nurutomo
*❉ BochilGaming*
  └ https://github.com/BochilGaming
*❉ Rominaru*
  └ https://github.com/Rominaru
*❉ Kannachann*
  └ https://github.com/Kannachann
*❉ The.sad.boy01*
  └ https://github.com/kangsad01
*❉ Papah-Chan*
  └ https://github.com/FahriAdison
*❉ ImYanXiao*
  └ https://github.com/ImYanXiao
*❉ BrunoSobrino*
  └ https://github.com/BrunoSobrino

╭──────────────────────────
│  ✏️ *P E N U L I S  U L A N G*
╰──────────────────────────

*❉ OmmniDevv (Penulis Ulang Elaina-MD)*
  └ https://github.com/OmmniDevv

╭──────────────────────────
│  📦 *S O U R C E  C O D E*
╰──────────────────────────

*❉ Elaina-MD Repository*
  └ https://github.com/OmmniDevv/Elaina-MD
*❉ Author*
  └ https://github.com/OmmniDevv

╭──────────────────────────
│  ⚠️ *C A T A T A N  P E N T I N G*
╰──────────────────────────

✅ Script ini *GRATIS* untuk semua orang
❌ *DILARANG KERAS DIPERJUALBELIKAN!*
🔥 Jika dijual, neraka menunggumu kakak!

© 2022–2026 OmmniDevv
${global.wmcredit || '⫹⫺ github.com/OmmniDevv/Elaina-MD'}
`.trim()

  await conn.sendMessage(m.chat, {
    text: tqto,
    contextInfo: {
      
    }
  }, { quoted: m })
}

handler.help = ['tqto']
handler.tags = ['info']
handler.command = /^(credits?|thanks(to)?|tqto)$/i
export default handler
