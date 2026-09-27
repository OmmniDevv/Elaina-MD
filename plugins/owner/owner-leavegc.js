// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m, { conn, args, command }) => {
    let group = (args[0] && args[0].endsWith('@g.us')) ? args[0] : m.chat
    if (!group.endsWith('@g.us')) throw 'Perintah ini hanya bisa digunakan di dalam grup atau cantumkan JID grup!'
    await m.reply('Sayonara minna-san~! Elaina pamit dulu yaa (≧ω≦)ゞ')
    await conn.groupLeave(group)
}
handler.help = ['leavegc', 'out']
handler.tags = ['owner']
handler.command = /^(out|leavegc)$/i

handler.rowner = true

export default handler