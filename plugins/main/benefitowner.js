/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getAllPlugins } from '../../src/lib/elaina-plugins.js'
import config from '../../config.js'
const pluginConfig = {
    name: 'benefitowner',
    alias: ['ownerbenefits', 'ownerfitur'],
    category: 'main',
    description: 'Lihat penjelasan dan daftar fitur khusus Owner',
    usage: '.benefitowner',
    isOwner: false,
    isGroup: false,
    isEnabled: true
}

async function handler(m, { sock }) {
    const plugins = getAllPlugins()
    const ownerCommands = plugins.filter(p => p.config.isOwner && p.config.isEnabled)
    
    const seen = new Set()
    const commandList = []
    for (const p of ownerCommands) {
        const names = Array.isArray(p.config.name) ? p.config.name : [p.config.name]
        for (const name of names) {
            if (!name || seen.has(name)) continue
            seen.add(name)
            commandList.push(`• *${config.command?.prefix || '.'}${name}*`)
        }
    }
    commandList.sort()
    
    const totalCommands = commandList.length
    
    const message = 
        `👑 *ᴀᴘᴀ ɪᴛᴜ ᴏᴡɴᴇʀ?*\n\n` +
        `Owner adalah *pemilik bot* yang memiliki akses penuh ke semua fitur dan kontrol sistem.\n\n` +
        `╭┈┈⬡「 🔐 *ᴋᴇɪꜱᴛɪᴍᴇᴡᴀᴀɴ ᴏᴡɴᴇʀ* 」\n` +
        `┃ ✦ \`\`\`Akses semua command tanpa batasan\`\`\`\n` +
        `┃ ✦ \`\`\`Limit tidak terbatas (-1)\`\`\`\n` +
        `┃ ✦ \`\`\`Bypass semua cooldown\`\`\`\n` +
        `┃ ✦ \`\`\`Kontrol penuh sistem bot\`\`\`\n` +
        `┃ ✦ \`\`\`Manajemen user & group\`\`\`\n` +
        `┃ ✦ \`\`\`Akses panel & server\`\`\`\n` +
        `╰┈┈┈┈┈┈┈┈⬡\n\n` +
        `╭┈┈⬡「 ⚙️ *ᴄᴀʀᴀ ᴋᴇʀᴊᴀ* 」\n` +
        `┃ \`Owner ditambahkan melalui:\`\n` +
        `┃ • \`\`\`${config.command?.prefix || '.'}addowner <nomor>\`\`\`\n` +
        `┃ • Atau langsung di config.js\n` +
        `╰┈┈┈┈┈┈┈┈⬡\n\n` +
        `╭┈┈⬡「 📋 *ᴅᴀꜰᴛᴀʀ ᴄᴏᴍᴍᴀɴᴅ ᴏᴡɴᴇʀ* 」\n` +
        `┃ \`Total: ${totalCommands} command\`\n` +
        `┃\n` +
        commandList.map(cmd => `┃ ${cmd}`).join('\n') +
        `\n╰┈┈┈┈┈┈┈┈⬡\n\n` +
        `> Hubungi owner untuk mendapatkan akses!`
    
    await m.reply(message)
}

export { pluginConfig as config, handler }