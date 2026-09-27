/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import { calculateLevel, getRole, checkAndNotifyLevelUp } from './../../src/lib/elaina-level.js'

const pluginConfig = {
    name: 'addlevel',
    alias: ['tambahlevel', 'givelevel', 'addlvl'],
    category: 'owner',
    description: 'Tambah level user (via exp)',
    usage: '.addlevel <jumlah> @user',
    example: '.addlevel 5 @user',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

function extractTarget(m) {
    if (m.quoted) return m.quoted.sender
    if (m.mentionedJid?.length) return m.mentionedJid[0]
    return null
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const args = m.args
    
    const numArg = args.find(a => !isNaN(a) && !a.startsWith('@'))
    let levels = parseInt(numArg) || 0
    
    let targetJid = extractTarget(m)
    
    if (!targetJid && levels > 0) {
        targetJid = m.sender
    }
    
    if (!targetJid || levels <= 0) {
        return m.reply(
            `📊 *ADD LEVEL*\n\n` +
            `Sistem untuk menambahkan level kepada member secara instan.\n\n` +
            `*PENGGUNAAN:*\n` +
            `- *${m.prefix}addlevel <jumlah>* — (ke diri sendiri)\n` +
            `- *${m.prefix}addlevel <jumlah> @user* — (ke orang lain)\n\n` +
            `*CONTOH PENGGUNAAN:*\n` +
            `- *${m.prefix}addlevel 5*\n` +
            `- *${m.prefix}addlevel 10 @user*`
        )
    }
    
    await m.react('🕕')
    
    const user = db.getUser(targetJid) || db.setUser(targetJid, {})
    if (!user.rpg) user.rpg = {}
    
    const expToAdd = levels * 10000
    
    const oldExp = user.exp || 0
    const newExp = db.updateExp(targetJid, expToAdd)
    user.exp = newExp
    
    const mockM = { ...m, sender: targetJid, pushName: m.pushName }
    const addResult = await checkAndNotifyLevelUp(sock, mockM, db, user, oldExp, newExp)
    
    db.setUser(targetJid, user)
    
    await m.react('✅')
    
    const finalLevel = addResult.newLevel || calculateLevel(user.exp)
    
    await m.reply(
        `✅ *BERHASIL MENAMBAH LEVEL*\n\n` +
        `Level milik *@${targetJid.split('@')[0]}* telah sukses ditambahkan sebanyak *${levels} Level*.\n\n` +
        `*Statistik Terkini:*\n` +
        `- Level Sekarang: *${finalLevel}*\n` +
        `- Role Saat Ini: *${getRole(finalLevel)}*\n` +
        `- Total XP: *${user.exp.toLocaleString()}* XP`,
        { mentions: [targetJid] }
    )
}

export { pluginConfig as config, handler }