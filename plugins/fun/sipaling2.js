/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
let handler = async (m, { conn, command, usedPrefix, text, groupMetadata }) => {
    if (!text) throw `Contoh:\n${usedPrefix + command} ganteng`

    let emojis = ['😀','😂','😎','🤔','🤩','😜','🙃','😏','🥳','🥴','😇','🫡','😡']
    let praises = [
        "Luar biasa banget! 😍",
        "Nggak ada lawannya! 🤯",
        "Beneran juara! 🏆",
        "Sungguh fenomenal! 🚀",
        "Mantap kali! 💥",
        "Top banget deh! 🥳",
    ]

    function pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)]
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    let participants = groupMetadata.participants
    let shuffled = shuffle([...participants])
    let target = shuffled[0].id

    let teks = `Yang *paling ${text}* adalah @${target.split('@')[0]} ${pickRandom(emojis)}\n${pickRandom(praises)}`

    conn.sendMessage(m.chat, {
        text: teks,
        mentions: [target]
    }, { quoted: m })
}

handler.help = ['sipaling <teks>']
handler.command = ['sipaling']
handler.tags = ['fun']
handler.group = true

export default handler
