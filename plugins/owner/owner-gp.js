import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, isROwner, usedPrefix, command, text }) => {
    if (!text) throw `Masukkan nama plugin!\n\nContoh:\n*${usedPrefix + command} menu*`

    // Search in plugins folder recursively
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
    if (!found) {
        // List some available plugin names
        let list = []
        function collect(dir) {
            for (const file of fs.readdirSync(dir)) {
                const fullPath = path.join(dir, file)
                if (fs.statSync(fullPath).isDirectory()) collect(fullPath)
                else if (file.endsWith('.js')) list.push(file.replace('.js', ''))
            }
        }
        collect(pluginDir)
        return m.reply(`*🗃️ PLUGIN NOT FOUND!*\n\nContoh plugin yang ada:\n${list.slice(0, 30).map(v => '• ' + v).join('\n')}`)
    }

    let code = fs.readFileSync(found, 'utf-8')
    m.reply(code)
}
handler.help = ['getplugin'].map(v => v + ' <text>')
handler.tags = ['owner']
handler.command = /^(getplugin|gp)$/i
handler.rowner = true

export default handler