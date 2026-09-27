/**
 * Elaina-MD — https://github.com/OmmniDevv/Elaina-MD
 * Script by OmmniDevv — Jangan Dijual!
 */

let handler = async (m, { conn, usedPrefix, command }) => {
  const isVid = /video/.test((m.quoted?.msg || m.msg || m)?.mimetype || '')
  if (!isVid) throw `❌ Reply ke video dengan \`${usedPrefix}${command}\``
  conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
  try {
    const buf = m.quoted ? await m.quoted.download() : await m.download()
    if (!buf?.length) throw '❌ Gagal download video'
    await conn.sendMessage(m.chat, { video: { url: buf }, ptv: true }, { quoted: m })
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch {
    throw '❌ Gagal convert video ke PTV!'
  }
}
handler.help = ['ptv (reply video)']
handler.tags = ['tools']
handler.command = /^(ptv|videobulet|roundvideo)$/i
export default handler
