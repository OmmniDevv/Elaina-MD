/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs'
import path from 'path'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'ganti-namabot',
    alias: ['setnamabot', 'setnamebot', 'gantibot'],
    category: 'owner',
    description: 'Ganti nama bot di config.js',
    usage: '.ganti-namabot <nama baru>',
    example: '.ganti-namabot Rimuru MD',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock, config }) {
    const newName = m.args.join(' ')
    
    if (!newName) {
        return m.reply(`🤖 *ɢᴀɴᴛɪ ɴᴀᴍᴀ ʙᴏᴛ*\n\n> Nama saat ini: *${config.bot?.name || '-'}*\n\n*Penggunaan:*\n\`${m.prefix}ganti-namabot <nama baru>\``)
    }
    
    try {
        const configPath = path.join(process.cwd(), 'config.js')
        let configContent = fs.readFileSync(configPath, 'utf8')
        
        configContent = configContent.replace(
            /bot:\s*\{[\s\S]*?name:\s*['"]([^'"]*)['"]/,
            (match, oldName) => match.replace(`'${oldName}'`, `'${newName}'`).replace(`"${oldName}"`, `'${newName}'`)
        )
        
        fs.writeFileSync(configPath, configContent)
        
        config.bot.name = newName
        
        m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Nama bot diganti ke: *${newName}*`)
        
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }