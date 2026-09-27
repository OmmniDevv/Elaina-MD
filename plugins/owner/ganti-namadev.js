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
    name: 'ganti-namadev',
    alias: ['setnamadev', 'setnamedev', 'gantideveloper'],
    category: 'owner',
    description: 'Ganti nama developer di config.js',
    usage: '.ganti-namadev <nama baru>',
    example: '.ganti-namadev Lucky Archz',
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
        return m.reply(`👨‍💻 *ɢᴀɴᴛɪ ɴᴀᴍᴀ ᴅᴇᴠᴇʟᴏᴘᴇʀ*\n\n> Nama saat ini: *${config.bot?.developer || '-'}*\n\n*Penggunaan:*\n\`${m.prefix}ganti-namadev <nama baru>\``)
    }
    
    try {
        const configPath = path.join(process.cwd(), 'config.js')
        let configContent = fs.readFileSync(configPath, 'utf8')
        
        configContent = configContent.replace(
            /developer:\s*['"]([^'"]*)['"]/,
            `developer: '${newName}'`
        )
        
        fs.writeFileSync(configPath, configContent)
        
        config.bot.developer = newName
        
        m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Nama developer diganti ke: *${newName}*`)
        
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }