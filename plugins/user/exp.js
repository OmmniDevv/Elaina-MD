/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import { calculateLevel, getRole } from '../../src/lib/elaina-level.js'

const pluginConfig = {
    name: 'exp',
    alias: ['cekexp', 'myexp', 'xp'],
    category: 'user',
    description: 'Cek exp user',
    usage: '.exp [@user]',
    example: '.exp',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

async function handler(m, { sock }) {
    const db = getDatabase()
    
    let targetJid = m.sender
    let targetName = m.pushName || 'Kamu'
    
    if (m.quoted) {
        targetJid = m.quoted.sender
        targetName = m.quoted.pushName || targetJid.split('@')[0]
    } else if (m.mentionedJid?.length) {
        targetJid = m.mentionedJid[0]
        targetName = targetJid.split('@')[0]
    }
    
    const user = db.getUser(targetJid) || db.setUser(targetJid)
    const expDisplay = formatNumber(user.exp || 0)
    const level = calculateLevel(user.exp || 0)
    const title = getRole(level)
    
    let text = `*〔 ⭐ EXP INFO 〕*\n\n`

text += `*〔 👤 User 〕* ${targetName}\n`
text += `*〔 ⭐ Exp 〕* ${expDisplay}\n`
text += `*〔 🏆 Level 〕* ${level}\n`
text += `*〔 🎖️ Title 〕* ${title}\n`
    
    await m.reply(text)
}

export { pluginConfig as config, handler }