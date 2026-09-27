/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import { DEFAULT_TOXIC_WORDS } from './antitoxic.js'
const pluginConfig = {
    name: 'listtoxic',
    alias: ['toxiclist', 'katatoxic', 'lihatkata'],
    category: 'group',
    description: 'Lihat daftar kata toxic',
    usage: '.listtoxic',
    example: '.listtoxic',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const groupData = db.getGroup(m.chat) || {}
    
    const customWords = groupData.toxicWords || []
    const defaultWords = DEFAULT_TOXIC_WORDS || []
    
    let text = `📋 *ᴅᴀꜰᴛᴀʀ ᴋᴀᴛᴀ ᴛᴏxɪᴄ*\n\n`
    
    if (customWords.length > 0) {
        text += `╭┈┈⬡「 ✏️ *ᴄᴜsᴛᴏᴍ* (${customWords.length}) 」\n`
        for (let i = 0; i < customWords.length; i++) {
            text += `┃ ${i + 1}. ${customWords[i]}\n`
        }
        text += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    }
    
    text += `╭┈┈⬡「 📦 *ᴅᴇꜰᴀᴜʟᴛ* (${defaultWords.length}) 」\n`
    
    for (let i = 0; i < defaultWords.length; i++) {
        text += `┃ ${i + 1}. ${defaultWords[i]}\n`
    }
    text += `╰┈┈┈┈┈┈┈┈⬡\n\n`
    
    text += `Total: *${customWords.length + defaultWords.length}* kata\n`
    text += `\`.addtoxic <kata>\` untuk tambah\n`
    text += `\`.deltoxic <kata>\` untuk hapus`
    
    await m.reply(text)
}

export { pluginConfig as config, handler }