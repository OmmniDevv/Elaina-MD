// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m, { conn, usedPrefix, command, args: [event], text }) => {
    if (!event) return await conn.sendButton(m.chat, `Contoh penggunaan:\n${usedPrefix + command} welcome @user\n${usedPrefix + command} bye @user\n${usedPrefix + command} promote @user\n${usedPrefix + command} demote @user`.trim(), global.wm || '', null, [['Welcome', '#simulate welcome'], ['Bye', '#simulate bye']])
    let mentions = text.replace(event, '').trimStart()
    let who = mentions ? conn.parseMention(mentions) : []
    let part = who.length ? who : [m.sender]
    let act = false
    m.reply(`*${global.htjava || '•'} Simulating ${event}...*`)
    switch (event.toLowerCase()) {
        case 'add':
        case 'invite':
        case 'welcome':
            act = 'add'
            break
        case 'bye':
        case 'kick':
        case 'leave':
        case 'remove':
            act = 'remove'
            break
        case 'promote':
            act = 'promote'
            break
        case 'demote':
            act = 'demote'
            break
        default:
            throw `Event tidak valid! Pilihan: welcome, bye, promote, demote`
    }
    if (act) return conn.participantsUpdate({
        id: m.chat,
        participants: part,
        action: act
    })
}
handler.help = ['simulate <event> [@mention]']
handler.tags = ['owner']
handler.command = /^simulate$/i
handler.rowner = true

export default handler