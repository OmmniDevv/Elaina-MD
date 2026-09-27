// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Credits: Kannachann & Papah-Chan
let handler = async (m, { conn }) => {
    await conn.sendMessage(m.chat, {
        text: `📜 *Info Script ${global.namebot}*\n\n` +
            `• Nama Bot : *${global.namebot}*\n` +
            `• Owner : *${global.nameown}*\n` +
            `• GitHub : *${global.sgh}*\n` +
            `• Nomor Bot : *${global.nomorbot}*\n\n` +
            `_Script ini gratis untuk semua orang. Dilarang diperjualbelikan!_\n\n` +
            `_© ${global.namebot} | ${global.wmcredit}_`,
        contextInfo: {
            
        }
    }, { quoted: m })
}

handler.help = ['script', 'sc', 'source']
handler.tags = ['info']
handler.command = /^(script|sc|source)$/i
export default handler
