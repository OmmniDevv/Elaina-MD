/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import config from '../../config.js'
import moment from 'moment-timezone'
const pluginConfig = {
    name: 'intro',
    alias: ['perkenalan', 'selamatdatang'],
    category: 'group',
    description: 'Tampilkan pesan intro grup',
    usage: '.intro',
    example: '.intro',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

const DEFAULT_INTRO = `halo kak @user 🖐

Kenalan dulu yukk
- Nama : 
- Umur : 
- Asal : 
- Hobi : 
- Status : 

Semoga betah yahh, di grup @group

> Untuk Owner:
ganti intro bawaan dengan .setintro <text>`
 function parsePlaceholders(text, m, groupMeta) {
    const now = moment().tz('Asia/Jakarta')
    const dateStr = now.format('D MMMM YYYY')
    const timeStr = now.format('HH:mm')
    
    return text
        .replace(/@user/gi, `@${m.sender.split('@')[0]}`)
        .replace(/@group/gi, groupMeta?.subject || 'Grup')
        .replace(/@count/gi, groupMeta?.participants?.length || '0')
        .replace(/@date/gi, dateStr)
        .replace(/@time/gi, timeStr)
        .replace(/@desc/gi, groupMeta?.desc || 'Tidak ada deskripsi')
        .replace(/@botname/gi, config.bot?.name || 'Rimuru-AI')
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const groupData = db.getGroup(m.chat) || db.setGroup(m.chat)
    const groupMeta = m.groupMetadata
    
    const introText = groupData.intro || DEFAULT_INTRO
    const parsed = parsePlaceholders(introText, m, groupMeta)
    
    await m.reply(parsed, { mentions: [m.sender] })
}

export { pluginConfig as config, handler, parsePlaceholders, DEFAULT_INTRO }