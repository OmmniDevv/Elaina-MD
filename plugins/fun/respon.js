/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: "autorimuru",
    alias: [],
    category: "fun",
    description: "Auto respon jika ada yang menyebut Rimuru",
    usage: ".autorimuru on/off",
    example: ".autorimuru on",
    cooldown: 3
}

// global agar tidak reset saat hot reload
if (!global.autoRimuru) global.autoRimuru = false

async function handler(m) {

    const text = (m.text || "").toLowerCase()
    const args = text.split(" ")[1]

    if (!args) {
        return m.reply(
`╭─〔 ❤️ RIMURU AUTO RESPON 〕
│
│ 📌 Perintah:
│ • .autorimuru on
│ • .autorimuru off
│
│ Rimuru akan otomatis
│ merespon jika namanya disebut.
│
╰────────────`
        )
    }

    if (args === "on") {
        global.autoRimuru = true

        return m.reply(
`╭─〔 ❤️ RIMURU 〕
│
│ Ara ara~
│ Auto respon sekarang *AKTIF*
│
│ Panggil aku kapan saja
│ Darling~
│
╰────────────`
        )
    }

    if (args === "off") {
        global.autoRimuru = false

        return m.reply(
`╭─〔 RIMURU 〕
│
│ Hmph!
│ Auto respon dimatikan.
│
│ Sampai jumpa Darling~
│
╰────────────`
        )
    }

}

async function before(m, { sock }) {

    if (!global.autoRimuru) return

    const text = (m.text || "").toLowerCase()

    const trigger = [

        "Rimuru",
        "rimuru",
        "02",
        "rimuru",
        "zero2",
        "Rimuru ai",
        "rimuru ai",
        "bot Rimuru",
        "Rimuru bot",
        "02 ai",
        "darling Rimuru",
        "rimuruoo",
        "Rimuruoo",
        "02 darling",
        "rimuru chan",
        "rimuru-chan"

    ]

    if (!trigger.some(v => text.includes(v))) return

    const name = m.pushName || "Darling"

    const respon = [

`╭─〔 ❤️ RIMURU 〕
│
│ Ara ara~
│ ${name} memanggilku?
│
│ Ada yang bisa
│ Rimuru bantu?
│
╰────────────`,

`╭─〔 RIMURU 〕
│
│ Fufu~
│ Aku mendengar
│ namaku disebut.
│
│ Halo ${name}.
│
╰────────────`,

`╭─〔 RIMURU 〕
│
│ Eh?
│ ${name} kangen aku ya?
│
│ Darling lucu~
│
╰────────────`,

`╭─〔 RIMURU 〕
│
│ Ara ara~
│ Jangan panggil aku
│ sembarangan.
│
│ ...tapi kalau kamu
│ boleh ${name}.
│
╰────────────`,

`╭─〔 RIMURU 〕
│
│ Hmph!
│ Siapa yang memanggil
│ Rimuru?
│
│ Oh ternyata kamu~
│
╰────────────`,

`╭─〔 RIMURU 〕
│
│ Darling ${name}~
│ Kamu memanggilku?
│
│ Aku datang ❤️
│
╰────────────`,

`╭─〔 RIMURU 〕
│
│ Fufu~
│ Aku merasa
│ seseorang menyebutku.
│
│ Hai ${name}.
│
╰────────────`,

`╭─〔 RIMURU 〕
│
│ Eh ${name}!
│ Kamu memanggil
│ Rimuru?
│
│ Aku disini~
│
╰────────────`

]

    const random = respon[Math.floor(Math.random() * respon.length)]

    await sock.sendMessage(m.chat, { text: random }, { quoted: m })

}
export { pluginConfig as config, handler, before };