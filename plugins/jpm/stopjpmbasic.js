/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'stopjpmbasic',
    alias: ['stopjpmb'],
    category: 'jpm',
    description: 'Menghentikan JPM Basic yang sedang berjalan',
    usage: '.stopjpmbasic',
    example: '.stopjpmbasic',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 0,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    if (!global.statusjpmbasic) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Tidak ada JPM Basic yang sedang berjalan`)
    }
    
    global.stopjpmbasic = true
    m.react('⏹️')
    await m.reply(`⏹️ *sᴛᴏᴘ ᴊᴘᴍ ʙᴀsɪᴄ*\n\n> Menghentikan JPM Basic...`)
}

export { pluginConfig as config, handler };
