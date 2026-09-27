// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
import fetch from 'node-fetch'
let handler = async (m, { conn, text }) => {
  if (!text) throw 'Masukkan pesan broadcast!'
  let groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce).map(v => v[0])

  conn.reply(m.chat, `_Mengirim pesan broadcast ke ${groups.length} grup_`, m)
  for (let id of groups) {
    await conn.sendButton(id, '────━┅ *BROADCAST* ┅━────\n\n' + text, global.wm || '', global.thumbbc || null, [['OWNER 🎐', '.owner'], ['DONASI ✨', '.donasi']], false).catch(() => {})
  }
  m.reply('*D O N E !*')
}
handler.command = ['bcgcb']
handler.tags = ['owner']
handler.help = ['bcgcb']

handler.rowner = true

export default handler
