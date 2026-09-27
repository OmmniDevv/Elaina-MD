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
    name: 'gantiidsaluran',
    alias: ['setidsaluran'],
    category: 'owner',
    description: 'Mengganti semua ID saluran di SC',
    usage: '.gantiidsaluran|id',
    example: '.gantiidsaluran|120363xxxx@newsletter',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m) {

    let msg = m.text || ""
    let input = msg.split("|")[1]

    if (!input) {
        return m.reply("Contoh:\n.gantiidsaluran|120363xxxx@newsletter")
    }

    const newId = input.trim()

    function scan(dir){
        const files = fs.readdirSync(dir)

        for (let file of files){
            const full = path.join(dir, file)
            const stat = fs.statSync(full)

            if (stat.isDirectory()){
                scan(full)
            } else if (file.endsWith(".js")){
                let data = fs.readFileSync(full, "utf8")

                let replaced = data.replace(/\d+@newsletter/g, newId)

                fs.writeFileSync(full, replaced)
            }
        }
    }

    scan("./")

    await m.reply(`╭━━〔 ❤️ RIMURU SYSTEM ❤️ 〕━━⬣
┃ ✅ ID Saluran berhasil diganti
┃
┃ ID Baru :
┃ ${newId}
┃
┃ 🔄 Bot akan restart dalam 5 detik...
╰━━━━━━━━━━━━━━━━⬣`)

    setTimeout(() => {
        process.exit()
    }, 5000)
}

export { pluginConfig as config, handler };
