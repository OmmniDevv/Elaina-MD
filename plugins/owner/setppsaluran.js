/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from "../../config.js";

const CHANNEL_ID = config.saluran?.id

const pluginConfig = {
    name: "setppsaluran",
    alias: ["setppchannel","ppchannel"],
    category: "owner",
    description: "Ganti PP channel dan kirim notifikasi ke channel",
    usage: ".setppsaluran (reply gambar)",
    example: ".setppsaluran",
    isOwner: true,
    cooldown: 5,
    isEnabled: true
}

import sharp from 'sharp' // resize & convert

async function handler(m,{ sock }){

    const quoted = m.quoted
    if(!quoted) return m.reply(
`╭━━〔 *❤️ RIMURU SET PP CHANNEL* 〕━━⬣
┃ Reply gambar dengan command ini
┃ lalu kirim *.setppsaluran*
╰━━━━━━━━━━━━━━━━⬣`
    )

    const message = quoted.message
    let imageBuffer = null

    if(message.imageMessage || (message.viewOnceMessage && message.viewOnceMessage.message?.imageMessage)){
        imageBuffer = await quoted.download()
    }

    if(!imageBuffer) return m.reply(
`╭━━〔 *❌ RIMURU SET PP CHANNEL* 〕━━⬣
┃ ❌ Pesan yang direply bukan gambar
╰━━━━━━━━━━━━━━━━⬣`
    )

    m.react("⏳")

    try{
        // Resize & convert image
        const finalBuffer = await sharp(imageBuffer)
            .resize({ width: 720, withoutEnlargement: true })
            .jpeg({ quality: 90 })
            .toBuffer()

        // Update PP channel
        await sock.updateProfilePicture(CHANNEL_ID, finalBuffer)

        // Kirim info ke channel (UI Rimuru)
        const time = new Date().toLocaleTimeString()
        const infoMsg =
`╭─〔 💖 RIMURU CHANNEL UPDATE 💖 〕
│
│ Darling, ada PP baru nih 😋
│
│ 👑 Dari : ${m.pushName}
│ ⏰ Waktu : ${time}
│
│ 🎨 PP Channel berhasil diupdate!
│
│ Ara ara~ Terima kasih sudah
│ kirim gambar lucu ini ❤️
╰────────────`

        await sock.sendMessage(CHANNEL_ID,{ text: infoMsg })

        // Feedback ke user
        m.react("✅")
        return m.reply(
`╭━━〔 *❤️ RIMURU SYSTEM* 〕━━⬣
┃ ✅ PP Channel berhasil diupdate!
┃ Darling, channel sudah dikasih info 😋
╰━━━━━━━━━━━━━━━━⬣`
        )

    }catch(e){
        console.log(e)
        m.react("❌")
        return m.reply(
`╭━━〔 *❌ RIMURU SYSTEM* 〕━━⬣
┃ ${e.message}
╰━━━━━━━━━━━━━━━━⬣`
        )
    }

}

export { pluginConfig as config, handler };
