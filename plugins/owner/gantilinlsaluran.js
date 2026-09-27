/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
const pluginConfig = {
    name: 'gantilinksaluran',
    alias: ['setlinksaluran'],
    category: 'owner',
    description: 'Mengganti semua link saluran di SC',
    usage: '.gantilinksaluran|link',
    example: '.gantilinksaluran|https://whatsapp.com/channel/RIMURU_CHANNEL',
    isOwner: true,
    cooldown: 3,
    isEnabled: true
}

async function handler(m) {

    let msg = m.text || ""
    let input = msg.split("|")[1]

    if (!input) {
        return m.reply(`Contoh:
.gantilinksaluran|https://whatsapp.com/channel/RIMURU_CHANNEL`)
    }

    const newLink = input.trim()

    function scan(dir){
        const files = fs.readdirSync(dir)

        for (let file of files){
            const full = path.join(dir, file)
            const stat = fs.statSync(full)

            if (stat.isDirectory()){
                scan(full)
            } else if (file.endsWith(".js")){
                let data = fs.readFileSync(full, "utf8")

                // regex ganti semua link channel WA
                let replaced = data.replace(/https:\/\/whatsapp\.com\/channel\/[a-zA-Z0-9]+/g, newLink)

                fs.writeFileSync(full, replaced)
            }
        }
    }

    scan("./")

    await m.reply(`╭━━〔 💗 RIMURU SYSTEM 💗 〕━━⬣
┃ ✅ Link saluran berhasil diganti
┃
┃ 🔗 Link Baru :
┃ ${newLink}
┃
┃ 🔄 Bot akan restart dalam 5 detik...
╰━━━━━━━━━━━━━━━━⬣`)

    setTimeout(() => {
        process.exit()
    }, 5000)
}

export { pluginConfig as config, handler };
