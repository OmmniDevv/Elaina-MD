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
    name: 'gantiapi',
    alias: ['setapi'],
    category: 'owner',
    description: 'Mengganti API di plugin tertentu',
    usage: '.gantiapi <plugin> <api>',
    example: '.gantiapi tomediafire sk-xxxx',
    isOwner: true,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m) {

    const args = m.args || []

    if (args.length < 2) {
        return m.reply(
`╭━━〔 💗 RIMURU API SYSTEM 💗 〕━━⬣
┃
┃ Darling, formatnya salah 😖
┃
┃ Contoh :
┃ .gantiapi tomediafire sk-xxxx
┃
╰━━━━━━━━━━━━━━━━⬣`)
    }

    const pluginName = args[0]
    const newApi = args.slice(1).join(' ')

    const pluginPath = path.join(process.cwd(), 'plugins', `${pluginName}.js`)

    if (!fs.existsSync(pluginPath)) {
        return m.reply(
`╭━━〔 ❌ RIMURU SYSTEM 〕━━⬣
┃ Plugin *${pluginName}* tidak ditemukan
╰━━━━━━━━━━━━━━━━⬣`)
    }

    try {

        let file = fs.readFileSync(pluginPath, 'utf8')

        const apiRegex = /(apiKey\s*[:=]\s*['"`])(.*?)(['"`])/i

        if (!apiRegex.test(file)) {
            return m.reply(
`╭━━〔 ⚠️ RIMURU SYSTEM 〕━━⬣
┃ API tidak ditemukan di plugin
┃ *${pluginName}*
╰━━━━━━━━━━━━━━━━⬣`)
        }

        file = file.replace(apiRegex, `$1${newApi}$3`)

        fs.writeFileSync(pluginPath, file)

        await m.reply(
`╭━━〔 💗 RIMURU API UPDATED 💗 〕━━⬣
┃
┃ Plugin : *${pluginName}*
┃ API baru : *${newApi}*
┃
┃ API berhasil diganti darling 😋
┃ Jangan lupa restart bot ya
┃
╰━━━━━━━━━━━━━━━━⬣`
        )

    } catch (err) {

        m.reply(
`╭━━〔 ❌ RIMURU ERROR 〕━━⬣
┃ ${err.message}
╰━━━━━━━━━━━━━━━━⬣`)
    }

}

export { pluginConfig as config, handler };
