/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

let handler = async (m, { conn, groupMetadata }) => {
    let participants = groupMetadata.participants
    if (participants.length < 2) return m.reply('Anggota kurang 😅')

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    let shuffled = shuffle([...participants])
    let a = shuffled[0].id
    let b = shuffled[1].id

    let teks = `◇───── Jadian ─────◇\n\n`
    teks += `• @${a.split('@')[0]}\n`
    teks += `• @${b.split('@')[0]}\n`
    teks += `\nSelamat ❤️`

    conn.sendMessage(m.chat, {
        text: teks.trim(),
        mentions: [a, b]
    }, { quoted: m })
}

handler.help = ['jadian']
handler.tags = ['main', 'fun']
handler.command = ['jadian']
handler.group = true

export default handler
