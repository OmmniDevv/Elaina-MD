/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: "gachatomboy",
    category: "fun",
    description: "Gacha char anime tomboy random 100+ karakter",
    usage: ".gachatomboy",
    isEnabled: true
}

// List char tomboy, bisa ditambah sesuka hati
const tomboyList = [
"Misaki Ayuzawa","Haruhi Fujioka","Ruka Sarashina","Hikari Hanazono",
"Ushio","Makoto Kino","Souta","Yuki Nagato","Shikimori","Uzaki Hana",
"Tsuki Uzaki","Nagatoro","Chika Fujiwara","Ai Hayasaka","Akane Kurokawa",
"Ruby Hoshino","Frieren","Akira Asai","Tomoko Kuroki","Menma","Izumi Mom",
"Yukino Yukinoshita","Rikka Takarada","Chisato Nishikigi","Takina Inoue",
"Vivy","Shiraori","Anisphia Wynn Palletia","Euphyllia Magenta"
]

async function handler(m){
    const name = m.pushName || "Darling"
    const char = tomboyList[Math.floor(Math.random()*tomboyList.length)]
    const love = Math.floor(Math.random()*101)

    const statusList = [
        "💖 Cinta Sejati",
        "💘 Pasangan Serasi",
        "💕 Jodoh Anime",
        "💞 Relationship Goals",
        "💓 Bucin Maksimal",
        "💔 Hubungan Toxic 🗿"
    ]

    const status = statusList[Math.floor(Math.random()*statusList.length)]

    const responses = [
`╔═══『 💍 *GACHA TOMBOY* 』═══╗
┃
┃ 👤 Suami : *${name}*
┃ 👰 Tomboy : *${char}*
┃
┃ 💖 Love Meter : *${love}%*
┃ 📊 Status : *${status}*
┃
┃ Omedetou atas pernikahan kalian!
┃ Semoga langgeng selamanya ❤️
┃
╚════════════════════╝`,

`┏━━━〔 👰 *TOMBOY FOUND* 〕━━━┓
┃
┃ 🎉 Selamat!!
┃
┃ 👤 *${name}*
┃ ❤️ *${char}*
┃
┃ 💘 Kecocokan : *${love}%*
┃ 📊 Status : *${status}*
┃
┃ Jangan disia-siakan ya 😏
┗━━━━━━━━━━━━━━━━━━┛`,

`╭────〔 💞 *MATCHMAKING TOMBOY* 〕────╮
│
│ 👤 Player : *${name}*
│ 💖 Tomboy : *${char}*
│
│ 💓 Love Level : *${love}%*
│ 📊 Status : *${status}*
│
│ Sistem telah menjodohkan kalian
│ secara random 🗿
│
╰────────────────────╯`
    ]

    const reply = responses[Math.floor(Math.random()*responses.length)]
    await m.reply(reply)
}
export { pluginConfig as config, handler };