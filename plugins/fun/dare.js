/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getRandomItem } from '../../src/lib/elaina-game-data.js'
const pluginConfig = {
    name: 'dare',
    alias: ['dareq', 'tantang'],
    category: 'fun',
    description: 'Random tantangan dare',
    usage: '.dare',
    example: '.dare',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
};

async function handler(m) {
    const challenge = getRandomItem('dare.json');
    
    if (!challenge) {
        await m.reply('❌ Data tidak tersedia!');
        return;
    }
    
    await m.reply(`\`\`\`${challenge}\`\`\``);
}

export { pluginConfig as config, handler }