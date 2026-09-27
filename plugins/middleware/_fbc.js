// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m, { conn, text }) => {
  await conn.sendMessage(m.chat, {
    text: `*ʙʀᴏᴀᴅᴄᴀsᴛ ʜᴇʀᴇ*\n\n${text}`.trim(),
    contextInfo: {
      forwardingScore: 9,
      isForwarded: true
    }
  }, { quoted: m })
}
handler.help = ['bchere <text>']
handler.tags = ['owner']
handler.command = ['bchere']
handler.rowner = true

export default handler
