/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js';
import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'cancelproses',
    alias: ['batalproses', 'canceltrx'],
    category: 'store',
    description: 'Batalkan proses transaksi',
    usage: '.cancelproses @buyer',
    example: '.cancelproses @628xxx',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m) {
    const db = getDatabase()
    let sessions = db.setting('transactionSessions') || {}
    
    const mentioned = m.mentionedJid?.[0]
    const quoted = m.quoted?.sender
    const target = mentioned || quoted
    
    if (!target) {
        if (Object.keys(sessions).length === 0) {
            return m.reply(`❌ Tidak ada transaksi aktif`)
        }
        
        let list = `📋 *ᴛʀᴀɴsᴀᴋsɪ ᴀᴋᴛɪꜰ*\n\n`
        for (const [jid, session] of Object.entries(sessions)) {
            list += `> @${jid.split('@')[0]} - ${session.produk} (${session.nominal})\n`
        }
        list += `\n> Batalkan dengan \`${m.prefix}cancelproses @buyer\``
        
        return m.reply(list, { mentions: Object.keys(sessions) })
    }
    
    if (!sessions[target]) {
        return m.reply(`❌ Tidak ada transaksi aktif untuk user ini`)
    }
    
    const session = sessions[target]
    delete sessions[target]
    db.setting('transactionSessions', sessions)
    await db.save()
    
    m.reply(
        `✅ *ᴛʀᴀɴsᴀᴋsɪ ᴅɪʙᴀᴛᴀʟᴋᴀɴ*\n\n` +
        `> Produk: ${session.produk}\n` +
        `> Buyer: @${target.split('@')[0]}`,
        { mentions: [target] }
    )
}

export { pluginConfig as config, handler };
