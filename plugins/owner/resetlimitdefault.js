/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import config from '../../config.js'
const pluginConfig = {
    name: 'resetlimitdefault',
    alias: ['defaultlimitreset'],
    category: 'owner',
    description: 'Reset default limit ke config asli',
    usage: '.resetlimitdefault',
    example: '.resetlimitdefault',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const configDefault = config.limits?.default || 25
    
    db.setting('defaultLimit', null)
    
    await m.reply(
        `✅ *ʙᴇʀʜᴀsɪʟ*\n\n` +
        `> Default limit direset ke config: \`${configDefault}\`\n` +
        `> User baru akan mendapat limit dari config`
    )
}

export { pluginConfig as config, handler }