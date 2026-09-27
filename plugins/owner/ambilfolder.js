/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
const pluginConfig = {
    name: "ambilfolder",
    alias: ["ambifolde","getfolder"],
    category: "owner",
    description: "Ambil folder dan kirim sebagai zip",
    usage: ".ambilfolder path/folder",
    example: ".ambilfolder plugins/fun",
    isOwner: true,
    cooldown: 5,
    isEnabled: true
}

async function handler(m, { sock }) {

    const folderPath = m.args?.[0]

    if (!folderPath) {
        return m.reply(
`╭━━〔 💖 RIMURU FOLDER GETTER 〕━━⬣
┃
┃ Gunakan:
┃ .ambilfolder path/folder
┃
┃ Contoh:
┃ .ambilfolder plugins/fun
╰━━━━━━━━━━━━━━━━⬣`)
    }

    try {

        const baseDir = process.cwd()
        const fullPath = path.join(baseDir, folderPath)

        if (!fullPath.startsWith(baseDir)) {
            return m.reply("❌ Akses ditolak 🗿")
        }

        if (!fs.existsSync(fullPath)) {
            return m.reply("❌ Folder tidak ditemukan")
        }

        const zipName = `backup_${Date.now()}.zip`
        const zipPath = path.join(baseDir, zipName)

        const output = fs.createWriteStream(zipPath)
        const archive = archiver('zip', { zlib: { level: 9 } })

        output.on('close', async () => {

            await sock.sendMessage(m.chat, {
                document: fs.readFileSync(zipPath),
                mimetype: 'application/zip',
                fileName: zipName
            }, { quoted: m })

            fs.unlinkSync(zipPath) // hapus setelah kirim
        })

        archive.pipe(output)
        archive.directory(fullPath, false)
        archive.finalize()

        m.react("📦")

    } catch (e) {

        console.log(e)

        m.react("❌")

        m.reply(
`╭━━〔 ❌ ERROR 〕━━⬣
┃
┃ ${e.message}
╰━━━━━━━━━━━━━━━━⬣`)
    }
}

export { pluginConfig as config, handler };
