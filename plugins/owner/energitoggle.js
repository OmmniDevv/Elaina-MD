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
    name: ['disableenergi', 'enableenergi'],
    alias: ['offenergi', 'onenergi'],
    category: 'owner',
    description: 'Enable/disable sistem energi',
    usage: '.disableenergi atau .enableenergi',
    example: '.disableenergi',
    isOwner: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m) {
    const db = getDatabase()
    const cmd = m.command.toLowerCase()
    const isEnable = ['enableenergi', 'onenergi'].includes(cmd)

    db.setting('energi', isEnable)
    db.save()

    await m.react(isEnable ? '⚡' : '🔌')
    return m.reply(
        isEnable
            ? '⚡ *sɪsᴛᴇᴍ ᴇɴᴇʀɢɪ ᴅɪᴀᴋᴛɪꜰᴋᴀɴ*\n\n> Setiap command sekarang memerlukan energi.'
            : '🔌 *sɪsᴛᴇᴍ ᴇɴᴇʀɢɪ ᴅɪɴᴏɴᴀᴋᴛɪꜰᴋᴀɴ*\n\n> Command tidak lagi membutuhkan energi.'
    )
}

export { pluginConfig as config, handler }