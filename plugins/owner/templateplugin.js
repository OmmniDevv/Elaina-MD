/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js'
const pluginConfig = {
    name: 'templateplugin',
    alias: ['tplplugin', 'plugin-template'],
    category: 'owner',
    description: 'Generate plugin template (Owner Only)',
    usage: '.templateplugin',
    example: '.templateplugin',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 0,
    energi: 0,
    isEnabled: true
}
function handler(m, { sock }) {
    const template = `
const pluginConfig = {
    name: 'example',
    alias: ['ex'],
    category: 'general',
    description: 'Example plugin',
    usage: '.example',
    example: '.example',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true
}
async function handler(m, { sock }) {
    try {
        await m.reply('This is an example plugin!')
    } catch (error) {
        console.error('Example Plugin Error:', error)
        await m.reply('❌ *GAGAL*\\n\\n> ' + error.message)
    }
}
export { pluginConfig as config, handler }
`
    m.reply(`\`\`\`${template}\`\`\``)
}
export { pluginConfig as config, handler }