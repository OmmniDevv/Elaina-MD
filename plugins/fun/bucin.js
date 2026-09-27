/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getRandomItem } from '../../src/lib/elaina-game-data.js'
const pluginConfig = {
    name: 'bucin',
    alias: ['gombal', 'love', 'romantis'],
    category: 'fun',
    description: 'Random kata-kata bucin/romantis',
    usage: '.bucin',
    example: '.bucin',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
};

async function handler(m) {
    const quote = getRandomItem('bucin.json');
    
    if (!quote) {
        await m.reply('❌ Data tidak tersedia!');
        return;
    }
    
    await m.reply(`\`\`\`"${quote}"\`\`\`\n\n`);
}

export { pluginConfig as config, handler }