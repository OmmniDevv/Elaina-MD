// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import { spawn } from 'child_process'
let handler = async (m, { conn, isROwner, text }) => {
    if (!process.send) throw 'Dont: node main.js\nDo: node index.js'
    await m.reply('```R E S T A R T I N G . . .```')
    if (process.send) {
        process.send('reset')
    } else {
        process.exit(0)
    }
}

handler.help = ['restart']
handler.tags = ['owner']
handler.command = /^(res(tart)?)$/i

handler.rowner = true

export default handler