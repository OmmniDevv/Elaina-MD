import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) throw `Masukkan nama file plugin yang ingin dihapus!\n\nContoh:\n*${usedPrefix + command} menu*`

    const pluginDir = path.join(process.cwd(), 'plugins')
    function findFile(dir, target) {
        for (const file of fs.readdirSync(dir)) {
            const fullPath = path.join(dir, file)
            if (fs.statSync(fullPath).isDirectory()) {
                const res = findFile(fullPath, target)
                if (res) return res
            } else if (file === target || file === target + '.js') {
                return fullPath
            }
        }
        return null
    }

    const found = findFile(pluginDir, text.trim())
    if (!found) return m.reply(`*🗃️ PLUGIN NOT FOUND!* File "${text}" tidak ditemukan.`)

    // Rename to .disabled instead of unlinking to preserve safety
    const disabledPath = found + '.disabled'
    fs.renameSync(found, disabledPath)
    conn.reply(m.chat, `✅ Berhasil menonaktifkan plugin: *${path.basename(found)}* (di-rename menjadi .disabled)`, m)
}
handler.help = ['df <plugin>']
handler.tags = ['owner']
handler.command = /^(df|delplugin)$/i

handler.rowner = true

export default handler
