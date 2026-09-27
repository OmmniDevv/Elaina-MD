/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'stop',
    alias: ['shutdown', 'kill'],
    category: 'owner',
    description: 'Stop bot process',
    usage: '.stop',
    example: '.stop',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 0,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    await m.reply('🛑 *Stopping Bot...*\n\n> Bot dimatikan. Harus dinyalakan manual dari terminal.')
    console.log('Stopping via command...')
    
    // Allow message to send before exit
    setTimeout(() => {
        process.exit(1) // Exit code 1 usually stops auto-restart in simple loops
    }, 1000)
}

export { pluginConfig as config, handler }